#!/usr/bin/env swift
// Extract reference PNGs with AVFoundation (macOS 13+; no ffmpeg).
// Usage: swift .github/scripts/frames.swift INPUT [OUTPUT] [--fps 2] [--start 0] [--end SECONDS]
// OUTPUT defaults to <input-parent>/<input-stem>-frames. It must not exist.
// frames.json records requested/actual timestamps. Rotation is applied to PNGs.

import AVFoundation
import Foundation
import ImageIO
import UniformTypeIdentifiers

struct Failure: LocalizedError {
    let message: String
    var errorDescription: String? { message }
    init(_ message: String) { self.message = message }
}

func extract() async throws {
    let args = Array(CommandLine.arguments.dropFirst())
    if args.contains("--help") || args.contains("-h") {
        print("Usage: swift frames.swift INPUT [OUTPUT] [--fps 2] [--start 0] [--end SECONDS]")
        return
    }
    var paths: [String] = []
    var fps = 2.0, start = 0.0
    var end: Double?
    var i = 0
    while i < args.count {
        let arg = args[i]
        if ["--fps", "--start", "--end"].contains(arg) {
            i += 1
            guard i < args.count, let value = Double(args[i]), value.isFinite else {
                throw Failure("\(arg) requires a finite number")
            }
            if arg == "--fps" { fps = value }
            if arg == "--start" { start = value }
            if arg == "--end" { end = value }
        } else if arg.hasPrefix("-") {
            throw Failure("Unknown option: \(arg)")
        } else {
            paths.append(arg)
        }
        i += 1
    }
    guard (1...2).contains(paths.count), fps > 0, fps <= 240, start >= 0 else {
        throw Failure("Usage: swift frames.swift INPUT [OUTPUT] [--fps 2] [--start 0] [--end SECONDS]; fps must be in (0, 240]")
    }
    let fm = FileManager.default
    let input = URL(fileURLWithPath: paths[0]).standardizedFileURL
    let output = paths.count == 2 ? URL(fileURLWithPath: paths[1]).standardizedFileURL
        : input.deletingLastPathComponent()
            .appendingPathComponent(input.deletingPathExtension().lastPathComponent + "-frames")
    guard fm.fileExists(atPath: input.path) else { throw Failure("Input does not exist: \(input.path)") }
    guard !fm.fileExists(atPath: output.path) else {
        throw Failure("Output already exists; choose a new folder: \(output.path)")
    }
    let asset = AVURLAsset(url: input)
    let duration = try await asset.load(.duration).seconds
    guard let track = try await asset.loadTracks(withMediaType: .video).first else {
        throw Failure("No video track in \(input.lastPathComponent)")
    }
    guard duration.isFinite, duration > 0 else { throw Failure("Video has no finite duration") }
    let stop = end ?? duration
    guard stop > start, stop <= duration, start < duration else {
        throw Failure("Require 0 <= start < end <= video duration (\(duration)s)")
    }
    let rate = try await track.load(.nominalFrameRate)
    let generator = AVAssetImageGenerator(asset: asset)
    generator.appliesPreferredTrackTransform = true
    generator.requestedTimeToleranceBefore = .zero
    generator.requestedTimeToleranceAfter = .zero
    // Use a sibling staging folder so failed extractions leave no partial result.
    try fm.createDirectory(at: output.deletingLastPathComponent(), withIntermediateDirectories: true)
    let staging = output.deletingLastPathComponent().appendingPathComponent(".frames-" + UUID().uuidString)
    try fm.createDirectory(at: staging, withIntermediateDirectories: false)
    defer { try? fm.removeItem(at: staging) }
    var records: [[String: Any]] = []
    let count = max(1, Int(ceil((stop - start) * fps - 1e-9)))
    for index in 0..<count {
        let seconds = start + Double(index) / fps
        let result = try await generator.image(at: CMTime(seconds: seconds, preferredTimescale: 600_000))
        let name = String(format: "frame-%06d.png", index)
        try autoreleasepool {
            guard let destination = CGImageDestinationCreateWithURL(
                staging.appendingPathComponent(name) as CFURL, UTType.png.identifier as CFString, 1, nil
            ) else { throw Failure("Cannot create \(name)") }
            CGImageDestinationAddImage(destination, result.image, nil)
            guard CGImageDestinationFinalize(destination) else { throw Failure("Cannot write \(name)") }
        }
        records.append(["file": name, "requested_seconds": seconds,
                        "actual_seconds": result.actualTime.seconds,
                        "width": result.image.width, "height": result.image.height])
    }
    let manifest: [String: Any] = ["source": input.lastPathComponent, "duration_seconds": duration,
        "source_fps": rate, "extraction_fps": fps, "start_seconds": start,
        "end_seconds": stop, "frames": records]
    try JSONSerialization.data(withJSONObject: manifest, options: [.prettyPrinted, .sortedKeys])
        .write(to: staging.appendingPathComponent("frames.json"))
    try fm.moveItem(at: staging, to: output)
    print("Extracted \(count) frames at \(fps) fps → \(output.path)")
}

Task {
    do { try await extract(); exit(0) }
    catch {
        FileHandle.standardError.write(Data("frames: \(error.localizedDescription)\n".utf8))
        exit(1)
    }
}
dispatchMain()

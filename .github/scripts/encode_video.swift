#!/usr/bin/env swift
// Encode numbered PNGs or JPEGs as H.264 using AVFoundation.
// Usage: swift encode_video.swift FRAMES OUTPUT.mp4 [FPS=24]
// Called by export_design.py; opaque PNGs are expected. Odd dimensions are
// padded by at most one pixel for H.264. Existing output files are never replaced.

import AVFoundation
import CoreGraphics
import Foundation
import ImageIO

struct Failure: LocalizedError {
    let message: String
    var errorDescription: String? { message }
    init(_ message: String) { self.message = message }
}

func readImage(_ url: URL) throws -> CGImage {
    guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
        throw Failure("Cannot read frame image: \(url.path)")
    }
    return image
}

func encode() async throws {
    let args = Array(CommandLine.arguments.dropFirst())
    if args.contains("--help") || args.contains("-h") {
        print("Usage: swift encode_video.swift FRAMES OUTPUT.mp4 [FPS=24]")
        return
    }
    guard (2...3).contains(args.count), let fps = Int32(args.count == 3 ? args[2] : "24"),
          fps > 0, fps <= 240 else { throw Failure("Usage: swift encode_video.swift FRAMES OUTPUT.mp4 [FPS=24]") }
    let fm = FileManager.default
    let directory = URL(fileURLWithPath: args[0])
    let output = URL(fileURLWithPath: args[1]).standardizedFileURL
    guard !fm.fileExists(atPath: output.path) else { throw Failure("Output already exists: \(output.path)") }
    let frames = try fm.contentsOfDirectory(at: directory, includingPropertiesForKeys: nil)
        .filter { $0.lastPathComponent.hasPrefix("frame-") && ["png", "jpg"].contains($0.pathExtension) }
        .sorted { $0.lastPathComponent < $1.lastPathComponent }
    guard let first = frames.first else { throw Failure("No numbered PNG or JPEG frames in \(directory.path)") }
    for (index, frame) in frames.enumerated() {
        guard frame.lastPathComponent == String(format: "frame-%06d.", index) + first.pathExtension else {
            throw Failure("Use one image format and contiguous frame numbers starting at zero")
        }
    }
    let image = try readImage(first)
    let width = image.width + image.width % 2, height = image.height + image.height % 2
    let writer = try AVAssetWriter(outputURL: output, fileType: .mp4)
    var completed = false
    defer {
        if !completed { writer.cancelWriting(); try? fm.removeItem(at: output) }
    }
    let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
        AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: width, AVVideoHeightKey: height,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: max(1_000_000, min(24_000_000, width * height * 6)),
            AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
            AVVideoExpectedSourceFrameRateKey: fps,
            AVVideoMaxKeyFrameIntervalKey: fps,
            AVVideoAllowFrameReorderingKey: false
        ]
    ])
    input.expectsMediaDataInRealTime = false
    input.mediaTimeScale = fps
    let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
        kCVPixelBufferWidthKey as String: width, kCVPixelBufferHeightKey as String: height,
        kCVPixelBufferCGImageCompatibilityKey as String: true,
        kCVPixelBufferCGBitmapContextCompatibilityKey as String: true
    ])
    guard writer.canAdd(input) else { throw Failure("H.264 settings unsupported at \(width)x\(height)") }
    writer.add(input)
    writer.shouldOptimizeForNetworkUse = true
    guard writer.startWriting() else { throw Failure(writer.error?.localizedDescription ?? "Cannot start encoder") }
    writer.startSession(atSourceTime: .zero)
    guard let pool = adaptor.pixelBufferPool else { throw Failure("Cannot allocate pixel buffer pool") }
    var previousFile: NSNumber?
    var previousBuffer: CVPixelBuffer?
    for (index, frame) in frames.enumerated() {
        let deadline = Date().addingTimeInterval(60)
        while !input.isReadyForMoreMediaData {
            guard writer.status == .writing, Date() < deadline else {
                throw Failure(writer.error?.localizedDescription ?? "Encoder timed out waiting for a frame")
            }
            try await Task.sleep(nanoseconds: 2_000_000)
        }
        let timestamp = CMTime(value: Int64(index), timescale: fps)
        let attributes = try fm.attributesOfItem(atPath: frame.path)
        let fileNumber = attributes[.systemFileNumber] as? NSNumber
        if let fileNumber, fileNumber == previousFile, let previousBuffer {
            // The exporter hard-links a held pose. Append the same immutable
            // pixel buffer at its new timestamp without decoding the PNG again.
            guard adaptor.append(previousBuffer, withPresentationTime: timestamp) else {
                throw Failure(writer.error?.localizedDescription ?? "Cannot append held frame \(index)")
            }
            continue
        }
        try autoreleasepool {
            let current = try readImage(frame)
            guard current.width == image.width, current.height == image.height else {
                throw Failure("All frames must have the same dimensions: \(frame.lastPathComponent)")
            }
            var optionalBuffer: CVPixelBuffer?
            guard CVPixelBufferPoolCreatePixelBuffer(nil, pool, &optionalBuffer) == kCVReturnSuccess,
                  let buffer = optionalBuffer else { throw Failure("Cannot allocate frame buffer") }
            CVPixelBufferLockBaseAddress(buffer, [])
            defer { CVPixelBufferUnlockBaseAddress(buffer, []) }
            guard let context = CGContext(data: CVPixelBufferGetBaseAddress(buffer), width: width, height: height,
                bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
                space: CGColorSpace(name: CGColorSpace.sRGB)!,
                bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)
            else { throw Failure("Cannot create frame context") }
            context.setFillColor(CGColor(gray: 0, alpha: 1))
            context.fill(CGRect(x: 0, y: 0, width: width, height: height))
            context.draw(current, in: CGRect(x: 0, y: height - current.height,
                                            width: current.width, height: current.height))
            guard adaptor.append(buffer, withPresentationTime: timestamp) else {
                throw Failure(writer.error?.localizedDescription ?? "Cannot append frame \(index)")
            }
            previousBuffer = buffer
            previousFile = fileNumber
        }
    }
    writer.endSession(atSourceTime: CMTime(value: Int64(frames.count), timescale: fps))
    input.markAsFinished()
    await writer.finishWriting()
    guard writer.status == .completed else { throw Failure(writer.error?.localizedDescription ?? "Encoding failed") }
    completed = true
    print("Encoded \(frames.count) frames, \(width)x\(height), \(fps) fps H.264 → \(output.path)")
}

Task {
    do { try await encode(); exit(0) }
    catch {
        FileHandle.standardError.write(Data("encode_video: \(error.localizedDescription)\n".utf8))
        exit(1)
    }
}
dispatchMain()

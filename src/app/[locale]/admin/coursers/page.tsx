"use client";

import { getUploadVideoUrl } from "@/app/actions/s3/getUploadVideoUrl";
import React, { useState, useRef } from "react";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setVideoUrl(null); // Reset video URL when a new file is selected
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Get presigned URL
      const { uploadUrl, videoUrl } = await getUploadVideoUrl(
        file.name,
        file.type
      );

      // Upload to S3 directly
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setUploadProgress(percentComplete);
        }
      };

      // Handle completion
      xhr.onload = () => {
        if (xhr.status === 200) {
          setVideoUrl(videoUrl);
          setUploading(false);

          // Reload video player with the new source
          if (videoRef.current) {
            videoRef.current.load();
          }
        } else {
          throw new Error("Upload failed");
        }
      };

      // Handle errors
      xhr.onerror = () => {
        setError("Upload failed");
        setUploading(false);
      };

      // Send the request
      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to upload video");
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6">Upload & Stream Video</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="upload-section">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select video file
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
              disabled={uploading}
            />
          </div>

          {file && (
            <div className="mb-4 text-sm text-gray-600">
              Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}{" "}
              MB)
            </div>
          )}

          {uploading && (
            <div className="mb-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}

          {videoUrl && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                Video uploaded successfully!
              </p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Open in new tab
              </a>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </button>
        </div>

        <div className="video-player-section">
          <div className="mb-2">
            <h2 className="text-lg font-medium text-gray-700">Video Player</h2>
          </div>
          {videoUrl ? (
            <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                controls
                className="w-full h-full object-contain"
                playsInline
              >
                <source
                  src={
                    videoUrl.startsWith("http")
                      ? videoUrl
                      : `https://${videoUrl}`
                  }
                  type={file?.type || "video/mp4"}
                />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-sm text-center p-4">
                {uploading
                  ? "Video is uploading..."
                  : "Upload a video to play it here"}
              </p>
            </div>
          )}

          {videoUrl && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 break-all">
                Video URL: {videoUrl}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;

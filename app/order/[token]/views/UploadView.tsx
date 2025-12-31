"use client";

import { UploadCloud } from "lucide-react";

export default function UploadView() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
      <div className="w-full max-w-lg text-center">
        {/* Brand */}
        <h1 className="text-3xl font-semibold tracking-tight">
          EverMoment
        </h1>

        {/* Headline */}
        <h2 className="mt-6 text-xl font-medium">
          Upload Your Moments
        </h2>

        {/* Subtext */}
        <p className="mt-2 text-sm text-gray-600">
          Share the photos and videos you’d like us to turn into a timeless memory.
        </p>

        {/* Upload Card */}
        <div className="mt-8 border border-dashed border-gray-300 rounded-xl bg-white p-8 transition hover:border-gray-400">
          <div className="flex flex-col items-center">
            <UploadCloud className="h-10 w-10 text-gray-400" />

            <p className="mt-4 text-sm font-medium">
              Drag & drop your files here
            </p>

            <p className="mt-1 text-xs text-gray-500">
              or select files from your device
            </p>

            <button
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-900 transition"
            >
              Choose Files
            </button>

            <p className="mt-4 text-xs text-gray-400">
              Supported formats: JPG, PNG, MP4, MOV
            </p>
          </div>
        </div>

        {/* Helper */}
        <p className="mt-6 text-xs text-gray-500">
          You can upload multiple files. Don’t worry — you’ll be able to review before final submission.
        </p>
      </div>
    </div>
  );
}

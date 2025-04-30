"use client";

import { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import MuxUploader, {
  MuxUploaderStatus,
  MuxUploaderFileSelect,
  MuxUploaderDrop,
  MuxUploaderProgress,
} from "@mux/mux-uploader-react";
import { muxActions } from "@/app/actions/mux";
import { Button } from "@/components/ui/button";
import { Film, PlusCircleIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLessonStore } from "@/app/store/useLessonStore";
import { useGetCourseId } from "@/app/hooks/useGetCourseId";
import toast from "react-hot-toast";

const LessonVideoUpload = () => {
  const [videoStatus, setVideoStatus] = useState<string>("waiting");
  const [playbackId, setPlaybackId] = useState<string | null>(null);
  const { selectedLessonId } = useLessonStore();
  const { courseId } = useGetCourseId();

  const getUploadUrl = async () => {
    try {
      if (!selectedLessonId) {
        toast.error("Selected lesson ID is required");
        return;
      }
      const { uploadUrl } = await muxActions.createUploadUrl(
        selectedLessonId,
        courseId
      );
      if (!uploadUrl) {
        throw new Error("Failed to retrieve upload URL");
      }

      return uploadUrl;
    } catch (error) {
      console.error("Upload URL error:", error);
      throw error;
    }
  };

  const handleUploadSuccess = () => {
    console.log("Upload successful!");
    setVideoStatus("preparing");

    // In a real app, you'd poll for status
    // For demo, we'll simulate the video becoming ready after 3 seconds
    setTimeout(() => {
      setVideoStatus("ready");
      setPlaybackId("demo-playback-id"); // In production, get this from your API
    }, 3000);
  };

  return (
    <div className="mb-8">
      <Label
        htmlFor="lessonVideo"
        className="text-base font-semibold flex items-center gap-2 mb-2"
      >
        <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
          <Film size={16} className="text-white" />
        </div>
        Lesson Video
      </Label>

      <div className="border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all bg-white">
        <div className="w-full">
          <div className="flex flex-1 flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              {videoStatus === "ready" && (
                <div className="flex flex-1 items-center justify-end gap-3">
                  <MuxUploader
                    noDrop
                    noProgress
                    noRetry
                    noStatus
                    className="hidden"
                    id="my-uploader"
                    endpoint={getUploadUrl as () => Promise<string>}
                    onSuccess={handleUploadSuccess}
                  ></MuxUploader>

                  <div className="w-full flex-1">
                    <MuxUploaderStatus
                      muxUploader="my-uploader"
                      className="text-sm text-gray-600"
                    ></MuxUploaderStatus>
                    <MuxUploaderProgress
                      type="bar"
                      muxUploader="my-uploader"
                      className="w-full [--progress-bar-fill-color:#998ea7] [--progress-bar-height:6px]"
                    ></MuxUploaderProgress>
                  </div>

                  <MuxUploaderFileSelect muxUploader="my-uploader">
                    <Button variant={"default"} className="gap-1 text-gray-100">
                      <PlusCircleIcon className="h-3.5 w-3.5" />
                      <span className="text-base">Change</span>
                    </Button>
                  </MuxUploaderFileSelect>
                </div>
              )}
            </div>

            <div
              className={cn(
                "flex aspect-video min-h-48 grow items-center justify-center rounded-md bg-gray-100",
                videoStatus === "preparing" && "bg-gray-900 animate-pulse"
              )}
            >
              {videoStatus === "ready" && playbackId && (
                <MuxPlayer
                  accentColor="#998ea7"
                  className="aspect-[16/9] overflow-hidden rounded-md"
                  playbackId={playbackId}
                />
              )}

              {videoStatus === "preparing" && (
                <div className="text-white">
                  <h4 className="text-xl font-semibold">Processing...</h4>
                  <p className="mt-3 text-sm">This might take a few minutes!</p>
                </div>
              )}

              {videoStatus === "waiting" && (
                <MuxUploaderDrop
                  overlay
                  overlayText="Drop to upload"
                  muxUploader="my-uploader"
                  className="h-full w-full rounded-md border border-dashed border-gray-700 [--overlay-background-color:#998ea7]"
                >
                  <MuxUploader
                    noDrop
                    noProgress
                    noRetry
                    noStatus
                    id="my-uploader"
                    className="hidden"
                    endpoint={getUploadUrl as () => Promise<string>}
                    onSuccess={handleUploadSuccess}
                  ></MuxUploader>
                  <p slot="heading" className="text-xl font-semibold">
                    Drop a video file here to upload
                  </p>
                  <span
                    slot="separator"
                    className="mt-2 text-sm italic text-muted-foreground"
                  >
                    — or —
                  </span>
                  <div className="w-full">
                    <MuxUploaderStatus muxUploader="my-uploader"></MuxUploaderStatus>
                    <MuxUploaderProgress
                      className="text-sm font-semibold text-gray-800 sm:text-base"
                      muxUploader="my-uploader"
                      type="percentage"
                    ></MuxUploaderProgress>
                    <MuxUploaderProgress
                      type="bar"
                      muxUploader="my-uploader"
                      className="[--progress-bar-fill-color:#998ea7] [--progress-bar-height:8px] sm:[--progress-bar-height:10px]"
                    ></MuxUploaderProgress>
                  </div>
                  <MuxUploaderFileSelect
                    muxUploader="my-uploader"
                    className="mt-4"
                  >
                    <Button variant={"default"} className="gap-1">
                      <PlusCircleIcon className="h-3.5 w-3.5" />
                      <span className="text-base">Select a file</span>
                    </Button>
                  </MuxUploaderFileSelect>
                </MuxUploaderDrop>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonVideoUpload;

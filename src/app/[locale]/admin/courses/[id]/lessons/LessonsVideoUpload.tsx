/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect, useRef } from "react";
import MuxPlayer from "@mux/mux-player-react";
import MuxUploader, {
  MuxUploaderFileSelect,
  MuxUploaderDrop,
  MuxUploaderProgress,
  MuxUploaderStatus,
} from "@mux/mux-uploader-react";
import { muxActions } from "@/app/actions/mux";
import { Button } from "@/components/ui/button";
import { Film, PlusCircleIcon, LockIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLessonStore } from "@/app/store/useLessonStore";
import { useGetCourseId } from "@/app/hooks/useGetCourseId";
import toast from "react-hot-toast";
import { coursesAction } from "@/app/actions/coursers";
import { getOrGenerateTokens } from "@/app/utils/media-tokens";
import { useQuery } from "@tanstack/react-query";

interface LessonVideoUploadProps {
  initialValue?: string;
  onChange: (value: string) => void;
}

const LessonVideoUpload = ({
  onChange,
  initialValue,
}: LessonVideoUploadProps) => {
  const { selectedLessonId, selectedLesson, updateLesson } = useLessonStore();
  const { courseId } = useGetCourseId();

  const { data: courseData } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesAction.courses.getCourse(courseId),
  });

  const course = courseData?.cousre;
  const isPublished = course?.isPublished || false;

  const videoStatus = selectedLesson?.status || "waiting";
  const playbackId = selectedLesson?.videoUrl || initialValue || null;

  const [tokens, setTokens] = useState<{
    thumbnailToken: string;
    playbackToken: string;
    storyboardToken: string;
  } | null>(null);

  const [isPolling, setIsPolling] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const MAX_POLLING_ATTEMPTS = 20;

  useEffect(() => {
    console.log("Playback ID:", playbackId);
    const loadTokens = async () => {
      if (playbackId) {
        const fetchedTokens = await getOrGenerateTokens(playbackId);
        setTokens(fetchedTokens);
      }
    };

    loadTokens();
  }, [playbackId]);

  useEffect(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    if (isPolling && selectedLessonId && courseId) {
      const checkVideoStatus = async () => {
        try {
          setPollingAttempts((prev) => prev + 1);

          if (pollingAttempts >= MAX_POLLING_ATTEMPTS) {
            setIsPolling(false);
            toast.error(
              "Video processing is taking longer than expected. Please check back later."
            );
            return;
          }

          const currentLesson = await coursesAction.lessons.getLesson(
            courseId,
            selectedLessonId
          );

          if (currentLesson) {
            if (
              (currentLesson.status === "preparing" &&
                videoStatus === "waiting") ||
              (currentLesson.status === "ready" &&
                (videoStatus === "waiting" || videoStatus === "preparing"))
            ) {
              updateLesson(selectedLessonId, {
                status: currentLesson.status,
                videoUrl: currentLesson.playbackId || "",
              });
            }

            if (currentLesson.status === "ready") {
              setIsPolling(false);
              setPollingAttempts(0);
              onChange(currentLesson.playbackId || "");
              await coursesAction.lessons.storeBlurPlaceholder(
                selectedLessonId,
                courseId,
                currentLesson.playbackId as string
              );
              toast.success("Video processing complete!");
            }
          }
        } catch (error) {
          console.error("Error checking video status:", error);
        }
      };

      checkVideoStatus();
      pollingIntervalRef.current = setInterval(checkVideoStatus, 5000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [isPolling, selectedLessonId, courseId]);

  const getUploadUrl = async () => {
    try {
      if (isPublished) {
        toast.error("Videos cannot be changed for published courses");
        return null;
      }

      if (!selectedLessonId) {
        toast.error("Selected lesson ID is required");
        return null;
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
    if (isPublished) {
      toast.error("Videos cannot be changed for published courses");
      return;
    }

    setIsPolling(true);
    setPollingAttempts(0);
    if (selectedLessonId) {
      updateLesson(selectedLessonId, {
        status: "preparing",
      });
    }
    toast.success("Upload successful! Processing video...");
  };

  return (
    <div className="mb-4 sm:mb-8">
      <Label
        htmlFor="lessonVideo"
        className="text-sm sm:text-base font-semibold flex items-center gap-2 mb-2"
      >
        <div className="bg-primary w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
          <Film className="text-white w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        Lesson Video
        {isPublished && (
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full flex items-center ml-2">
            <LockIcon className="h-3 w-3 mr-1" /> Published
          </span>
        )}
      </Label>

      <div className="border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all bg-white">
        <div className="w-full">
          <div className="flex flex-1 flex-col gap-2 sm:gap-3 p-3 sm:p-4">
            {videoStatus === "ready" && (
              <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
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
                      className="text-xs sm:text-sm text-gray-600"
                    ></MuxUploaderStatus>
                    <MuxUploaderProgress
                      type="bar"
                      muxUploader="my-uploader"
                      className="w-full [--progress-bar-fill-color:#998ea7] [--progress-bar-height:4px] lg:[--progress-bar-height:6px]"
                    ></MuxUploaderProgress>
                  </div>

                  <MuxUploaderFileSelect muxUploader="my-uploader">
                    <Button
                      variant={"default"}
                      className="h-8 sm:h-10 gap-1 text-gray-100 text-xs sm:text-sm"
                      disabled={isPublished}
                    >
                      <PlusCircleIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>Change</span>
                    </Button>
                  </MuxUploaderFileSelect>
                </div>
              </div>
            )}

            <div
              className={cn(
                "flex aspect-video min-h-40 sm:min-h-48 grow items-center justify-center rounded-md bg-gray-100 relative",
                videoStatus === "preparing" && "bg-gray-900 animate-pulse"
              )}
            >
              {videoStatus === "ready" && playbackId && tokens && (
                <>
                  <MuxPlayer
                    tokens={{
                      thumbnail: tokens?.thumbnailToken,
                      playback: tokens?.playbackToken,
                      storyboard: tokens?.storyboardToken,
                    }}
                    streamType="on-demand"
                    accentColor="#998ea7"
                    className="aspect-[16/9] overflow-hidden rounded-md"
                    playbackId={playbackId}
                  />
                  {isPublished && (
                    <div className="absolute top-2 right-2 bg-gray-900/70 text-white rounded-md px-2 py-1 text-xs flex items-center">
                      <LockIcon className="h-3 w-3 mr-1" />
                      Published
                    </div>
                  )}
                </>
              )}

              {videoStatus === "preparing" && (
                <div className="text-white text-center">
                  <h4 className="text-lg sm:text-xl font-semibold">
                    Processing...
                  </h4>
                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm">
                    This might take a few minutes!
                  </p>
                  {pollingAttempts > 0 && (
                    <p className="mt-1 text-xs text-gray-300">
                      {MAX_POLLING_ATTEMPTS - pollingAttempts} attempts
                      remaining
                    </p>
                  )}
                </div>
              )}

              {videoStatus === "waiting" && (
                <>
                  {isPublished ? (
                    <div className="text-center p-4">
                      <LockIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <h4 className="text-lg font-semibold text-gray-700">
                        Video Locked
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        This course is published and videos cannot be changed.
                      </p>
                    </div>
                  ) : (
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
                      <p
                        slot="heading"
                        className="text-lg sm:text-xl font-semibold"
                      >
                        Drop a video file here to upload
                      </p>
                      <span
                        slot="separator"
                        className="mt-1 sm:mt-2 text-xs sm:text-sm italic text-muted-foreground"
                      >
                        — or —
                      </span>
                      <div className="w-full">
                        <MuxUploaderStatus muxUploader="my-uploader"></MuxUploaderStatus>
                        <MuxUploaderProgress
                          className="text-xs sm:text-sm font-semibold text-gray-800"
                          muxUploader="my-uploader"
                          type="percentage"
                        ></MuxUploaderProgress>
                        <MuxUploaderProgress
                          type="bar"
                          muxUploader="my-uploader"
                          className="[--progress-bar-fill-color:#998ea7] [--progress-bar-height:6px] lg:[--progress-bar-height:8px]"
                        ></MuxUploaderProgress>
                      </div>
                      <MuxUploaderFileSelect
                        muxUploader="my-uploader"
                        className="mt-2 sm:mt-4"
                      >
                        <Button
                          variant={"default"}
                          className="h-8 sm:h-10 gap-1 text-xs sm:text-sm"
                        >
                          <PlusCircleIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          <span>Select a file</span>
                        </Button>
                      </MuxUploaderFileSelect>
                    </MuxUploaderDrop>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonVideoUpload;

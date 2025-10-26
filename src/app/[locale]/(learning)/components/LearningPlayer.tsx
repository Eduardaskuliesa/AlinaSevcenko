"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { Lesson } from "@/app/types/course";
import { getOrGenerateTokens } from "@/app/utils/media-tokens";
import { useCoursePlayerStore } from "@/app/store/useCoursePlayerStore";
import CustomControls from "./CustomControls";
import { enrolledCourseActions } from "@/app/actions/enrolled-course";
import { useQueryClient } from "@tanstack/react-query";

interface LearningPlayerProps {
  currentLesson: Lesson | undefined;
  courseId: string;
  userId: string;
  setUseLessonProgress: React.Dispatch<
    React.SetStateAction<
      Record<
        string,
        { progress: number; wasReworked: boolean; completedAt: string | null }
      >
    >
  >;
  localLessonProgress: Record<
    string,
    { progress: number; wasReworked: boolean; completedAt: string | null }
  >;
  lessonProgress: Record<
    string,
    { progress: number; wasReworked: boolean; completedAt: string | null }
  >;
}

const LearningPlayer = ({
  currentLesson,
  setUseLessonProgress,
  localLessonProgress,
  courseId,
  userId,
}: LearningPlayerProps) => {
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<React.ComponentRef<typeof MuxPlayer>>(null);
  const [tokens, setTokens] = useState<null | {
    thumbnailToken: string;
    playbackToken: string;
    storyboardToken: string;
  }>(null);
  const queryClient = useQueryClient();
  const [autoplay, setAutoplay] = useState(false);
  const [showCustomControls, setShowCustomControls] = useState(false);

  const {
    selectedLessonId,
    isLessonChanging,
    setIsLessonChanging,
    nextLesson,
  } = useCoursePlayerStore();

  useEffect(() => {
    const loadTokens = async () => {
      if (currentLesson?.playbackId && selectedLessonId) {
        setTokens(null);

        const fetchedTokens = await getOrGenerateTokens(
          currentLesson.playbackId
        );
        setTokens(fetchedTokens);
        setTimeout(() => {
          setIsLessonChanging(false);
        }, 200);
      }
    };

    loadTokens();
  }, [
    currentLesson?.playbackId,
    isLessonChanging,
    selectedLessonId,
    setIsLessonChanging,
  ]);

  const handleMouseMove = () => {
    setShowCustomControls(true);

    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }

    hideTimeout.current = setTimeout(() => {
      setShowCustomControls(false);
    }, 2000);
  };

  const handleMouseLeave = () => {
    setShowCustomControls(false);
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
  };

  const handleTimeUpdate = useCallback(() => {
    const player = playerRef.current;
    if (!player || !currentLesson) return;

    const currentTime = player.currentTime || 0;
    const duration = currentLesson.duration;

    if (duration > 0) {
      const percentWatched = (currentTime / duration) * 100;
      const milestone = Math.floor(percentWatched / 10) * 10;
      const currentPlayingLesson = localLessonProgress[currentLesson.lessonId];

      if (milestone > 0 && milestone > (currentPlayingLesson?.progress || 0)) {
        setUseLessonProgress((prev) => ({
          ...prev,
          [currentLesson.lessonId]: {
            progress: milestone,
            completed: false,
            wasReworked: currentPlayingLesson.wasReworked,
            completedAt: currentPlayingLesson.completedAt,
          },
        }));

        enrolledCourseActions.updateLessonProgress({
          userId,
          courseId,
          lessonId: currentLesson.lessonId,
          progress: milestone,
          completed: false,
        });
      }

      if (percentWatched >= 95 && !currentPlayingLesson.completedAt) {
        setUseLessonProgress((prev) => ({
          ...prev,
          [currentLesson.lessonId]: {
            progress: 100,
            completed: true,
            wasReworked: currentPlayingLesson.wasReworked,
            completedAt: new Date().toISOString(),
          },
        }));

        enrolledCourseActions.updateLessonProgress({
          userId,
          courseId,
          lessonId: currentLesson.lessonId,
          progress: 100,
          completed: true,
        });
        queryClient.invalidateQueries({
          queryKey: ["lesson-progress", userId, courseId],
        });
      }
    }
  }, [
    currentLesson,
    localLessonProgress,
    setUseLessonProgress,
    userId,
    courseId,
    queryClient,
  ]);

  return (
    <div className="h-[80vh] xl:h-[calc(100vh-73px)] w-full">
      {isLessonChanging || !tokens || !currentLesson?.playbackId ? (
        <div className="bg-black w-full h-[90%] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4" />
        </div>
      ) : (
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative h-full xl:h-[90%] w-full"
        >
          <CustomControls
            courseId={courseId}
            userId={userId}
            showCustomControls={showCustomControls}
          />
          <MuxPlayer
            ref={playerRef}
            className="absolute"
            onPlay={() => {
              setAutoplay(true);
            }}
            onEnded={() => {
              nextLesson(courseId, userId);
              setIsLessonChanging(true);
            }}
            onTimeUpdate={handleTimeUpdate}
            autoPlay={autoplay}
            tokens={{
              thumbnail: tokens.thumbnailToken,
              playback: tokens.playbackToken,
              storyboard: tokens.storyboardToken,
            }}
            placeholder={currentLesson.blurPlaceholder || undefined}
            streamType="on-demand"
            accentColor="#998ea7"
            style={{ height: "100%", width: "100%" }}
            playbackId={currentLesson.playbackId}
          />
        </div>
      )}
    </div>
  );
};

export default LearningPlayer;

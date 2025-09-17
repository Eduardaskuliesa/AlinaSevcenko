"use client";
import React, { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { Lesson } from "@/app/types/course";
import { getOrGenerateTokens } from "@/app/utils/media-tokens";
import { useCoursePlayerStore } from "@/app/store/useCoursePlayerStore";

interface LearningPlayerProps {
  currentLesson: Lesson | undefined;
}

const LearningPlayer = ({ currentLesson }: LearningPlayerProps) => {
  const [tokens, setTokens] = useState<null | {
    thumbnailToken: string;
    playbackToken: string;
    storyboardToken: string;
  }>(null);

  const { selectedLessonId, isLessonChanging, setIsLessonChanging } =
    useCoursePlayerStore();

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

  return (
    <div className="h-full w-full relative">
      {isLessonChanging || !tokens || !currentLesson?.playbackId ? (
        <div className="bg-black w-full h-[90%] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4" />
        </div>
      ) : (
        <MuxPlayer
          tokens={{
            thumbnail: tokens.thumbnailToken,
            playback: tokens.playbackToken,
            storyboard: tokens.storyboardToken,
          }}
          placeholder={currentLesson.blurPlaceholder || undefined}
          streamType="on-demand"
          accentColor="#998ea7"
          style={{ height: "90%", width: "100%" }}
          playbackId={currentLesson.playbackId}
        />
      )}
    </div>
  );
};

export default LearningPlayer;

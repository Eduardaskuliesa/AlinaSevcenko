"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MuxPlayer from "@mux/mux-player-react";
import { Lesson } from "@/app/types/course";
import { getOrGenerateTokens } from "@/app/utils/media-tokens";
import { useCoursePlayerStore } from "@/app/store/useCoursePlayerStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LearningPlayerProps {
  currentLesson: Lesson | undefined;
  courseId: string;
  userId: string;
}

const LearningPlayer = ({
  currentLesson,
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

  const [autoplay, setAutoplay] = useState(false);
  const [showCustomControls, setShowCustomControls] = useState(false);

  const {
    selectedLessonId,
    isLessonChanging,
    setIsLessonChanging,
    nextLesson,
    previousLesson,
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

  return (
    <div className="h-[calc(100vh-73px)] w-full">
      {isLessonChanging || !tokens || !currentLesson?.playbackId ? (
        <div className="bg-black w-full h-[90%] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4" />
        </div>
      ) : (
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative h-[90%] w-full"
        >
          <AnimatePresence>
            {showCustomControls && (
              <>
                <motion.div
                  onClick={() => {
                    setIsLessonChanging(true);
                    previousLesson(courseId, userId);
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute hover:cursor-pointer hover:bg-primary/90 flex items-center justify-center bg-primary rounded-md border border-secondary top-[40%] left-0 w-8 h-12 z-10"
                >
                  <ChevronLeft className="h-20 w-20" />
                </motion.div>
                <motion.div
                  onClick={() => {
                    setIsLessonChanging(true);
                    nextLesson(courseId, userId);
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute hover:cursor-pointer hover:bg-primary/90 flex items-center justify-center bg-primary rounded-md border border-secondary top-[40%] right-0 w-8 h-12 z-10"
                >
                  <ChevronRight className="h-20 w-20" />
                </motion.div>
              </>
            )}
          </AnimatePresence>
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

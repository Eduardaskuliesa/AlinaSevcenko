"use client";
import React, { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { getOrGenerateTokens } from "@/app/utils/media-tokens";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Lesson } from "@/app/types/course";

const PreviewPlayer = ({ lessonData }: { lessonData: Lesson }) => {
  const [tokens, setTokens] = useState<null | {
    thumbnailToken: string;
    playbackToken: string;
    storyboardToken: string;
  }>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTokens = async () => {
      setIsLoading(true);

      if (lessonData?.playbackId) {
        try {
          const fetchedTokens = await getOrGenerateTokens(
            lessonData.playbackId
          );
          setTokens(fetchedTokens);
        } catch (error) {
          console.error("Failed to get tokens:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadTokens();
  }, [lessonData?.playbackId]);

  if (isLoading) {
    return (
      <div className="aspect-[16/9] w-full relative ">
        <Skeleton className="w-full h-full bg-slate-400 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="aspect-[16/9] w-full relative  rounded-lg">
      {!tokens || !lessonData?.playbackId ? (
        <>
          {lessonData?.blurPlaceholder && (
            <Image
              alt="Lesson placeholder"
              src={lessonData.blurPlaceholder}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          )}
        </>
      ) : (
        <MuxPlayer
          tokens={{
            thumbnail: tokens.thumbnailToken,
            playback: tokens.playbackToken,
            storyboard: tokens.storyboardToken,
          }}
          placeholder={lessonData.blurPlaceholder || undefined}
          streamType="on-demand"
          accentColor="#998ea7"
          style={{ height: "100%", width: "100%" }}
          playbackId={lessonData.playbackId}
        />
      )}
    </div>
  );
};

export default PreviewPlayer;

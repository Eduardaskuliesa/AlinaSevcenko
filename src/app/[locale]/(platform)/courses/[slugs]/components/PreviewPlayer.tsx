"use client";
import React, { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react/lazy";
import { getOrGenerateTokens } from "@/app/utils/media-tokens";
import { Lesson } from "@/app/types/course";

const PreviewPlayer = ({ lessonData }: { lessonData: Lesson }) => {
  const [tokens, setTokens] = useState<null | {
    thumbnailToken: string;
    playbackToken: string;
    storyboardToken: string;
  }>(null);
  const [isTokensLoading, setIsTokensLoading] = useState(true);

  useEffect(() => {
    const loadTokens = async () => {
      if (lessonData?.playbackId) {
        const fetchedTokens = await getOrGenerateTokens(lessonData.playbackId);
        setTokens(fetchedTokens);
      }
      setIsTokensLoading(false);
    };

    loadTokens();
  }, [lessonData?.playbackId]);

  return (
    <div className="aspect-[16/9] w-full relative  rounded-lg">
      {!tokens || !lessonData?.playbackId ? (
        <>{lessonData?.blurPlaceholder && <div className="bg-black w-full h-full" />}</>
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
      {isTokensLoading && (
        <div className="absolute top-2 right-2 bg-black/50 rounded px-2 py-1">
          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default PreviewPlayer;

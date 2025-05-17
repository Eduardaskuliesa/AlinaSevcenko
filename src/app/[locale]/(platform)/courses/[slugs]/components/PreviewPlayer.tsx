"use client";
import React, { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { getOrGenerateTokens } from "@/app/utils/media-tokens";
import { useQuery } from "@tanstack/react-query";
import { coursesAction } from "@/app/actions/coursers";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const PreviewPlayer = ({
  lessonId,
  courseId,
}: {
  lessonId: string;
  courseId: string;
}) => {
  const [tokens, setTokens] = useState<null | {
    thumbnailToken: string;
    playbackToken: string;
    storyboardToken: string;
  }>(null);

  const { data: freeLesson, isLoading } = useQuery({
    queryKey: [`${lessonId}-lesson`],
    queryFn: () => coursesAction.lessons.getLesson(courseId, lessonId),
    staleTime: 1000 * 60 * 60 * 18,
    refetchOnMount: false, 
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const loadTokens = async () => {
      if (freeLesson?.playbackId) {
        const fetchedTokens = await getOrGenerateTokens(freeLesson.playbackId);
        setTokens(fetchedTokens);
      }
    };

    loadTokens();
  }, [freeLesson?.playbackId]);

  if (isLoading) {
    return (
      <div className="aspect-[16/9] w-full  relative p-4 ">
        <Skeleton className="w-full h-full bg-slate-400 animate-pulse "></Skeleton>
      </div>
    );
  }

  return (
    <div className="aspect-[16/9] w-full  relative p-4 rounded-lg">
      {!tokens || !freeLesson?.playbackId ? (
        <>
          {freeLesson?.blurPlaceholder && (
            <Image
              alt="Lesson placeholder"
              src={freeLesson.blurPlaceholder}
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
          placeholder={freeLesson.blurPlaceholder || undefined}
          streamType="on-demand"
          accentColor="#998ea7"
          style={{ height: "100%", width: "100%" }}
          playbackId={freeLesson.playbackId}
        />
      )}
    </div>
  );
};

export default PreviewPlayer;

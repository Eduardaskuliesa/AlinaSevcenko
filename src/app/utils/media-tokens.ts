import { createSignToken } from "../actions/mux/createSignToken";

interface MediaTokens {
  thumbnailToken: string;
  playbackToken: string;
  storyboardToken: string;
  expiresAt: number;
}

export const getOrGenerateTokens = async (
  playbackId: string
): Promise<Omit<MediaTokens, "expiresAt">> => {
  const storageKey = `media-tokens-${playbackId}`;
  const stored = localStorage.getItem(storageKey);

  if (stored) {
    const tokens: MediaTokens = JSON.parse(stored);

    if (tokens.expiresAt > Date.now()) {
      return {
        thumbnailToken: tokens.thumbnailToken,
        playbackToken: tokens.playbackToken,
        storyboardToken: tokens.storyboardToken,
      };
    }

    localStorage.removeItem(storageKey);
  }
  const token = await createSignToken(playbackId);

  const newTokens: MediaTokens = {
    thumbnailToken: token?.thumbnailToken || "",
    playbackToken: token?.playbackToken || "",
    storyboardToken: token?.storyboardToken || "",
    expiresAt: Date.now() + 60 * 60 * 1000,
  };

  localStorage.setItem(storageKey, JSON.stringify(newTokens));

  return {
    thumbnailToken: newTokens.thumbnailToken,
    playbackToken: newTokens.playbackToken,
    storyboardToken: newTokens.storyboardToken,
  };
};

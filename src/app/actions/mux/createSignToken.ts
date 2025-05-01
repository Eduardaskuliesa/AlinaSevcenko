"use server";
import { Lesson } from "@/app/types/course";
import jwt from "jsonwebtoken";
export async function createSignToken(playbackId: Lesson["playbackId"]) {
  const secret = process.env.MUX_SIGNING_KEY_SECRET || "";
  const keyId = process.env.MUX_SIGNING_KEY_ID || "";

  const decodedSecret = Buffer.from(secret, "base64").toString("ascii");
  try {
    const playbackToken = jwt.sign(
      {
        sub: playbackId,
        aud: "v",
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        kid: keyId,
      },
      decodedSecret,
      { algorithm: "RS256" }
    );
    const storyboardToken = jwt.sign(
      {
        sub: playbackId,
        aud: "s",
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        kid: keyId,
      },
      decodedSecret,
      { algorithm: "RS256" }
    );
    const thumbnailToken = jwt.sign(
      {
        sub: playbackId,
        aud: "t",
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        kid: keyId,
      },
      decodedSecret,
      { algorithm: "RS256" }
    );
    return {
      storyboardToken: storyboardToken,
      playbackToken: playbackToken,
      thumbnailToken: thumbnailToken,
    };
  } catch (error) {
    console.error("Error creating token", error);
  }
}

"use server";

import jwt from "jsonwebtoken";
import sharp from "sharp";

export async function getPlaceholder(playbackId: string) {
  const secret = process.env.MUX_SIGNING_KEY_SECRET || "";
  const keyId = process.env.MUX_SIGNING_KEY_ID || "";

  try {
    const decodedSecret = Buffer.from(secret, "base64").toString("ascii");

    const thumbnailToken = jwt.sign(
      {
        sub: playbackId,
        aud: "t",
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        kid: keyId,
        time: "1",
      },
      decodedSecret,
      { algorithm: "RS256" }
    );

    const imageUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg?token=${thumbnailToken}`;

    const response = await fetch(imageUrl);
    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.status}`);

    const buffer = Buffer.from(await response.arrayBuffer());
    const metadata = await sharp(buffer).metadata();
    const aspectRatio = (metadata.width ?? 1) / (metadata.height ?? 1);

    const baseImage = await sharp(buffer)
      .resize(40, null) 
      .modulate({ brightness: 1.1, saturation: 1.2 }) 
      .blur(12) 
      .gamma(1.1) 
      .jpeg({ quality: 75 }) 
      .toBuffer();


    const overlayImage = await sharp(buffer)
      .resize(40, null)
      .modulate({ brightness: 1.05, saturation: 1.3 }) 
      .blur(8)
      .jpeg({ quality: 70 })
      .toBuffer();

    const finalImage = await sharp(baseImage)
      .composite([
        {
          input: overlayImage,
          blend: "over",
          gravity: "center",
        },
      ])
      .toBuffer();

    const blurDataURL = `data:image/jpeg;base64,${finalImage.toString(
      "base64"
    )}`;

    return {
      blurDataURL,
      aspectRatio,
    };
  } catch (error) {
    console.error("Error creating placeholder:", error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
  }
}

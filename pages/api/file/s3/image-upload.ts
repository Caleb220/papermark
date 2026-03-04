import { NextApiRequest, NextApiResponse } from "next";

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerSession } from "next-auth";
import { nanoid } from "nanoid";

import { ONE_HOUR, ONE_SECOND } from "@/lib/constants";
import { getS3PublicClient } from "@/lib/files/aws-client";
import { CustomUser } from "@/lib/types";

import { authOptions } from "../../auth/[...nextauth]";

const uploadConfig = {
  profile: {
    allowedContentTypes: ["image/png", "image/jpg", "image/jpeg"],
    maximumSizeInBytes: 2 * 1024 * 1024, // 2MB
  },
  assets: {
    allowedContentTypes: [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
      "image/x-icon",
      "image/ico",
    ],
    maximumSizeInBytes: 5 * 1024 * 1024, // 5MB
  },
};

// 7 days in seconds - long-lived presigned GET URL for image display
const IMAGE_GET_EXPIRY = 7 * 24 * 60 * 60;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).end("Unauthorized");
  }

  const type = (req.query.type as string) || "assets";
  if (!(type in uploadConfig)) {
    return res.status(400).json({ error: "Invalid upload type specified." });
  }

  const { fileName, contentType } = req.body as {
    fileName: string;
    contentType: string;
  };

  const config = uploadConfig[type as keyof typeof uploadConfig];
  if (!config.allowedContentTypes.includes(contentType)) {
    return res.status(400).json({ error: "Invalid content type" });
  }

  try {
    const { client, config: storageConfig } = getS3PublicClient();

    const ext = fileName.split(".").pop() || "png";
    const key = `images/${nanoid()}.${ext}`;

    // Generate presigned PUT URL for the client to upload to
    const putCommand = new PutObjectCommand({
      Bucket: storageConfig.bucket,
      Key: key,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(client, putCommand, {
      expiresIn: ONE_HOUR / ONE_SECOND,
    });

    // Generate a long-lived presigned GET URL for displaying the image
    // If a distribution host (CDN) is configured, use that instead
    let publicUrl: string;
    if (storageConfig.distributionHost) {
      publicUrl = `https://${storageConfig.distributionHost}/${key}`;
    } else {
      const getCommand = new GetObjectCommand({
        Bucket: storageConfig.bucket,
        Key: key,
      });
      publicUrl = await getSignedUrl(client, getCommand, {
        expiresIn: IMAGE_GET_EXPIRY,
      });
    }

    return res.status(200).json({ url: uploadUrl, key, publicUrl });
  } catch (error) {
    console.error("Error generating presigned URL for image:", error);
    return res
      .status(500)
      .json({ error: (error as Error).message || "Internal server error" });
  }
}

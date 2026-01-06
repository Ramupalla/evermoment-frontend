// import { S3Client } from "@aws-sdk/client-s3";

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// export default s3;

// #---------------------------------------------------------------------

import {
  S3Client,
  ListObjectsV2Command,
  PutObjectTaggingCommand,
} from "@aws-sdk/client-s3";

/* =========================
   S3 CLIENT (UNCHANGED)
========================= */
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default s3;

/* =========================
   TAG RAW FILES AS DELIVERED
========================= */

/**
 * Tags all raw uploaded files for an order as delivered
 * This enables S3 lifecycle rule to delete them after N days
 */
export async function tagOrderFilesAsDelivered(orderId) {
  const bucket = process.env.AWS_S3_BUCKET;
  const prefix = `raw/${orderId}/`;

  if (!bucket) {
    throw new Error("AWS_S3_BUCKET is not defined");
  }

  // 1️⃣ List all raw files for this order
  const listCommand = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  });

  const { Contents } = await s3.send(listCommand);

  if (!Contents || Contents.length === 0) {
    console.log(`ℹ️ No raw files found for order ${orderId}`);
    return;
  }

  // 2️⃣ Tag each file as delivered=true
  for (const object of Contents) {
    await s3.send(
      new PutObjectTaggingCommand({
        Bucket: bucket,
        Key: object.Key,
        Tagging: {
          TagSet: [
            { Key: "delivered", Value: "true" },
          ],
        },
      })
    );
  }

  console.log(
    `✅ Tagged ${Contents.length} raw files as delivered for order ${orderId}`
  );
}

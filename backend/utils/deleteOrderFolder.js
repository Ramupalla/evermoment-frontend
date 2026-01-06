import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function deleteOrderFolder(orderId) {
  const prefix = `raw/${orderId}/`;

  const listed = await s3.send(
    new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET_NAME,
      Prefix: prefix,
    })
  );

  if (!listed.Contents || listed.Contents.length === 0) {
    console.log(`ℹ️ No files found for ${orderId}`);
    return;
  }

  const objects = listed.Contents.map(obj => ({ Key: obj.Key }));

  await s3.send(
    new DeleteObjectsCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Delete: { Objects: objects },
    })
  );

  console.log(`🧹 Deleted ${objects.length} files for order ${orderId}`);
}

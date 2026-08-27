import { getPayload } from "payload";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import config from "../payload.config.mts";

const MAX_DIMENSION = 2400;
const QUALITY = 82;

const s3 = new S3Client({
    region: process.env.STORAGE_REGION,
    endpoint: process.env.STORAGE_ENDPOINT,
    credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY_ID!,
        secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
    },
});

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
    return Buffer.concat(chunks);
}

const payload = await getPayload({ config });
const { docs } = await payload.find({
    collection: "gallery-media",
    where: { section: { equals: "kids" } },
    limit: 0,
});

let totalBefore = 0;
let totalAfter = 0;
let processed = 0;
let skipped = 0;

for (const doc of docs as { id: number | string; storagePath: string | null; url: string }[]) {
    if (!doc.storagePath) {
        skipped++;
        continue;
    }
    const key = doc.storagePath;
    const obj = await s3.send(new GetObjectCommand({ Bucket: process.env.STORAGE_BUCKET, Key: key }));
    const original = await streamToBuffer(obj.Body as NodeJS.ReadableStream);

    if (original.length <= 1_500_000) {
        totalBefore += original.length;
        totalAfter += original.length;
        skipped++;
        continue;
    }

    const optimized = await sharp(original, { failOn: "none" })
        .rotate()
        .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toBuffer();

    await s3.send(
        new PutObjectCommand({ Bucket: process.env.STORAGE_BUCKET, Key: key, Body: optimized, ContentType: "image/jpeg" })
    );

    totalBefore += original.length;
    totalAfter += optimized.length;
    processed++;
    console.log(`${key}: ${(original.length / 1024 / 1024).toFixed(2)}MB -> ${(optimized.length / 1024).toFixed(0)}KB`);
}

console.log("---");
console.log(`Processed: ${processed}, skipped: ${skipped}`);
console.log(`Total before: ${(totalBefore / 1024 / 1024).toFixed(1)}MB, after: ${(totalAfter / 1024 / 1024).toFixed(1)}MB`);
process.exit(0);

import { DeleteObjectCommand, PutObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { MediaStorage } from "@/lib/storage/mediaStorage";

// Presigned PUT URLs expire quickly — just long enough for the browser to
// finish uploading directly to the bucket.
const PRESIGNED_URL_EXPIRY_SECONDS = 600;

export class S3MediaStorage implements MediaStorage {
    constructor(
        private client: S3Client,
        private bucket: string,
        private publicUrlBase: string
    ) {}

    async getPresignedUploadUrl(key: string, contentType: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: contentType,
        });
        return getSignedUrl(this.client, command, { expiresIn: PRESIGNED_URL_EXPIRY_SECONDS });
    }

    async delete(key: string): Promise<void> {
        await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    }

    getPublicUrl(key: string): string {
        return `${this.publicUrlBase.replace(/\/$/, "")}/${key}`;
    }
}

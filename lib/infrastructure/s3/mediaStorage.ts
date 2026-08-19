import { DeleteObjectCommand, PutObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import type { MediaStorage, UploadMediaInput } from "@/lib/storage/mediaStorage";

export class S3MediaStorage implements MediaStorage {
    constructor(
        private client: S3Client,
        private bucket: string,
        private publicUrlBase: string
    ) {}

    async upload({ key, body, contentType }: UploadMediaInput): Promise<string> {
        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: body,
                ContentType: contentType,
            })
        );
        return this.getPublicUrl(key);
    }

    async delete(key: string): Promise<void> {
        await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    }

    getPublicUrl(key: string): string {
        return `${this.publicUrlBase.replace(/\/$/, "")}/${key}`;
    }
}

export interface UploadMediaInput {
    key: string;
    body: Buffer;
    contentType?: string;
}

export interface MediaStorage {
    upload(input: UploadMediaInput): Promise<string>;
    delete(key: string): Promise<void>;
    getPublicUrl(key: string): string;
}

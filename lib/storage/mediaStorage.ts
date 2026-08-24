export interface MediaStorage {
    getPresignedUploadUrl(key: string, contentType: string): Promise<string>;
    delete(key: string): Promise<void>;
    getPublicUrl(key: string): string;
}

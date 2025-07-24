import path from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

export class FileService {
    private storagePath: string;

    /**
     * Constructor for FileService.
     *
     * @param {string} folder - The folder name for the storage path
     */
    constructor(folder: string) {
        this.storagePath = `${__dirname}/../../../storage/${folder}`; // `storage` directory on the root
    }

    /**
     * Uploads a file to the storage path.
     * @param fileBuffer - The binary buffer of the file (usually from Multer)
     * @param originalName - The original file name to determine extension
     * @returns The stored filename (useful for database or retrieval)
     */
    async uploadFile(fileBuffer: Buffer, originalName: string): Promise<string> {
        await fs.mkdir(this.storagePath, { recursive: true });

        const extension = path.extname(originalName);
        const uniqueName = `${randomUUID()}${extension}`;
        const destinationPath = path.join(this.storagePath, uniqueName);

        await fs.writeFile(destinationPath, fileBuffer);
        return uniqueName;
    }
}

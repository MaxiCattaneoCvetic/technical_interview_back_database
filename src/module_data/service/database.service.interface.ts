export interface DatabaseServiceInterface {
    createDatabase(buffer: Buffer): Promise<unknown>
}
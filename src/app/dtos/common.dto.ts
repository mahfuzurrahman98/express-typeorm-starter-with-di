export interface APIResponseDTO<T = any> {
    message: string;
    data: T;
}

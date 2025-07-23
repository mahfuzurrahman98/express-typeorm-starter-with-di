export interface SelectOption {
    value: string;
    label: string;
}

export interface CursorPaginationMeta {
    hasMore: boolean;
    nextCursor?: string;
    prevCursor?: string;
    total?: number;
}

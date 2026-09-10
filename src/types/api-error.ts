

/**
 * Backend error structure data format
 */
interface ErrorData {
    detail: string
}

export interface ApiErrorState {
    status: number
    data: ErrorData
}
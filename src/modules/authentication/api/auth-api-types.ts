

export interface CurrentUser {
  group: string
  name: string
  email: string
  session_id: string
}


export interface ModelsPagination {
  total_pages: number
  total_records: number
  page: number
  start: number
  end: number
}

export interface PaginationResponse<T> extends ModelsPagination {
  data: T[]
}

export interface ReportsGeneratorDateSchema {
    start_date: string
    end_date: string
}

export type ReportTableHeaders =
  | {
      name: string
      label: string
      isFilter: true
      isSort: false
      filterData: string[]
    }
  | {
      name: string
      label: string
      isFilter: false
      isSort: true
      filterData?: never
    }
  | {
      name: string
      label: string
      isFilter: false
      isSort: false
      filterData?: never
    }

export type FilterStates  = {
  key: string
  value: string
  isSort: boolean
}
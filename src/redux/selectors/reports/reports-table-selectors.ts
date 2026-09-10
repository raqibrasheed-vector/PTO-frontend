
import { reportsTableSliceInitialState } from "@/redux/slices/reports/reports-table-slices"
import type { RootState } from "@/store/store"
import { createSelector } from "@reduxjs/toolkit"


const selectReportsTableHeadersState = (state: RootState) =>
  state.reportsTableHeaders || reportsTableSliceInitialState

/**
 *
 * Selectors to get the user States from the user slice.
 *
 */
export const selectReportsHeader = createSelector([selectReportsTableHeadersState], (reportsTableHeaders) => reportsTableHeaders ?? null)
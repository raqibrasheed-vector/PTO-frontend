import { reportsApiServices } from "@/modules/reports/api/reports-api";
import type { AuditTableHeaders } from "@/modules/reports/api/reports-api-types";
import { createSlice } from "@reduxjs/toolkit";

// INITIAL STATE
export const reportsTableSliceInitialState: Partial<AuditTableHeaders> = {};

const reportsTableSlices = createSlice({
  name: "reportsTableSlices",
  initialState: reportsTableSliceInitialState,

  reducers: {
    /**
     * Resets the currentUser slice state to it's initial state
     *
     * @returns The initial state of the currentUserSlice
     */
    resetCurrentUserState: () => reportsTableSliceInitialState,
  },

  extraReducers(builder) {
    builder
      .addMatcher(
        reportsApiServices.endpoints.getTableHeaders.matchFulfilled,
        (_, action) => {
          return { ...action.payload };
        },
      )
      .addMatcher(
        reportsApiServices.endpoints.getTableHeaders.matchRejected,
        () => {
          // Clear user data when API call fails
          return reportsTableSliceInitialState;
        },
      );
  },
});

export const { resetCurrentUserState } = reportsTableSlices.actions;

export default reportsTableSlices.reducer;

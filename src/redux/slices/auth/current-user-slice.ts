import { authenticationServices } from "@/modules/authentication/api/auth-api";
import type { CurrentUser } from "@/modules/authentication/api/auth-api-types";
import { createSlice } from "@reduxjs/toolkit";

// INITIAL STATE
export const currentUserSliceInitialState: Partial<CurrentUser> = {};

// SLICE
const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: currentUserSliceInitialState,
  reducers: {
    /**
     * Resets the currentUser slice state to it's initial state
     *
     * @returns The initial state of the currentUserSlice
     */
    resetCurrentUserState: () => currentUserSliceInitialState,
  },
  extraReducers(builder) {
    /**
     *
     * Add the matcher for the currentUserSlice state
     *
     * This matcher triggers whenever there is a change in the current user Actions
     */

    builder
      .addMatcher(
        authenticationServices.endpoints.getCurrentUser.matchFulfilled,
        (_, action) => {
          return { ...action.payload };
        },
      )
      .addMatcher(
        authenticationServices.endpoints.getCurrentUser.matchRejected,
        () => {
          // Clear user data when API call fails
          return currentUserSliceInitialState;
        },
      );
  },
});

export const { resetCurrentUserState } = currentUserSlice.actions;

export default currentUserSlice.reducer;

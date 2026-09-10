import { allApi } from '@/services/all-api'
import { configureStore } from '@reduxjs/toolkit'
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query'
import currentUserReducer from "@/redux/slices/auth/current-user-slice";
import reportsTableHeaders from "@/redux/slices/reports/reports-table-slices";


export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [allApi.reducerPath]: allApi.reducer,
    currentUser: currentUserReducer,
    reportsTableHeaders: reportsTableHeaders
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(allApi.middleware),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
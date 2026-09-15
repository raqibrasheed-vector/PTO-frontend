import { allApi } from "@/services/all-api";
import type { CurrentUser } from "./auth-api-types";
import { ApiMethod } from "@/types/api-enums";

export const authenticationServices = allApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    /**
     * authentication services deals with all the authentication routes.
     *
     */
    getCurrentUser: builder.query<CurrentUser, { isShowError: boolean }>({
      query: ({ isShowError }) => ({
        url: "/saml/me",
        method: ApiMethod.GET,
        meta: { isShowError },
      }),
      keepUnusedDataFor: 0,
      providesTags: [],
    }),
    signIn: builder.query<{ url: string }, void>({
      query: () => ({
        url: "/saml/login",
        method: ApiMethod.GET,
      }),
    }),
    signout: builder.mutation<{ isSignout: boolean }, void>({
      query: () => ({
        url: "/saml/signout",
        method: ApiMethod.POST,
      }),
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useSignoutMutation,
  useLazySignInQuery,
} = authenticationServices;

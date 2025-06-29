import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../constanst";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include", // This ensures cookies are sent with every request
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User", "Category"],
  endpoints: () => ({}),
});

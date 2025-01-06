// src/services/orderApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IOrderResponse, IOrder } from "./../../interfaces/order";
import { API_URL } from "../../constants";

interface FilterParams {
  [key: string]: string | number | boolean;
}

interface NewOrderData {
  [key: string]: string | number | boolean; 
}

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL, // Base URL for the API
    prepareHeaders: (headers) => {
      const user = localStorage.getItem("user");
      if (user) {
        const { accessToken } = JSON.parse(user);
        if (accessToken) {
          headers.set("Authorization", `Bearer ${accessToken}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getAllOrders: builder.query<IOrderResponse, FilterParams>({
      query: (filter) => {
        const filteredFilter: { [key: string]: string | number } = {};
        Object.entries(filter).forEach(([key, value]) => {
          if (value) {
            filteredFilter[key] = value as string | number;
          }
        });

        const queryString = Object.entries(filteredFilter)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(
                value.toString()
              )}`
          )
          .join("&");

        return {
          url: `/orders${queryString ? `?${queryString}` : ""}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.rows.map(({ id }: IOrder) => ({
                type: "Orders" as const,
                id,
              })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),
    createOrder: builder.mutation<void, NewOrderData>({
      query: (newOrderData) => ({
        url: "/orders",
        method: "POST",
        body: newOrderData,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    updateOrder: builder.mutation<
      void,
      {
        id: number;
        orderData: { [key: string]: string }
      }
    >({
      query: ({ id, orderData }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body: orderData,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    deleteOrder: builder.mutation<void, number[]>({
      query: (ids) => ({
        url: `/orders`,
        method: "DELETE",
        params: { ids: `[${ids.join(",")}]` },
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;

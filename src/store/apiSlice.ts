import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Order } from '../types';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://671b710f2c842d92c37fedc8.mockapi.io/api/v1/',
});

const customBaseQuery = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 404) {
    return { data: [] };
  }

  return result;
};

const api = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    fetchOrders: builder.query<Order[], { status?: string | null; clientName?: string | null; orderNumber?: number | null }>({
      query: ({ status, clientName, orderNumber }) => {
        const query = new URLSearchParams();
        if (status) query.append('status', status);
        if (clientName) query.append('clientName', clientName);
        if (orderNumber) query.append('orderNumber', orderNumber.toString());
        return `orders?${query.toString()}`;
      },
    }),
    fetchOrderById: builder.query({
      query: (id) => `orders/${id}`,
    }),
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: 'orders',
        method: 'POST',
        body: newOrder,
      }),
    }),
    updateOrder: builder.mutation({
      query: ({ id, ...updatedOrder }) => ({
        url: `orders/${id}`,
        method: 'PUT',
        body: updatedOrder,
      }),
    }),
    deleteOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `orders/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchOrdersQuery,
  useFetchOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = api;

export default api;
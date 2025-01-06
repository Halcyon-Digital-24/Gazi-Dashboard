// import { IOrderResponse } from "./../../interfaces/order";
// import axios from "../../lib";

// // get all products
// const getAllOrders = async (filter: {
//   [key: string]: string | number | boolean;
// }): Promise<IOrderResponse> => {
//   let url = `/orders`;

//   // Filter out keys with false values
//   const filteredFilter: { [key: string]: string | number } = {};
//   Object.entries(filter).forEach(([key, value]) => {
//     // Exclude if value is false or boolean
//     if (value) {
//       filteredFilter[key] = value as string | number;
//     }
//   });

//   if (Object.keys(filteredFilter).length > 0) {
//     const queryString = Object.entries(filteredFilter)
//       .map(
//         ([key, value]) =>
//           `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`
//       )
//       .join("&");

//     // Add query string to the URL
//     url += `?${queryString}`;
//   }

//   const { data } = await axios.get(url);

//   return data;
// };

// // Update Order
// const updateOrder = async (
//   id: number,
//   orderData: { [key: string]: string }
// ) => {
//   const { data } = await axios.patch(`/orders/${id}`, orderData);
//   return data;
// };

// const deleteOrder = async (ids: number[]) => {
//   const idsString = ids.join(",");
//   const { data } = await axios.delete(`/orders/?ids=[${idsString}]`);
//   return data;
// };

// const productService = {
//   getAllOrders,
//   deleteOrder,
//   updateOrder,
// };

// export default productService;

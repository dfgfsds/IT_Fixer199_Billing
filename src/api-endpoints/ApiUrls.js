// @ts-nocheck

const baseUrl =
  import.meta?.env?.VITE_API_BASE_URL ||
  "https://api-test.itfixer199.com";
// "https://api.itfixer199.com";

// https://api-test.itfixer199.com


const login = `${baseUrl}/api/login`;
const allUsers = `${baseUrl}/api/user/all`;
const createUser = `${baseUrl}/api/user`;
const categories = `${baseUrl}/api/category`;
// Products
const products = `${baseUrl}/api/product`;
const productSerialAvailability = `${baseUrl}/api/product-serial/availability/`;

// Orders
const orders = `${baseUrl}/api/order/orders/all/`;
const publicOrder = `${baseUrl}/api/order/public/order/`;
const createOrderPayment = `${baseUrl}/api/order/public/order/`;
const singleOrder = `${baseUrl}/api/order/orders/`;

export default {
  login,
  allUsers,
  products,
  orders,
  categories,
  productSerialAvailability,
  publicOrder,
  createOrderPayment,
  singleOrder,
};
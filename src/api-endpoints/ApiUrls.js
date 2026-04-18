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

// Orders
const orders = `${baseUrl}/api/order/orders/all/`;
export default {
  login,
  allUsers,
  products,
  orders,
};
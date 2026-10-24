import axios from "axios";

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || "https://ecom-zb9o.vercel.app/api"
).replace(/\/+$/, "");

export const api = axios.create({
  baseURL: apiBaseUrl,
});

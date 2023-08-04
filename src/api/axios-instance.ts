import axios from "axios";
import GetFromStorage from "@/components/get-from-local/get-from-local";

const BASEURL = process.env.NEXT_PUBLIC_API_BASE_URL

const axiosInstance = axios.create({
    baseURL: BASEURL,
    timeout: 20000,
    withCredentials: true,
    headers: {
        Authorization: GetFromStorage("access") ? `Bearer ${GetFromStorage("access")}` : null,
        "Content-Type": "application/json",
        accept: "application/json",
    },
});
export default axiosInstance;
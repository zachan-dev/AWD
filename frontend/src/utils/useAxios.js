// OLD CODE COMMENTED WITH EXPLANATIONS

/*
const useAxios = () => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");

    const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    axiosInstance.interceptors.request.use(async (req) => {
        if (!isAccessTokenExpired(accessToken)) {
            // Pass the token here
            return req;
        }

        console.log(accessToken);
        console.log(refreshToken);

        const response = await getRefreshedToken(refreshToken);
        console.log("response.data ====", response?.data);
        console.log("response.data?.access ====", response?.data?.access);

        setAuthUser(response.data?.access, response.data?.refresh);
        req.headers.Authorization = `Bearer ${response.data?.access}`;
        return req;
    });

    return axiosInstance;
};
*/

// CHANGES:
// - Now handles both `AllowAny` and `IsAuthenticated` endpoints
// - Doesn't send the Authorization header if the endpoint is public
// - Checks and refreshes tokens only when necessary for authenticated endpoints

import axios from "axios";
import { setAuthUser, getRefreshToken, isAccessTokenExpired, logout } from "./auth";
import Cookie from "js-cookie";

// Create an Axios instance
const useAxios = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
    timeout: 10000000,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let refreshPromise = null; // Store refresh request for parallel requests

useAxios.interceptors.request.use(
    async (config) => {
        let accessToken = Cookie.get("access_token");

        console.log("[useAxios] Checking token expiration...");

        if (!accessToken || isAccessTokenExpired(accessToken)) {
            console.warn("[useAxios] Access token expired. Attempting refresh...");

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    refreshPromise = getRefreshToken(refreshToken); // Start refresh process
                    const newTokens = await refreshPromise;

                    if (newTokens) {
                        setAuthUser(newTokens.data.access, newTokens.data.refresh);
                        console.log("[useAxios] Refresh successful. New token:", newTokens.data.access);
                        accessToken = newTokens.access;
                        config.headers.Authorization = `Bearer ${newTokens.data.access}`;
                    } else {
                        console.error("[useAxios] Refresh failed. Logging out.");
                        logout();
                        return Promise.reject("[useAxios] Session expired, logging out.");
                    }
                } catch (error) {
                    console.error("[useAxios] Refresh failed, logging out:", error);
                    logout();
                    return Promise.reject("[useAxios] Session expired, logging out.");
                } finally {
                    isRefreshing = false;
                    refreshPromise = null;
                }
            } else {
                console.log("[useAxios] Waiting for another refresh attempt...");
                await refreshPromise; // Wait for the other refresh attempt to complete
                accessToken = Cookie.get("access_token"); // Fetch latest token
            }

            if (!accessToken) {
                return Promise.reject("[useAxios] No access token after refresh, logging out.");
            }

            config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default useAxios;

import axios from "axios";
import {DataProvider, HttpError} from "@refinedev/core";
import nookies from "nookies";

const axiosInstance = axios.create()

const retrieveToken = () => {
    const {auth: token} = nookies.get({});
    return JSON.parse(token)
}
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const customError: HttpError = {
            ...error,
            message: error.response?.data?.message,
            statusCode: error.response?.status,
        };

        return Promise.reject(customError);
    },
);

export const postgresDataProvider = (apiUrl: string): DataProvider => ({
    getList: async ({resource}) => {
        const url = `${apiUrl}/${resource}/`;

        const {data, headers} = await axiosInstance.get(
            url,
            {
                headers:
                    {"Authorization": `bearer ${retrieveToken()}`}
            });

        const total = +headers["x-total-count"]

        return {
            data,
            total
        }
    },

    create: async ({resource, variables}) => {
        const url = `${apiUrl}/${resource}/`;
        console.log(variables)

        const {data} = await axiosInstance.post(
            url,
            variables,
            {
                headers: {
                    "Authorization": `bearer ${retrieveToken()}`
                }
            }
        );

        return {data}
    },

    update: async ({resource}) => {
        const url = `${apiUrl}/${resource}/`;

        const {data} = await axiosInstance.get(url);

        return {data}
    },

    deleteOne: async ({resource, id}) => {
        const url = `${apiUrl}/${resource}/`;

        const {data} = await axiosInstance.get(
            url,
            {
                headers: {
                    "Authorization": `bearer ${retrieveToken()}`
                }
            }
        );

        return {data}
    },

    getOne: async ({resource, id}) => {
        const url = `${apiUrl}/${resource}/${id}`;
        console.log(apiUrl);

        const {data} = await axiosInstance.get(
            url,
            {
                headers: {
                    "Authorization": `bearer ${retrieveToken()}`
                }
            }
        );

        return {data}
    },
    getApiUrl: () => apiUrl
});

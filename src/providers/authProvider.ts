import {AuthBindings} from "@refinedev/core";
import nookies from "nookies";
import axios from "axios";
import {getApiURL} from "../utils/api";
import process from "process";

export const authProvider: AuthBindings = {
    login: async ({email, password}) => {

        // return {
        //     success: true,
        //     redirectTo: "/organisations",
        // }

        const response = await axios.post("http://localhost:8000/api/v1/login/", {email, password});

        if (response.status === 200) {
            const { data } = response
            nookies.set(null, "auth", JSON.stringify(data?.token), {
                maxAge: 60 * 60,
                path: "/",
            });

            localStorage.setItem("refresh", data?.refresh_token)
            return {
                success: true,
                redirectTo: "/organisations",
            }
        }

        return {
            success: false,
            error: {
                name: "LoginError",
                message: "Invalid username or password",
            },
        }
    },
    logout: async () => {
        nookies.destroy(null, "auth");
        localStorage.removeItem("refresh")
        return {
            success: true,
            redirectTo: "/login",
        };
    },
    check: async (ctx: any) => {

        return {
            authenticated: true,
        };

        // const cookies = nookies.get(ctx);
        // if (cookies["auth"]) {
        //     return {
        //         authenticated: true,
        //     };
        // }
        //
        // return {
        //     authenticated: false,
        //     logout: true,
        //     redirectTo: "/login",
        // };
    },
    getPermissions: async () => {
        const auth = nookies.get()["auth"];
        if (auth) {
            const parsedUser = JSON.parse(auth);
            return parsedUser.roles;
        }
        return null;
    },
    getIdentity: async () => {
        const auth = nookies.get()["auth"];
        if (auth) {
            const parsedUser = JSON.parse(auth);
            return parsedUser;
        }
        return null;
    },
    onError: async (error) => {
        console.error(error);
        return {error};
    },
};

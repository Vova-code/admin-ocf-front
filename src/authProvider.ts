import {AuthBindings} from "@refinedev/core";
import nookies from "nookies";
import axios from "axios";
import {log} from "next/dist/server/typescript/utils";

const mockUsers = [
    {
        name: "John Doe",
        email: "johndoe@mail.com",
        roles: ["admin"],
        avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
        name: "Jane Doe",
        email: "janedoe@mail.com",
        roles: ["editor"],
        avatar: "https://i.pravatar.cc/150?img=1",
    },
];
const LOCAL_API_URL: string = "http://localhost:8000/api/v1"

export const authProvider: AuthBindings = {
    login: async ({email, password}) => {
        const response = await axios.post(LOCAL_API_URL + "/login/", {email, password});

        if (response.status === 200) {
            const { data } = response
            nookies.set(null, "auth", JSON.stringify(data?.token), {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
            });

            localStorage.setItem("refresh", data?.refresh_token)
            return {
                success: true,
                redirectTo: "/",
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
        return {
            success: true,
            redirectTo: "/login",
        };
    },
    check: async (ctx: any) => {
        const cookies = nookies.get(ctx);
        if (cookies["auth"]) {
            return {
                authenticated: true,
            };
        }

        return {
            authenticated: false,
            logout: true,
            redirectTo: "/login",
        };
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

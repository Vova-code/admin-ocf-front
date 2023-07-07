import process from "process";

const LOCAL_API_URL: string = "http://localhost:8000/api/v1"
export const getApiURL = (): string => {
    if (process.env.NODE_ENV === "development") {
        return  LOCAL_API_URL
    }
    return process.env.API_URL
}

import { AxiosError } from "axios";

export default interface ApiError extends AxiosError {
    type: string,
    error: {
        [field: string]: string[] | string;
    }[],
    timestamp: string,
}
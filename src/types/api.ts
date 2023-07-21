// AxiosResponse type uses this interface so you can adjust this to your need and then type your api error with AxiosError
export default interface ApiError {
    type: string,
    error: string | { [field: string]: string[] | string }[],
    timestamp: string,
}
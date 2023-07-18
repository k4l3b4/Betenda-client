import axiosInstance from "@/api/axios-instance"
import { ForgotPasswordType, LoginType, RegisterType } from "@/types/auth"

export const loginUser = async (values: LoginType) => {
    const response = await axiosInstance.post("users/login", values)
    return response.data
}


export const registerUser = async ({ values, invitation_code }: { values: RegisterType, invitation_code: any }) => {
    const response = await axiosInstance.post(`users/register/${invitation_code}`, values)
    return response.data
}


export const forgotPassword = async (values: ForgotPasswordType) => {
    const response = await axiosInstance.post("users/forgot_password", values)
    return response.data
}
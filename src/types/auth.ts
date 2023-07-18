export interface RegisterType {
    first_name: string,
    user_name: string,
    email: string,
    password: string,
    password2: string,
}

export interface LoginType {
    email: string,
    password: string,
}


export interface ForgotPasswordType {
    email: string,
}

export interface ChangePasswordType {
    password: string,
    password2: string,
}
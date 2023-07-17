export interface RegisterType {
    first_name: string,
    last_name: string,
    user_name: string,
    email: string,
    sex: "MALE" | "FEMALE",
    birth_date: string,
    terms: boolean,
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
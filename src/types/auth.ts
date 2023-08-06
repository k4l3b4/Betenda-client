export interface RegisterType {
    first_name: string,
    user_name: string,
    email: string,
    password: string,
    password2: string,
}


export interface UpdateProfileType {
    first_name?: string,
    last_name?: string,
    user_name?: string,
    birth_date?: string,
    bio?: string,
    email?: string,
    profile_avatar?: File | any,
    profile_cover?: File | any,
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
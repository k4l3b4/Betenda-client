import { LoginType } from "@/types/auth";

export interface UserType {
    id: number,
    first_name: string,
    last_name: string,
    user_name: string,
    email: string | undefined,
    bio: string | null,
    sex: "MALE" | "FEMALE",
    profile_avatar: string | undefined,
    profile_cover: string | undefined,
    birth_date: string,
    invited_by: number,
    phone_number: string | undefined | null,
    verified: boolean,
    followers_count: number,
    following_count: number,
    follows_requesting_user: boolean | null,
    requesting_user_follows: boolean | null,
    has_rated: boolean,
    terms: boolean,
    is_active: boolean
    joined_date: string,
    last_login: string,
}


export interface ReactionsType {
    user_reacted_with: string | null,
    reaction_count: {
        reaction?: string,
        count?: string,
    }[]
}



export interface UserContextValue {
    User: UserType;
    LoadingUser: boolean;
    isFetching: boolean;
    refetchUser: () => void;
    userError: boolean;
    callGetUser: boolean;
    LoginUser: (values: LoginType) => void;
    LoginLoading: boolean;
    LoginSuccess: boolean;
    LoginError: boolean;
    LogoutUser: () => void;
    returnUrl: string;
    handleSetReturnUrl: (url: string) => void;

}



export interface DataType {
    label: string,
    value: string,
}
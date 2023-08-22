import { LoginType } from "@/types/auth";

export interface UserType {
    id: number,
    first_name: string,
    last_name: string,
    user_name: string,
    email?: string,
    bio: string | null,
    sex: "MALE" | "FEMALE" | null,
    profile_avatar: string | undefined,
    profile_cover: string | undefined,
    birth_date: string,
    invited_by: string,
    phone_number: string | undefined | null,
    verified: boolean,
    followers_count?: number,
    following_count?: number,
    request_to_be_followed?: boolean | null,
    request_to_follow?: boolean | null,
    requested_user_follows?: boolean | null,
    requesting_user_follows?: boolean | null,
    is_private: boolean,
    unread_count?: number,
    has_rated: boolean,
    terms: boolean,
    is_staff: boolean
    is_superuser: boolean
    is_active: boolean
    joined_date: string,
    last_login: string,
}

export interface SimpleUserType {
    id: number,
    first_name: string,
    last_name: string | null,
    user_name: string,
    profile_avatar: string | null,
}

export interface ReactionsType {
    user_reacted_with: string | null,
    reaction_count: {
        reaction: string,
        count: number,
    }[] | []
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
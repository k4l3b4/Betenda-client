import { UserType } from '@/types/global';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useUserContext } from '@/context/user-context';
import { cn } from '@/lib/utils';

const ButtonTypes = {
    FRIENDS: 'Friends',
    FOLLOWING: 'Following',
    FOLLOW: 'Follow',
    FOLLOW_BACK: 'Follow back',
    ACCEPT: 'Accept',
    REQUESTED: 'Requested',
};

type ProfileButtonType = {
    user: UserType | null;
    follow: (id?: number) => void;
    unfollow: (id?: number) => void;
    accept: (id?: number) => void;
    fulfilling: boolean;
    className?: string

}

const ProfileButtonFormatter: React.FC<ProfileButtonType> = ({ user, follow, unfollow, accept, fulfilling, className }) => {
    const { User, LoadingUser } = useUserContext()
    const [loading, setLoading] = useState<boolean>(true);
    const [buttonText, setButtonText] = useState<string>(ButtonTypes.FOLLOW);
    const isUserFollowingRequestedUser = user?.requesting_user_follows;
    const isRequestedUserFollowingUser = user?.requested_user_follows;
    const requestToBeFollowed = user?.request_to_be_followed;
    const requestToFollow = user?.request_to_follow;

    useEffect(() => {
        if (user) {
            setLoading(false);
            updateButtonType();
        }
    }, [user]);

    const updateButtonType = () => {

        if (isUserFollowingRequestedUser && isRequestedUserFollowingUser) {
            setButtonText(ButtonTypes.FRIENDS);
        } else if (isUserFollowingRequestedUser) {
            setButtonText(ButtonTypes.FOLLOWING);
        } else if (requestToFollow) {
            setButtonText(ButtonTypes.REQUESTED);
        } else if (isRequestedUserFollowingUser) {
            setButtonText(ButtonTypes.FOLLOW_BACK);
        } else if (requestToBeFollowed) {
            setButtonText(ButtonTypes.ACCEPT);
        } else {
            setButtonText(ButtonTypes.FOLLOW);
        }
    }

    const handleButtonClick = () => {
        switch (buttonText) {
            case ButtonTypes.FRIENDS:
            case ButtonTypes.FOLLOWING:
                unfollow(); // Calling unfollow function
                break;
            case ButtonTypes.FOLLOW:
            case ButtonTypes.FOLLOW_BACK:
            case ButtonTypes.REQUESTED:
                follow(); // Calling follow function because the request doubles as a follow request and a follow request cancel request💪🏾
                break;
            case ButtonTypes.ACCEPT:
                accept(); // Calling accept function
                break;
            default:
                break;
        }
    };
    if (loading || LoadingUser || User?.id === user?.id) {
        return null
    }

    return (
        <Button className={cn("whitespace-nowrap", className)} onClick={handleButtonClick} disabled={(loading || fulfilling)}>{fulfilling ? "Loading..." : buttonText}</Button>
    );
};

export default ProfileButtonFormatter;
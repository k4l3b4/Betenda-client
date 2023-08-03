import { useMutation } from "@tanstack/react-query";
import { followUser } from "@/api/requests/user/requests";

const useFollowUser = (id: number, onSuccess?: () => void) => {
    const { mutate: follow, isLoading } = useMutation({
        mutationFn: () => followUser(id),
        onSuccess: () => {
            if (onSuccess) {
                onSuccess();
            }
        }
    });

    return { follow, isLoading };
};

export default useFollowUser;

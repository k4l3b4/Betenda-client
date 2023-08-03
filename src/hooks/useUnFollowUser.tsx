import { useMutation } from "@tanstack/react-query";
import { unFollowUser } from "@/api/requests/user/requests";

const useUnFollowUser = (id: number, onSuccess?: () => void) => {
    const { mutate: unFollow, isLoading } = useMutation({
        mutationFn: () => unFollowUser(id),
        onSuccess: () => {
            if (onSuccess) {
                onSuccess();
            }
        }
    });

    return { unFollow, isLoading };
};

export default useUnFollowUser;

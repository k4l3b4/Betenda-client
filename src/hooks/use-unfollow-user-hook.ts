import { useMutation } from "@tanstack/react-query";
import { unFollowUser } from "@/api/requests/user/requests";

const useUnFollowUser = (userId: number | null, onSuccess?: (data: any) => void) => {
    const { mutate: unFollow, isLoading } = useMutation({
        mutationFn: (id?: number) => unFollowUser(id ?? userId as number),
        onSuccess: (data) => {
            if (onSuccess) {
                onSuccess(data);
            }
        }
    });

    return { unFollow, isLoading };
};

export default useUnFollowUser;

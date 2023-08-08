import { useMutation } from "@tanstack/react-query";
import { followUser } from "@/api/requests/user/requests";

const useFollowUser = (userId: number | null, onSuccess?: (data: any) => void) => {
    const { mutate: follow, isLoading } = useMutation({
        mutationFn: (id?: number) => followUser(id ?? userId as number),
        onSuccess: (data: any) => {
            if (onSuccess) {
                onSuccess(data);
            }
        }
    });

    return { follow, isLoading };
};

export default useFollowUser;
import { useMutation } from "@tanstack/react-query";
import { acceptFollowRequest } from "@/api/requests/user/requests";

const useAcceptFollowRequest = (id: number, onSuccess?: () => void) => {
    const { mutate: accept, isLoading } = useMutation({
        mutationFn: () => acceptFollowRequest(id),
        onSuccess: () => {
            if (onSuccess) {
                onSuccess();
            }
        }
    });

    return { accept, isLoading };
};

export default useAcceptFollowRequest;

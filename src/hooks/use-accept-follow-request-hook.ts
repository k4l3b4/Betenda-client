import { useMutation } from "@tanstack/react-query";
import { acceptFollowRequest } from "@/api/requests/user/requests";

const useAcceptFollowRequest = (userId: number | null, onSuccess?: (data: any) => void) => {
    const { mutate: accept, isLoading } = useMutation({
        mutationFn: (id?: number) => acceptFollowRequest(id ?? userId as number),
        onSuccess: (data) => {
            if (onSuccess) {
                onSuccess(data);
            }
        }
    });

    return { accept, isLoading };
};

export default useAcceptFollowRequest;

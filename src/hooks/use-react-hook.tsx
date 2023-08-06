import { useMutation } from "@tanstack/react-query";
import { ReactType, reactToResource } from "@/api/requests/reactions/requests";
import { AxiosError } from "axios";


const useReactHook = (onError?: () => void) => {
    const { mutate, isLoading } = useMutation({
        mutationFn: (data: ReactType) => reactToResource(data),
        onError: () => {
            if (onError) {
                onError()
            }
        },
    });

    return { mutate, isLoading };
};

export default useReactHook;

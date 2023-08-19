import { useMutation } from "@tanstack/react-query";
import { addToBookmark } from "@/api/requests/bookmark/requests";

type UseBookMark = {
    onSuccess?: (data: any) => void,
    onError?: () => void
}


const useBookMark = ({ onSuccess, onError }: UseBookMark) => {
    const { mutate: addtobookmark, isLoading } = useMutation({
        mutationFn: ({ data }: { data: { resource_id: number, resource_type: string } }) => addToBookmark(data),
        onSuccess: (data) => {
            if (onSuccess) {
                onSuccess(data);
            }
        },
        onError: () => {
            if (onError) {
                onError();
            }
        }
    });

    return { addtobookmark, isLoading };
};

export default useBookMark;

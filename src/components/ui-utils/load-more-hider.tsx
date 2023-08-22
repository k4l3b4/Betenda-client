
type LoadMoreHider = {
    children: React.ReactElement,
    page: boolean,
    loading: boolean,
}


const LoadMoreHider: React.FC<LoadMoreHider> = ({ children, page, loading }) => {
    return (
        <>
            {(page || loading) ?
                children
                :
                null
            }
        </>
    );
}

export default LoadMoreHider;
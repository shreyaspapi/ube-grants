import {ClipLoader} from "react-spinners"

export function Spinner ({loading}) {
    return <ClipLoader
        loading={loading}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
    />
}
import { useRef, useEffect } from "react";

const usePrevious = (value: unknown) => {
    const ref = useRef(value);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export default usePrevious;
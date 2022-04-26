import { useState } from "react";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import useConstant from "use-constant";
import { useAsync } from "react-async-hook";

const useDebouncedSearch = (searchFunction: (...args: any[]) => any, waitTime = 300, callEmptyText = true) => {

    const [inputText, setInputText] = useState('');

    const [customParam, setCustomParam] = useState('');

    // Debounce the original search async function
    const debouncedSearchFunction = useConstant(() => AwesomeDebouncePromise(searchFunction, waitTime));

    // The async callback is run each time the text changes,
    // but as the search function is debounced, it does not
    // fire a new request on each keystroke
    const searchResults = useAsync(
        async () => {
            if (inputText.length === 0 && !callEmptyText) {
                return [];
            } else {
                return debouncedSearchFunction(inputText, customParam);
            }
        },
        [debouncedSearchFunction, inputText]
    );

    return {
        inputText,
        setInputText,
        customParam,
        setCustomParam,
        searchResults,
    };
};

export default useDebouncedSearch;
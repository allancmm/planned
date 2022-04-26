import { MSG_REQUIRED_FIELD } from "../../lib/constants";

export interface ResultValidation<T> {
    isValid: boolean,
    newError: T
}

export function validateRequiredFields<T> (objError: T, request: { [key: string] : any }) : ResultValidation<T>  {
    let isValid = true;
    const newError: T = {...objError};
    Object.keys(objError).map((key) => {
        if(!request[key]) {
            // @ts-ignore
            newError[key] = MSG_REQUIRED_FIELD;
            isValid = false;
        }
    });

    return { isValid, newError };
}

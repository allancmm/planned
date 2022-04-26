
export class ErrorValidation {
    public hasError = false;
    public messages: any;

    constructor(hasError?: boolean, messages?: Object) {
        this.hasError = hasError || false;
        this.messages = messages || {};
    }
}

export const buildMessages = (paramObj: Object) : Object =>
    Object.keys(paramObj).reduce((obj, key) => ({...obj, [key]: ''}), new Object());

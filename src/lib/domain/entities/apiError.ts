import { Transform } from 'class-transformer';
import { convertDate } from '../../util/transform';

export class APIError {
    public error: string = '';
    public status?: string;
    public informations: ErrorInformation[] = [];

    // those are not used, i just want to be as similar as possible to java "default" error format
    public message?: string;
    public path?: string;
    @Transform(convertDate)
    public timestamp?: Date;

    public static build(error: string, informations: ErrorInformation[]): APIError {
        const err = new APIError();
        err.error = error;
        err.informations = informations;
        return err;
    }
}

export interface ErrorInformation {
    message: string;
    extraInformation: string;
}

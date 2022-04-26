import { format } from 'date-fns';

export const FORMAT_DATE_STANDARD = "yyyy-MM-dd";
export const FORMAT_DATE_TIME = 'yyyy-MM-dd hh:mm:ss';
export const FORMAT_TIME = 'hh:mm:ss SSS';
export const FORMAT_PALETTE = 'MMM/dd/yyyy (hh:mm.aaa)';

export const dateToString = (date: Date | undefined | null, formatDate = FORMAT_DATE_STANDARD) => {
    if(!date) return "";
    return format(date, formatDate);
};
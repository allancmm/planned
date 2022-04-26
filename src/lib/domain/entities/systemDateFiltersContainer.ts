import {Type} from 'class-transformer';
import {immerable} from 'immer';
import Code from './code';

export default class SystemDateFiltersContainer {
    [immerable] = true;
    public years: string[] = [];
    public months: string[] = [];
    public selectedMonth: string = '';
    public selectedYear: string = '';
    public selectedCalendarCode: string = '';
    @Type(() => Code)  public calendarCodes: Code[] = [];
}
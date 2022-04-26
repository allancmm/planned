import {immerable} from 'immer';

export default class RateGroup {
    [immerable] = true;

    public rateGroupGuid: string = '';
    public integerCriteria: string = '';
    public rateDescription: string = '';
    public criteria1: string = '';
    public criteria2?: string;
    public criteria3?: string;
    public criteria4?: string;
    public criteria5?: string;
    public criteria6?: string;
    public criteria7?: string;
    public criteria8?: string;
    public criteria9?: string;
    public criteria10?: string;
}
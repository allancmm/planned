import Company from './company';
import { Type } from 'class-transformer';

export default class CompanyList {
    @Type(() => Company) public companies: Company[] = [];

    static empty = (): CompanyList => {
        return new CompanyList();
    };
}

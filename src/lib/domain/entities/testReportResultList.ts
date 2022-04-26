import { Type } from 'class-transformer';
import Pageable from '../util/pageable';
import { TestReportResult } from "./testReportResult";

export default class TestReportResultList {
    @Type(() => TestReportResult) public testReportResults: TestReportResult[] = [];
    @Type(() => Pageable) public page: Pageable = new Pageable();

    static empty = (): TestReportResultList => {
        return new TestReportResultList();
    };
}
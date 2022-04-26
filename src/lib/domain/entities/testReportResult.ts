import { immerable } from "immer";
import {Type} from 'class-transformer';
import TestResult from "./testResult";
import TestStatusTypeCode from "../enums/testStatusType";

export class TestReportResult {
    [immerable] = true;

    public unitTestReportGuid = '';
    public runBy = '' ;
    public runDate = new Date();
    public status : TestStatusTypeCode = '';

    @Type(() => TestResult)
    public testResult : TestResult = new TestResult();
}
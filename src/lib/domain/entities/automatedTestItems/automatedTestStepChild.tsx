import { immerable } from 'immer';
import AutomatedTestActionSoap from './automatedTestActionSoap';
import AutomatedTestAssessmentFileCompare from './automatedTestAssessmentFileCompare';
import AutomatedTestAssessmentSql from './automatedTestAssessmentSql';
import AutomatedTestMath from './automatedTestMath';

export abstract class AutomatedTestStepChild {
    [immerable] = true;

    abstract type: string;
}

export type AutomatedTestStepChildType =
    | AutomatedTestActionSoap
    | AutomatedTestAssessmentSql
    | AutomatedTestAssessmentFileCompare
    | AutomatedTestMath
    | null;

import { ITabData } from "./iTabData";
import {EntityType} from "../../enums/entityType";
import AutomatedTestStep from "../automatedTestItems/automatedTestStep";
import { OperationMode } from "../../enums/operationMode";

export default class FunctionalTestStepSession extends ITabData {
    clazz: string = "FunctionalTestStepSession";

    nameTemplateStep = '';
    templateStepPath = '';
    templateStep : AutomatedTestStep = new AutomatedTestStep();
    saved = true;
    mode : OperationMode = 'UPDATE';

    generateTabId(): string {
        return 'FunctionalTestStepSession_' + this.nameTemplateStep;
    }

    getGuid(): string {
        return this.generateTabId();
    }

    getName(): string {
        return 'Functional Test Step - ' + this.nameTemplateStep;
    }

    getType(): EntityType {
        return '';
    }

    getExtra(): string {
        return 'FunctionalTestStepSession';
    }
}
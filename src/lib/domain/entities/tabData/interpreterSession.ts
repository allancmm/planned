import { Type } from 'class-transformer';
import { toast } from 'react-toastify';
import formLayout from '../../../../containers/editor/debugger/form';
import { EntityType } from '../../enums/entityType';
import BasicEntity from '../basicEntity';
import DebuggerForm from '../debuggerForm';
import InterpreterResult from '../interpreterResult';
import OipaRule from '../oipaRule';
import TestCase from '../testCase';
import TestSuite from '../testSuite';
import { ITabData } from './iTabData';

export default class InterpreterSession extends ITabData {
    clazz: string = 'InterpreterSession';

    @Type(() => OipaRule) public oipaRule: OipaRule = new OipaRule();

    @Type(() => DebuggerForm) public form?: DebuggerForm;

    @Type(() => TestSuite) public testSuite: TestSuite = new TestSuite();
    @Type(() => TestCase) public testCase?: TestCase;

    @Type(() => InterpreterResult) public results?: InterpreterResult;

    public standalone: boolean = false;
    public useTestCase: boolean = false;

    public interpreterRuleGuid: string = '';
    public interpreterEntityType: EntityType = '';
    public typeCode: string = '';
    public active = 0;

    static tryAddDefaultContextToForm(form: DebuggerForm, defaultContext: DebuggerForm): DebuggerForm {
        const validEntityType = formLayout[form.entityType].entityLevels.includes(defaultContext.entityLevel);
        const validRule = !defaultContext.entity || form.rules.filter((r) => r.value === form.ruleGuid).length !== 0;

        if (!validEntityType || !validRule) {
            if (!validEntityType) toast.warning('Cannot use default context for this entity type');
            if (!validRule) toast.warning('Cannot use default context for this rule under this level');
            form.entityLevel = '';
            form.entity = null;
        } else {
            form.entityLevel = defaultContext.entityLevel;
            form.entity = defaultContext.entity;
        }
        return form;
    }

    generateTabId(): string {
        return `${this.getGuid()} - interpreter`;
    }
    getGuid(): string {
        return this.oipaRule.ruleGuid;
    }
    getName(): string {
        return `${this.oipaRule.ruleName} - interpreter`;
    }
    getType(): EntityType {
        return this.oipaRule.entityType;
    }
    getExtra(): string {
        return `Interpreter`;
    }

    createBasicForm(defaultContext: DebuggerForm, defaultRules: BasicEntity[]): DebuggerForm {
        this.form = new DebuggerForm();

        if (formLayout[this.interpreterEntityType]) {
            this.form.entityType = this.interpreterEntityType;

            this.form.ruleGuid = this.oipaRule.ruleGuid;
            this.form.rules = defaultRules;
            this.form = InterpreterSession.tryAddDefaultContextToForm(this.form, defaultContext);
            if (this.form.entityLevel === 'NONE') {
                // in the case where the default context gets back to NONE, put the rule as the only entry in the dropdown, otherwise it will be included already
                this.form.rules = [{ value: this.oipaRule.ruleGuid, name: this.oipaRule.ruleName }];
            }
        }
        return this.form;
    }
}

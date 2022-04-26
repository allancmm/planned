import BasicEntity from "./basicEntity";

export default class GenericRuleField {
    public name: string = '';
    public value: string = '';
    public type: string = '';
    public disabled: boolean = false;
    public optionsList?: BasicEntity[];

    constructor(name?: string, value?: string, type?: string, disabled?: boolean, optionList?: BasicEntity[]) {
        this.name = name ?? '';
        this.value = value ?? '';
        this.type = type ?? '';
        this.disabled = disabled ?? false;
        this.optionsList = optionList ?? [];
    }
}

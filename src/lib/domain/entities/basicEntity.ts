export default class BasicEntity {
    public name: string = '';
    public value: string = '';
    public override?: string = '';

    constructor(name?: string, value?: string) {
        this.name = name ?? '';
        this.value = value ?? '';
    }
}

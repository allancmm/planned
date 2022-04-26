export default class GitBranch {
    public name: string = '';
    public local: boolean = false;
    public remote: boolean = false;
    public tag: boolean = false;

    fullName = () => {
        return `${this.name}${this.local ? ' [local]' : ''}${this.remote ? ' [remote]' : ''}${
            this.tag ? ' [tag]' : ''
        }`;
    };
}

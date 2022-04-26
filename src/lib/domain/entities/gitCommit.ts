export default class GitCommit {
    public commitID: string = '';
    public committer: string = '';
    public message: string = '';
    public date: string = '';

    displayInfo = () => {
        return `${this.committer} - ${this.commitID.slice(0,10)} - ${this.message} - ${this.date}`;
    };
}
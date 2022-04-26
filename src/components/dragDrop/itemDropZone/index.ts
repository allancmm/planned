export class ItemDropZone {
    private _path = '';
    private _childrenCount = 0;

    constructor(path: string, childrenCount: number) {
        this._path = path;
        this._childrenCount = childrenCount;
    }

    get childrenCount(): number {
        return this._childrenCount;
    }

    set childrenCount(value: number) {
        this._childrenCount = value;
    }

    get path(): string {
        return this._path;
    }
    set path(value: string) {
        this._path = value;
    }

}
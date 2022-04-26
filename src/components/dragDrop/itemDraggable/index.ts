import { DragObjectWithType } from "react-dnd";

export class ItemDraggable implements DragObjectWithType{
    private _id = '';
    private _type = '';
    private _path = '';
    private _item : any = {};

    constructor(id: string, type: string, item: any, path?: string) {
      this._id = id;
      this._type = type;
      this._item = item;
      this._path = path ?? '';
    }

    get item(): any {
        return this._item;
    }

    set item(value: any) {
        this._item = value;
    }
    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }
    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get path(): string {
        return this._path;
    }

    set path(value: string) {
        this._path = value;
    }
}
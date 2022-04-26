import { EntityType } from "../../enums/entityType";
import {ITabData} from "./iTabData";
import Manifest from "../manifest";

export default class ViewManifestSession extends ITabData {
    clazz = 'ViewManifestSession';

    manifest: Manifest;

    constructor(manifest: Manifest) {
        super();
        this.manifest = manifest;
    }

    generateTabId(): string {
        return `${this.clazz}_${this.manifest.releaseGuid}`;
    }
    getGuid(): string {
        return this.manifest.releaseGuid;
    }
    getName(): string {
        return `Manifest - ${this.manifest.releaseName}`;
    }
    getType(): EntityType {
        return '';
    }
    getExtra(): string {
       return 'View Manifest';
    }
}
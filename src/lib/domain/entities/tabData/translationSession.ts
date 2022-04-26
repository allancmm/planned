import { ITabData } from "./iTabData";
import { EntityType } from "../../enums/entityType";
import Translation from "../translation";
import { Options } from "../../../../components/general/inputText";
import Pageable from "../../util/pageable";

export default class TranslationSession extends ITabData {
    clazz: string = "TranslationSession";

    public translationSearch : Translation = new Translation();

    public locales: Options[] = [];

    public translations: Translation[] = [];

    public isUpdated: boolean = false;

    public pageTranslation: Pageable = Pageable.withPageOfSize();

    generateTabId(): string {
        return 'TranslationSession';
    }

    getGuid(): string {
        return this.generateTabId();
    }

    getName(): string {
        return 'Translation';
    }

    getType(): EntityType {
        return 'TRANSLATION';
    }

    getExtra(): string {
        return 'Translation';
    }
}
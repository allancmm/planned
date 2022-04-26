import TranslationRepository from "../../domain/repositories/translationRepository";
import {ApiGateway} from "../config/apiGateway";
import Translation from "../../domain/entities/translation";

export default class TranslationApiRepository implements TranslationRepository {

    constructor(private api: ApiGateway) { }

    encodeQueryData = (data: any) => {
        const ret = [];
        for (const d in data){
            if((!Array.isArray(data[d]) && data[d]) || data[d].length > 0 ){
                ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
            }
        }
        return ret.join('&');
    }

    searchTranslation = async (translationKey: string, translationValue: string, local: string[])
          : Promise<Translation[]> =>
        this.api.getArray(`/oipa/translations/search?${
            this.encodeQueryData({translationKey, translationValue, local})}`, { outType: Translation }  );

    updateTranslations = async (translations: Translation[]): Promise<void> =>
        this.api.post('/oipa/translations/update', translations);

}
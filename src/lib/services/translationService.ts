import TranslationRepository from "../domain/repositories/translationRepository";
import Translation from "../domain/entities/translation";

export default class TranslationService {
    constructor(private translationRepository: TranslationRepository) {}

    searchTranslation = async (translationKey: string, translationValue: string, locales: string[]) : Promise<Translation[]> => {
        return this.translationRepository.searchTranslation(translationKey, translationValue, locales);
    };

    updateTranslations = async (translations: Translation[]) : Promise<void> => {
        return this.translationRepository.updateTranslations(translations);
    }
}
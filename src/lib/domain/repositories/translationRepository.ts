import Translation from "../entities/translation";

export default interface TranslationRepository {
    searchTranslation(translationKey: string, translationValue: string, locales: string[]) : Promise<Translation[]>;

    updateTranslations(translation: Translation[]) : Promise<void>;
}
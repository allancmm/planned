
export const localesMap =
    new Map([
        ["00", "English (United States of America)"],
        ["01", "French (France)"],
        ["02", "Japanese (Japan)"],
        ["03", "Chinese (China)"],
        ["04", "Polish (Poland)"],
        ["05", "Spanish (Spain)"],
        ["06", "Arabic (United Arab Emirates)"],
        ["07", "German (Germany)"]
    ]);

export const getConvertedLocale = (localCode: string) => localesMap.get(localCode) || "Undefined";
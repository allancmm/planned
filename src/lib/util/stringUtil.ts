export const nullOrEmpty = (s: string): boolean => {
    return !s || s === '';
};

export const isGuid = (s: string): boolean => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
}
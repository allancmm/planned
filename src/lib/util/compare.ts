export const nullSafeCompare = (a: any, b: any) => {
    return a || b ? (!a ? -1 : !b ? 1 : isNaN(a) ? a.localeCompare(b) : b-a ) : 0;
};

export const isNumber = (value: string | number): boolean => {
    return ((value != null) &&
        (value !== '') &&
        !isNaN(Number(value.toString())));
}

import { classToPlain, plainToClass, TransformationType, TransformOptions } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';

// https://github.com/typestack/class-transformer/pull/294, once this is merged change this to keep the original context, instead of hardcoding options for Store
export const convertDictionary = <T,>(
    clazz?: ClassType<T>,
    transformOptions?: TransformOptions,
    isArray: boolean = false,
) => (dictionary: any, _: any, transformationType: TransformationType) => {
    if (transformationType === 0 && clazz) {
        // plain to class
        return Object.entries(dictionary).reduce((acc: any, [id, d]: any) => {
            acc[id] = isArray
                ? d.map((dd: any) => plainToClass(clazz, dd, transformOptions))
                : plainToClass(clazz, d, transformOptions);
            return acc;
        }, {});
    } else if (transformationType === 1) {
        // class to plain
        return Object.entries(dictionary).reduce((acc: any, [id, d]: any) => {
            acc[id] = isArray ? d.map(classToPlain) : classToPlain(d, transformOptions);
            return acc;
        }, {});
    } else {
        return dictionary;
    }
};

export const convertDate = (date: any, _: any, transformationType: TransformationType) => {
    if (!date) return date;
    if (transformationType === 0) {
        // plain to class
        return new Date(date);
    } else if (transformationType === 1) {
        // class to plain
        return (date as Date).valueOf();
    } else {
        return date;
    }
};

import { deserialize, deserializeArray, plainToClass, serialize } from 'class-transformer';

export class JsonSerializer {
    mapToObject<T>(r: string, type?: new () => T): T {
        return type ? this.deserializeToObject(r, type) : r === 'true' || r === 'false' ? JSON.parse(r) : r;
    }

    mapToArray<T>(r: string, type?: new () => T): T {
        return type ? this.deserializeToArray(r, type) : JSON.parse(r);
    }

    deserializeToObject<T>(json: any, type: new () => T): T {
        return json ? deserialize(type, json, { groups: ['api'] }) : json;
    }

    deserializeToArray<T>(json: any, type: new () => T): T[] {
        return json ? deserializeArray(type, json, { groups: ['api'] }) : json;
    }

    mapToJson<T>(object: T | T[], type?: new () => T): any {
        if (typeof object === 'string') {
            return object;
        }
        if (type) {
            const classObject = plainToClass(type, object, { groups: ['api'] });
            return serialize(classObject, { groups: ['api'] });
        } else {
            return object instanceof Array ? JSON.stringify(object) : object;
        }
    }

    mapToUriEncoded(params: { [key: string]: string }): string {
        const pairs: string[] = [];
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const value = encodeURIComponent(params[key]);
                pairs.push(key + '=' + value);
            }
        }

        return pairs.join('&');
    }
}

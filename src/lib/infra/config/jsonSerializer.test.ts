import { Transform, Type } from 'class-transformer';
import { convertDate } from '../../util/transform';
import { JsonSerializer } from './jsonSerializer';

const mockSuccess = jest.fn();

class Another {
    public bye: string = '';
    @Transform(convertDate)
    public anotherDate: Date = new Date();
    @Type(() => Stuff)
    public stuffs: Stuff[] = [];

    success = mockSuccess;
}

class Something {
    public allo: string = '';
    @Transform(convertDate)
    public aDate: Date = new Date();
    @Type(() => Another)
    public another: Another = new Another();

    aFunction = () => {
        this.another.success();
    };
}

class Stuff {
    public yo = '';
}

describe('Should map objects to json correctly', () => {
    const objectMapper = new JsonSerializer();
    let something: Something;
    beforeEach(() => {
        something = new Something();
        something.allo = 'allo';
        something.aDate = new Date(823230245000);
        const another = new Another();
        another.bye = 'bye';
        another.anotherDate = new Date(823230245000);
        const aStuff = new Stuff();
        aStuff.yo = 'yo';
        another.stuffs.push(aStuff);
        something.another = another;
    });

    test('should map the class instance correctly ', () => {
        expect(objectMapper.mapToJson(something, Something)).toBe(
            `{"allo":"allo","aDate":823230245000,"another":{"bye":"bye","anotherDate":823230245000,"stuffs":[{"yo":"yo"}]}}`,
        );
    });

    test('should map the destuctred property class instance correctly', () => {
        const plainAnother: Another = {
            ...something.another,
            anotherDate: new Date(823230245001),
        };
        something.another = plainAnother;

        expect(objectMapper.mapToJson(something, Something)).toBe(
            `{"allo":"allo","aDate":823230245000,"another":{"bye":"bye","anotherDate":823230245001,"stuffs":[{"yo":"yo"}]}}`,
        );
    });

    test('should map the destuctred instance correctly', () => {
        const plainSomething: Something = {
            ...something,
            aDate: new Date(823230245001),
        };

        expect(objectMapper.mapToJson(plainSomething, Something)).toBe(
            `{"allo":"allo","aDate":823230245001,"another":{"bye":"bye","anotherDate":823230245000,"stuffs":[{"yo":"yo"}]}}`,
        );
    });

    test('should map the deeply destuctred instance correctly', () => {
        const stuffs = [...something.another.stuffs];
        stuffs.push({ yo: 'yolo' });
        const plainSomething: Something = {
            ...something,
            aDate: new Date(823230245001),
            another: {
                ...something.another,
                stuffs,
                anotherDate: new Date(823230245001),
            },
        };

        expect(objectMapper.mapToJson(plainSomething, Something)).toBe(
            `{"allo":"allo","aDate":823230245001,"another":{"bye":"bye","anotherDate":823230245001,"stuffs":[{"yo":"yo"},{"yo":"yolo"}]}}`,
        );
    });
});

describe('should deserialize to classes correctly', () => {
    const objectMapper = new JsonSerializer();
    test('methods should be available after deserialization', () => {
        const json = `{"allo":"allo","aDate":823230245001,"another":{"bye":"bye","anotherDate":823230245001,"stuffs":[{"yo":"yo"}]}}`;

        const something: Something = objectMapper.deserializeToObject(json, Something);

        something.aFunction();

        expect(mockSuccess).toHaveBeenCalledTimes(1);
    });

    test('should deserialize primitives', () => {
        const json = 'allo';
        const bool = 'true';

        const des: string = objectMapper.mapToObject(json);
        const des2: boolean = objectMapper.mapToObject(bool);

        expect(des).toEqual(json);
        expect(des2).toEqual(true);
    });
});

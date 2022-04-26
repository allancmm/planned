import { Type } from 'class-transformer';
import Environment from './environment';

export default class EnvironmentList {
    @Type(() => Environment) public environments: Environment[] = [];

    static empty = (): EnvironmentList => {
        return new EnvironmentList();
    };
}

import { EntityType } from '../enums/entityType';

export default class TestTypes {
    public entityType: EntityType = '';
    public dbCount: number = 0;
    public suitesCount: number = 0;
    public suitePercent: number = 0;
    public totalPercent: number = 0;

    produceString = () => `${this.suitesCount}/${this.dbCount}, ${this.suitePercent}%`;
}

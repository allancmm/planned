import { ITabData } from './iTabData';
import { EntityType } from '../../enums/entityType';
import ActionStat from '../actionStat';
import StatsHeaderData from '../statsHeaderData';
import { Type } from 'class-transformer';
import DisplayableStatInfosList from '../displayableStatInfosList';
import GraphData from '../graphInfo';
export default class UserStatisticsData extends ITabData {
    clazz: string = 'UserStatistics';

    public usernames: string[] = [];
    public firstTimeLoad: boolean = true;

    @Type(() => DisplayableStatInfosList) public recentActivities: DisplayableStatInfosList = new DisplayableStatInfosList();
    @Type(() => DisplayableStatInfosList) public lockCheckoutInfos: DisplayableStatInfosList = new DisplayableStatInfosList();
    @Type(() => ActionStat) public actionStats: ActionStat[] = [];
    @Type(() => GraphData) public graphStats: GraphData = new GraphData();

    @Type(() => StatsHeaderData) statsHeaderData = new StatsHeaderData();

    constructor() {
        super();
    }

    generateTabId(): string {
        return 'UserStatistics-UserStatistics';
    }
    getGuid(): string {
        return 'UserStatistics';
    }
    getName(): string {
        return 'User Statistics';
    }
    getType(): EntityType {
        return '';
    }
    getExtra(): string {
        return 'User Statistics';
    }
}

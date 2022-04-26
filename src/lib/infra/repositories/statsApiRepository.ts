import ActionStat from '../../domain/entities/actionStat';
import ActivityTimeEntity from '../../domain/entities/activityTimeEntity';
import DisplayableStatInfosList from '../../domain/entities/displayableStatInfosList';
import GraphData from '../../domain/entities/graphInfo';
import StatsRepository from '../../domain/repositories/statsRepository';
import Pageable from '../../domain/util/pageable';
import { ApiGateway } from '../config/apiGateway';

export default class StatsApiRepository implements StatsRepository {
    constructor(private api: ApiGateway) {}

    getRecentActivities = async (
        usernames: string[],
        envIdentifier: string,
        start: Date,
        end: Date,
        page: Pageable,
        userSummary: boolean,
    ): Promise<DisplayableStatInfosList> => {
        return this.api.get(
            `/stats/recentActivities?usernames=${usernames}&envIdentifier=${envIdentifier}&start=${start}&end=${end}&pageNumber=${page.pageNumber}&size=${page.size}&userSummary=${userSummary}`,
            { outType: DisplayableStatInfosList },
        );
    };

    getLockCheckOut = async (
        usernames: string[],
        envIdentifier: string,
        start: Date,
        end: Date,
        page: Pageable,
    ): Promise<DisplayableStatInfosList> => {
        return this.api.get(
            `/stats/lockAndCheckedOut?usernames=${usernames}&envIdentifier=${envIdentifier}&start=${start}&end=${end}&pageNumber=${page.pageNumber}&size=${page.size}`,
            { outType: DisplayableStatInfosList },
        );
    };

    getActionStats = async (
        usernames: string[],
        envIdentifier: string,
        start: Date,
        end: Date,
    ): Promise<ActionStat[]> => {
        return this.api.getArray(
            `/stats/actionStats?usernames=${usernames}&envIdentifier=${envIdentifier}&start=${start}&end=${end}`,
            { outType: ActionStat },
        );
    };

    getGraphData = async (usernames: string[], envIdentifier: string, start: Date, end: Date): Promise<GraphData> => {
        return this.api.get(
            `/stats/graphData?usernames=${usernames}&envIdentifier=${envIdentifier}&start=${start}&end=${end}`,
            { outType: GraphData },
        );
    };

    logActivityTime = async (username: string, activityTimeEntity: ActivityTimeEntity): Promise<ActivityTimeEntity> => {
        return this.api.post(`/stats/logTime?username=${username}`, activityTimeEntity, {
            inType: ActivityTimeEntity,
            outType: ActivityTimeEntity,
        });
    };
}

import ActionStat from '../entities/actionStat';
import ActivityTimeEntity from '../entities/activityTimeEntity';
import DisplayableStatInfosList from '../entities/displayableStatInfosList';
import GraphData from '../entities/graphInfo';
import Pageable from '../util/pageable';

export default interface StatsRepository {
    getRecentActivities(
        usernames: string[],
        envIdentifier: string,
        start: Date,
        end: Date,
        page: Pageable,
        userSummary: boolean,
    ): Promise<DisplayableStatInfosList>;
    getLockCheckOut(
        usernames: string[],
        envIdentifier: string,
        start: Date,
        end: Date,
        page: Pageable,
    ): Promise<DisplayableStatInfosList>;
    getActionStats(usernames: string[], envIdentifier: string, start: Date, end: Date): Promise<ActionStat[]>;
    getGraphData(usernames: string[], envIdentifier: string, start: Date, end: Date): Promise<GraphData>;
    logActivityTime(username: string, activityTimeEntity: ActivityTimeEntity): Promise<ActivityTimeEntity>;
}

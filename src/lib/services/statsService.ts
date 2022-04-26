import ActionStat from '../domain/entities/actionStat';
import ActivityTimeEntity from '../domain/entities/activityTimeEntity';
import DisplayableStatInfosList from '../domain/entities/displayableStatInfosList';
import GraphData from '../domain/entities/graphInfo';
import StatsRepository from '../domain/repositories/statsRepository';
import Pageable from '../domain/util/pageable';

export default class StatsService {
    constructor(private statsRepository: StatsRepository) {}

    getRecentActivities = async (
        usernames: string[],
        envIdentifier: string,
        start: Date,
        end: Date,
        page: Pageable,
        userSummary: boolean = false,
    ): Promise<DisplayableStatInfosList> => {
        return this.statsRepository.getRecentActivities(usernames, envIdentifier, start, end, page, userSummary);
    };

    getLockCheckOut = async (
        usernames: string[],
        envIdentifier: string,
        start: Date,
        end: Date,
        page: Pageable,
    ): Promise<DisplayableStatInfosList> => {
        return this.statsRepository.getLockCheckOut(usernames, envIdentifier, start, end, page);
    };

    getActionStats = async (
        usernames: string[],
        envIdentifier: string,
        start: Date,
        end: Date,
    ): Promise<ActionStat[]> => {
        return this.statsRepository.getActionStats(usernames, envIdentifier, start, end);
    };

    getGraphData = async (usernames: string[], envIdentifier: string, start: Date, end: Date): Promise<GraphData> => {
        return this.statsRepository.getGraphData(usernames, envIdentifier, start, end);
    };

    logActivityTime = async (username: string, activityTimeEntity: ActivityTimeEntity): Promise<ActivityTimeEntity> => {
        return this.statsRepository.logActivityTime(username, activityTimeEntity);
    };
}

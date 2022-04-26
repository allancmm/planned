import { Expose, Transform, Type } from 'class-transformer';
import { immerable } from 'immer';
import { convertDate } from '../../util/transform';
import Reviewer from './reviewer';
import Version from './version';

export default class ConfigPackage {
    [immerable] = true;

    public packageGuid: string = '';
    public packageName: string = '';
    public description: string = '';
    public lastModifiedBy: string = '';
    @Transform(convertDate) public lastModifiedAt: Date = new Date();
    public status: string = '';
    public fromRulePalette: boolean = false;
    public comments: string = '';
    public isOwner: boolean = false;
    public isReviewer: boolean = false;
    public isPackageUsedInMigration: boolean = false;
    public nbApprovalsRequired: number = 0;

    @Type(() => Reviewer) public reviewers: Reviewer[] = [];
    @Expose({ groups: ['cache'] }) public reviewersName: string[] = [];

    @Expose({ groups: ['cache'] }) public versionsGuids: string[] = [];
    @Expose({ groups: ['cache'] }) @Type(() => Version) public versions: Version[] = [];

    isOpen = (): boolean => {
        return this.status === '01';
    };

    isReadyToMigrate = (): boolean => {
        return this.status === '02';
    };

    isMigrated = (): boolean => {
        return this.status === '04';
    };

    isEmpty = (): boolean => {
        return this.versionsGuids.length === 0;
    };

    isInReworkNeeded = (): boolean => {
        return this.status === '06';
    };

    hasMigrationError = (): boolean => {
        return this.status === '07';
    };

    isAccepted = (): boolean => {
        return this.status === '09';
    };

    isInReview = (): boolean => {
        return this.status === '10';
    };

    isReviewerAndOwner = (): boolean => {
        return this.isOwner && this.isReviewer;
    };

    isReviewerAndNotOwner = (): boolean => {
        return !this.isOwner && this.isReviewer;
    };

    isReviewerOrOwner = (): boolean => {
        return this.isOwner || this.isReviewer;
    };

    isOwnerAndNotReviewer = (): boolean => {
        return this.isOwner && !this.isReviewer;
    };
}

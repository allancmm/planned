import {Type} from 'class-transformer';
import Reviewer from './reviewer';

export default class ReviewerList {
    @Type(() => Reviewer) public reviewers: Reviewer[] = [];

    static empty = (): ReviewerList => {
        return new ReviewerList();
    };
}
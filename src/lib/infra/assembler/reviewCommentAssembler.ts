import ReviewComment from '../../domain/entities/reviewComment';
import { ReviewCommentCreationRequest } from '../request/ReviewCommentCreationRequest';

export const toReviewCommentCreationRequest = (reviewComment: ReviewComment): ReviewCommentCreationRequest => {
    return {
        content: reviewComment.content,
        ruleGuid: reviewComment.ruleGuid,
        ruleName: reviewComment.ruleName,
    };
};

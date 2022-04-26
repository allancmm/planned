import React from 'react';
import ReviewComment from '../../../lib/domain/entities/reviewComment';
import {
    Comment,
    CommentContainer,
    CommentContent,
    CommentDate,
    CommentHeader,
    CommentReviewer,
} from './style';
import {dateToString} from "../../../lib/util/date";

interface ConfigPackageCommentsProps {
    comments: ReviewComment[];
}

const ConfigPackageComments = ({ comments }: ConfigPackageCommentsProps): React.ReactElement => {
    return (
        <CommentContainer>
            {comments.map((c) => (
                <Comment key={c.commentGuid}>
                    <CommentHeader>
                        <CommentReviewer>{c.userName}</CommentReviewer>
                        <CommentDate>
                            {dateToString(c.date, 'MM/dd/yyyy HH:mm:ss')}
                        </CommentDate>
                    </CommentHeader>
                    <CommentContent dangerouslySetInnerHTML={{ __html: c.content }} />
                </Comment>
            ))}
        </CommentContainer>
    );
};

export default ConfigPackageComments;

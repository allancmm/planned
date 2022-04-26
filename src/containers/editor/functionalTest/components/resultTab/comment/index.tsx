import React, { Fragment } from "react";
import { dateToString, FORMAT_DATE_TIME, FORMAT_TIME } from "../../../../../../lib/util/date";
import {XMLViewer} from "../../../../../../components/general";
import AutomatedTestLogResult from "../../../../../../lib/domain/entities/automatedTestItems/automatedTestLogResult";
import { CommentContainer, DetailLogContainer, DetailMessage, XmlContainer } from './style';
import { CommentContent } from "../style";
const Comment = ({ item } : { item: AutomatedTestLogResult}) =>
    <CommentContainer>
        <span>
            Start: {dateToString(item.start, FORMAT_DATE_TIME)}
        </span>

        <CommentContent>
            {item.query &&
                <>
                    <DetailLogContainer>
                        <span>
                            {`[${dateToString(item.start, FORMAT_TIME)}] Query: `}
                            {item.query}
                        </span>
                    </DetailLogContainer>
                    <DetailLogContainer>
                        <span>
                            {`[${dateToString(item.start, FORMAT_TIME)}] Expected Result: ${item.expectedResult}`}
                        </span>
                    </DetailLogContainer>
                    <DetailLogContainer>
                        <span>
                            {`[${dateToString(item.start, FORMAT_TIME)}] Actual Result: ${item.actualResult}`}
                        </span>
                    </DetailLogContainer>
                </>
            }
            {item.comments?.map((comment, subIndex) =>
                <Fragment key={subIndex}>
                    {comment.type === 'XML' ?
                        <>
                            <span>
                                {`[${dateToString(comment.time, FORMAT_TIME)}] XML Response`}
                            </span>
                            <XmlContainer>
                                <XMLViewer xml={comment.value} />
                            </XmlContainer>
                        </>
                        :
                        <DetailLogContainer>
                            <span>
                                {`[${dateToString(comment.time, FORMAT_TIME)}] `}
                            </span>
                            <span>
                                <DetailMessage>
                                     {comment.value}
                                </DetailMessage>
                            </span>
                        </DetailLogContainer>
                    }
                </Fragment>
            )}
        </CommentContent>
        <span>
            End: {dateToString(item.end, FORMAT_DATE_TIME)}
        </span>
    </CommentContainer>

export default Comment;
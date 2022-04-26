import React, {useState, ReactNode, Fragment} from "react";
import { CollapseContainer, CollapseHeaderProps, Caret } from 'equisoft-design-ui-elements';
import AutomatedTestResult from "../../../../../lib/domain/entities/automatedTestItems/automatedTestResult";
import AutomatedTestLogResult from "../../../../../lib/domain/entities/automatedTestItems/automatedTestLogResult";
import { HeaderContainer, ResultContent, ResultLogContainer, CommentDetail, CommentDetailContainer } from './style';
import { StatusLogType } from "../../../../../lib/domain/entities/automatedTestItems/automatedTestLog";
import CommentItem from "../../../../../lib/domain/entities/automatedTestItems/comment";
import Comment from "./comment";
import StatusChip from "../../../../../components/general/statusChip";

interface ResultLogTabProps {
   result: AutomatedTestResult,
}

const ResultLogTab = ({ result } : ResultLogTabProps) => {
    let content : ReactNode;
    switch (true) {
        case ['IN_PROGRESS', 'STANDBY'].includes(result?.status):
            content = <span>Running...</span>;
             break;
        case result.log.type === 'Step':
            content =
                <>
                  {result.log.comments.map(renderComment)}
                  {result.log.childrenLogs.map(child => <Comment key={child.uuid} item={child}/>)}
                </>;
            break;
        default:
            content = result?.log?.childrenLogs?.map((r) =>
                <ResultLog key={r.uuid} item={r}/> ?? <></>
            );
            break;
    }
    return <ResultLogContainer key={result.runningId}>{content}</ResultLogContainer>;
};


export default ResultLogTab;

const renderHeader = (status: StatusLogType) => ({ title, isOpen, onClick } : CollapseHeaderProps) =>
    <HeaderContainer onClick={onClick}>
        <Caret isExpand={isOpen} />
        {title}
        <StatusChip status={status} />
    </HeaderContainer>

const renderResultLog = (subResult: AutomatedTestLogResult) => {
    switch (subResult.type) {
        case 'Step':
            return <ResultLog key={subResult.uuid} item={subResult} />;
        case 'AssessmentSql':
            return <Comment key={subResult.uuid}  item={subResult} />;
        default:
            return subResult.comments?.length > 0 ?
                <Comment item={subResult} key={subResult.uuid} />
                : <Fragment key={subResult.uuid}>No details</Fragment>
    }

}

const renderComment = (comment: CommentItem) =>
    <CommentDetailContainer key={comment.uuid}>
        <CommentDetail>
            {comment.value.split(/\r\n|\r|\n/).map((line, index) => <div key={index}>{line}</div>)}
        </CommentDetail>
    </CommentDetailContainer>;

const ResultLog = ({ item } : { item : AutomatedTestLogResult }) => {
    const [isOpen, setOpen] = useState(false);
    return (
        <CollapseContainer
            open={isOpen}
            toggleOpen={() => setOpen((prev) => !prev)}
            title={item.name}
            header={renderHeader(item.status)}
            key={item.uuid}
        >
            <ResultContent>
                {item.comments.map(renderComment)}
                {item.childrenLogs.length > 0 && item.childrenLogs?.map(renderResultLog)}
                {item.comments.length === 0 && item.childrenLogs.length === 0 && <>No details</>}
            </ResultContent>
        </CollapseContainer>
    );
}
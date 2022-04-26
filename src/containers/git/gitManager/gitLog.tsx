import React from 'react';
import { CollapseContainer, Loading } from 'equisoft-design-ui-elements';

interface GitLogProps {
    logContainer: React.ReactNode;
    jobCalled: boolean
}

const GitLog = ({logContainer, jobCalled}: GitLogProps) => {
    return (
        <CollapseContainer
            title="Logs"
            defaultOpened
        >
            <>
                <Loading loading={jobCalled} />
                <div style={{ padding: '16px' }}>
                   {logContainer}
                </div>
            </>
        </CollapseContainer>
    );
};

GitLog.defaultProps = {};

export default GitLog;

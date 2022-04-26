import React from 'react';
import { ScmStatusType } from '../../../../lib/domain/entities/entityStatus';
import EntityInformation from '../../../../lib/domain/entities/tabData/entityInformation';
import { useFocusedActiveTab, useTabWithId } from '../../tabs/tabContext';
import { InfoContainer } from './style';

const EntityInfos = () => {
    const [, tabId] = useFocusedActiveTab();
    const { data } = useTabWithId(tabId);

    if (!(data instanceof EntityInformation)) {
        return null;
    }

    let statusString = data.status.status;
    if (statusString === ('checkedBy' as ScmStatusType)) {
        statusString += ` ${data.status.user}`;
    }

    return (
        <InfoContainer>
            <div>
                <h3>OIPA rule</h3>
                <div>
                    <strong>Rule Guid:</strong>
                    {data.oipaRule.ruleGuid}
                </div>
                <div>
                    <strong>Rule name:</strong>
                    {data.oipaRule.ruleName}
                </div>
                <div>
                    <strong>Entity type:</strong>
                    {data.entityType}
                </div>
                <div>
                    <strong>File type:</strong>
                    {data.fileType}
                </div>
                {data.typeCode !== 'unknown' && (
                    <div>
                        <strong>Rule type:</strong>
                        {data.typeCode}
                    </div>
                )}
            </div>
            <div>
                <h3>Override</h3>
                <div>
                    <strong>Override Type:</strong>
                    {data.oipaRule.override.overrideTypeCode}
                </div>
                <div>
                    <strong>Override Guid:</strong>
                    {data.oipaRule.override.overrideGuid}
                </div>
                <div>
                    <strong>Override Name:</strong>
                    {data.oipaRule.override.overrideName}
                </div>
            </div>
            <div>
                <h3>Status</h3>
                <div>
                    <strong>Status:</strong>
                    {statusString}
                </div>
                <div>
                    <strong>Version Number:</strong>
                    {data.status.versionNumber}
                </div>
                <div>
                    <strong>Last modified by:</strong>
                    {data.status.lastModifiedBy}
                </div>
                <div>
                    <strong>Last modified GMT:</strong>
                    {data.status.lastModifiedGMT}
                </div>
            </div>
        </InfoContainer>
    );
};

export default EntityInfos;

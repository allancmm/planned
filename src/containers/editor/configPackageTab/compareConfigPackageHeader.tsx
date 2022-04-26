import {SelectInline, Select} from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, { ChangeEvent, useMemo } from 'react';
import {defaultConfigPackageService} from '../../../lib/context';
import ConfigPackageContent from '../../../lib/domain/configPackageContent';
import {FileType, fileTypeToDisplayName} from '../../../lib/domain/enums/fileType';
import ConfigPackageService from '../../../lib/services/configPackageService';
import {ContentHalfWidthContainer, ContentHeaderContainer} from './style';

const MIGRATED_CODE = 'Migrated';

interface CompareHeaderProps {
    content: ConfigPackageContent;
    configPackageService: ConfigPackageService;
    editCompareContent(content: ConfigPackageContent, dispose?: boolean): void;
}

const CompareConfigPackageHeader = ({ content, editCompareContent, configPackageService }: CompareHeaderProps) => {

    const linkedFiles = content.linkedFiles
        .filter((f) => f !== 'SECURITY_DATA')
        .map((f) => ({ value: f, label: fileTypeToDisplayName(f) }));

    const changeEnv = async (e: ChangeEvent<HTMLSelectElement>) => {
        const envId = e.target.value;
        const versionGuidByNumber = content.dataByEnvironment[envId].versionGuidByNumber;
        const migratedVersions = Object.keys(versionGuidByNumber).filter((ver) => ver.includes(MIGRATED_CODE));
        const lastMigratedKey = migratedVersions[migratedVersions.length - 1];
        const keys = Object.keys(versionGuidByNumber);
        const lastVersionKey = keys[keys.length - 1];
        const dataVersion = lastMigratedKey ?? lastVersionKey ?? '';
        const compareData = await configPackageService.getContentDataByVersion(versionGuidByNumber[dataVersion], content.fileType);

        editCompareContent(
            produce(content, (draft) => {
                draft.currentEnvID = envId;
                draft.currentDataVersion = dataVersion;
                draft.currentCompareData = compareData;
            }),
            true,
        );
    };

    const changeVersion = async (e: ChangeEvent<HTMLSelectElement>) => {
        const versionKey = e.target.value;
        const compareData = await configPackageService.getContentDataByVersion(
            content.dataByEnvironment[content.currentEnvID]?.versionGuidByNumber?.[versionKey],
            content.fileType);

        editCompareContent(
            produce(content, (draft) => {
                draft.currentDataVersion = versionKey;
                draft.currentCompareData = compareData;
            }),
            true,
        );
    };

    const handleLinkedFileChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        const newFileType: FileType = e.target.value as FileType;

        if (newFileType !== content.fileType) {
            const compareData = await configPackageService.getContentDataByVersion(
                content.dataByEnvironment[content.currentEnvID]?.versionGuidByNumber?.[content.currentDataVersion],
                newFileType);
            const currentContentData = await configPackageService.getContentDataByVersion(content.versionGuid, newFileType);

            editCompareContent(
                produce(content, (draft) => {
                    draft.fileType = newFileType;
                    draft.currentCompareData = compareData;
                    draft.currentVersionXMLData = currentContentData;
                }),
                true,
            );
        }
    };

    const optionsEnv = useMemo(() => content.dataByEnvironment
        ? Object.keys(content.dataByEnvironment)?.map((k) => ({ label: k, value: k }))
        : [], [content.dataByEnvironment]);

    const optionsVersion = useMemo(() =>
        content.dataByEnvironment && content.dataByEnvironment[content.currentEnvID]?.versionGuidByNumber
        ? Object.keys(
            content.dataByEnvironment[content.currentEnvID].versionGuidByNumber,
        )?.sort((a, b) => parseInt(b, 10) - parseInt(a, 10)).map((k) => ({ label: k, value: k }))
        : [], [content.dataByEnvironment, content.currentEnvID]);

    return (
        <ContentHeaderContainer>
            <ContentHalfWidthContainer>
                <div>
                    <div>Rule: {content.ruleName}</div>
                    <div>Packaged version: {content.currentVersionNumber}</div>
                </div>
                <div>
                    <Select
                        name={'Linked Files'}
                        validationErrorMessage={'Error message'}
                        onChange={handleLinkedFileChange}
                        required={false}
                        options={linkedFiles}
                        value={content.fileType}
                    />
                </div>
            </ContentHalfWidthContainer>
            <div style={{ display: 'flex' }}>
                    <>
                        Comparing with:
                        <SelectInline
                            options={optionsEnv}
                            value={content.currentEnvID}
                            onChange={changeEnv}
                        />
                        <SelectInline
                            emptySelectText="Select One"
                            options={optionsVersion}
                            value={content.currentDataVersion}
                            onChange={changeVersion}
                        />
                    </>
            </div>
        </ContentHeaderContainer>
    );
};

CompareConfigPackageHeader.defaultProps = {
    configPackageService: defaultConfigPackageService,
};

export default CompareConfigPackageHeader;

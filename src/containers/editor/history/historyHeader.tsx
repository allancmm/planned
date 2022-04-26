import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Button, CreateSelect, Select, SelectOption } from 'equisoft-design-ui-elements';
import { Draft } from 'immer';
import { toast } from 'react-toastify';
import {v4 as uuid} from 'uuid';
import { TabLoadingContext, useTabActions, useTabWithId } from '../../../components/editor/tabs/tabContext';
import { OPEN, STATUS_CHANGED } from '../../../components/editor/tabs/tabReducerTypes';
import {
    defaultConfigPackageService,
    defaultEntityInformationService,
    defaultEnvironmentService,
    defaultHistoryService,
} from '../../../lib/context';
import ConfigPackage from '../../../lib/domain/entities/configPackage';
import ConfigPackageList from '../../../lib/domain/entities/configPackageList';
import Environment from '../../../lib/domain/entities/environment';
import HistoryDocument from '../../../lib/domain/entities/tabData/historyDocument';
import Version from '../../../lib/domain/entities/version';
import {FileType, fileTypeToDisplayName} from '../../../lib/domain/enums/fileType';
import ConfigPackageService from '../../../lib/services/configPackageService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import EnvironmentService from '../../../lib/services/environmentService';
import HistoryService from '../../../lib/services/historyService';
import {AddToWrapper} from '../../packagingControl/style';
import {HalfWidthContainer, HistoryHeaderContainer} from './style';

interface HistoryHeaderProps {
    tabId: string;

    environmentService: EnvironmentService;
    historyService: HistoryService;
    entityInformationService: EntityInformationService;
    configPackageService: ConfigPackageService;

    editHistoryDocument(recipe: (draft: Draft<HistoryDocument>) => void, dispose?: boolean): void;
}
const CURRENT = 'CURRENT';
const CurrentVersion = new Version();
CurrentVersion.versionGuid = CURRENT;
CurrentVersion.ignoreable = true;

const HistoryHeader = ({
    tabId,
    editHistoryDocument,
    environmentService,
    historyService,
    entityInformationService,
    configPackageService,
}: HistoryHeaderProps) => {
    const btnLabelValue: string = 'Revert to version';
    const [environments, setEnvironments] = useState<Environment[]>([]);
    const [btnVersionLeft, setBtnVersionLeft] = useState<Version>(CurrentVersion);
    const [btnVersionRight, setBtnVersionRight] = useState<Version>(CurrentVersion);
    const [warningLeft, setWarningLeft] = useState<Boolean>();
    const [warningRight, setWarningRight] = useState<Boolean>();
    const [configPackages, setConfigPackages] = useState<ConfigPackageList>(new ConfigPackageList());
    const { data } = useTabWithId(tabId);
    const dispatch = useTabActions();
    const { load } = useContext(TabLoadingContext);
    const historyData = data;
    if (!(historyData instanceof HistoryDocument)) return null;

    useEffect(() => {
        let isMounted = true;
        const listFetchInit = [
            fetchEnvironments(),
            fetchLeftEntityInfos(),
            fetchRightEntityInfos(),
            fetchLeftVList(),
            fetchRightVList()
        ];

        Promise.all(listFetchInit).then(([envs, leftEntityInfos, rightEntityInfos, leftVList, rightVList ]) => {
            if(isMounted){
                setEnvironments(envs.environments);

                editHistoryDocument((draft) => {
                    draft.linkedFiles = leftEntityInfos.oipaRule.linkedFiles;
                    draft.versionsByEnv[historyData.leftEnv.identifier] = leftVList;
                    draft.versionsByEnv[historyData.rightEnv.identifier] = rightVList;

                    if (historyData.leftVersion) setBtnVersionLeft(historyData.leftVersion);
                    else {
                        draft.leftXml = leftEntityInfos.dataString;
                        setBtnVersionLeft(CurrentVersion);
                    }
                    if (historyData.rightVersion) setBtnVersionRight(historyData.rightVersion);
                    else {
                        draft.rightXml = rightEntityInfos.dataString;
                        setBtnVersionRight(CurrentVersion);
                    }
                }, true);
            }
        });
        return () => { isMounted = false }
    }, [historyData.ruleGuid]);

    useEffect( () => {
        let isMounted = true;
        configPackageService.getOpenedPackage().then((packageList) => {
            if(isMounted) setConfigPackages(packageList);
        });
        return () => {isMounted = false };
    }, []);

    const fetchEnvironments = load(async () => environmentService.getEnvironmentList());
    const fetchLeftEntityInfos = load(async () => entityInformationService.getEntityInformation(
        historyData.entityType,
        historyData.ruleGuid,
        historyData.fileType,
        historyData.leftEnv.identifier,
    ));

    const fetchRightEntityInfos = load(async () => entityInformationService.getEntityInformation(
        historyData.entityType,
        historyData.ruleGuid,
        historyData.fileType,
        historyData.rightEnv.identifier,
    ));

    const fetchLeftVList = load(async () => historyService.getVersionListInEnv(historyData.ruleGuid, historyData.leftEnv.identifier));
    const fetchRightVList = load( async () => historyService.getVersionListInEnv(historyData.ruleGuid, historyData.rightEnv.identifier));

    const fetchVersions = load(async (env: Environment) =>
         historyService.getVersionListInEnv(historyData.ruleGuid, env.identifier)
    );

    const handleEnvChange = (left: boolean) =>
        load(async (e: ChangeEvent<HTMLSelectElement>) => {
            left ? setWarningLeft(false) : setWarningRight(false);

            const newEnv = environments.find((env) => env.identifier === e.target.value);
            if (newEnv) {
                const vList: Version[] = await fetchVersions(newEnv);
                const entityInfos = await entityInformationService.getEntityInformation(
                    historyData.entityType,
                    historyData.ruleGuid,
                    historyData.fileType,
                    newEnv.identifier,
                    );

                editHistoryDocument((draft) => {
                    draft.versionsByEnv[newEnv.identifier] = vList;

                    left ? (draft.leftEnv = newEnv) : (draft.rightEnv = newEnv);
                    left ? (draft.leftXml = entityInfos.dataString) : (draft.rightXml = entityInfos.dataString);
                    if (vList.length === 0) {
                        left ? setWarningLeft(true) : setWarningRight(true);
                    }
                    left ? (draft.leftVersion = CurrentVersion) : (draft.rightVersion = CurrentVersion);
                    left ? setBtnVersionLeft(CurrentVersion) : setBtnVersionRight(CurrentVersion);
                }, true);
            }
        });

    const getVersionXml = async (fileType: FileType, env: Environment, version?: Version) => {
        if (version && version !== CurrentVersion) {
            return historyService.getVersionAsXML(historyData.ruleGuid, version.versionNumber, fileType);
        } else {
            const entityInfos = await entityInformationService.getEntityInformation(
                historyData.entityType,
                historyData.ruleGuid,
                fileType,
                env.identifier,
            );
            return entityInfos.dataString;
        }
    }

    const handleLinkedFileChange = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        setWarningLeft(false);
        setWarningRight(false);
        const newFileType: FileType = e.target.value as FileType;

        if (newFileType !== historyData.fileType) {
            const leftVersionXml = await getVersionXml(newFileType, historyData.leftEnv, historyData.leftVersion);
            const rightVersionXml = await getVersionXml(newFileType, historyData.rightEnv, historyData.rightVersion);
            editHistoryDocument((draft) => {
                draft.fileType = newFileType;
                draft.leftXml = leftVersionXml;
                draft.rightXml = rightVersionXml;
            }, true);
        }
    });

    const handleVersionChange = (left: boolean) =>
        load(async (e: ChangeEvent<HTMLSelectElement>) => {
            const env = left ? historyData.leftEnv : historyData.rightEnv;
            let newVersion = historyData.versionsByEnv[env.identifier].find((v) => v.versionGuid === e.target.value);
            let versionXML = '';

            if (e.target.value === CURRENT) {
                const entityInfos = await entityInformationService.getEntityInformation(
                    historyData.entityType,
                    historyData.ruleGuid,
                    historyData.fileType,
                    env.identifier,
                );
                versionXML = entityInfos.dataString;
                
                newVersion = CurrentVersion;
            } else if (newVersion) {
                versionXML = await historyService.getVersionAsXML(
                    historyData.ruleGuid,
                    newVersion.versionNumber,
                    historyData.fileType,
                );
            }

            editHistoryDocument((draft) => {
                left ? (draft.leftVersion = newVersion) : (draft.rightVersion = newVersion);
                left ? (draft.leftXml = versionXML) : (draft.rightXml = versionXML);
            }, true);
            if (newVersion) left ? setBtnVersionLeft(newVersion) : setBtnVersionRight(newVersion);
        });

    const handleRevertVersion = load(async (version: Version) => {
        if (version?.versionNumber !== 0) {
            const status = await historyService.revertToVersion(
                version,
                historyData.ruleGuid,
                historyData.fileType,
                historyData.entityType,
            );
            dispatch({ type: STATUS_CHANGED, payload: { guid: historyData.ruleGuid, status } });
            if (status.versionNumber !== data.status.versionNumber) {
                toast('Current version is outdated, the latest version will loaded');
                await fetchLatestVersion();
            }
        } else {
            toast('Version need to be selected');
        }
    });

    const fetchLatestVersion = async () => {
        const entityInformation = await entityInformationService.getEntityInformation(
            historyData.entityType,
            historyData.ruleGuid,
            historyData.fileType,
        );
        dispatch({ type: OPEN, payload: { data: entityInformation, reloadContent: true } });
    };

    const hasCurrentlyInDatabaseOption = (): boolean => {
        return !['COUNTRY', 'CURRENCY', 'WORKFLOW_QUEUE_ROLE'].includes(historyData.fileType);
    };

    const getVersionOptions = (env: Environment) => {
        let versionsOptions: SelectOption[] = [];
        versionsOptions =
            historyData.versionsByEnv[env.identifier]?.map((v) => ({
                label: v.getFormattedMetadata(),
                value: v.versionGuid,
            })) ?? [];

        if (hasCurrentlyInDatabaseOption()) {
            versionsOptions.unshift({ label: 'Currently in the database', value: CURRENT });
        }

        return versionsOptions;
    };

    const envOptions: SelectOption[] = environments?.map((e) => ({ label: e.displayName, value: e.identifier }));
    const leftVersionsOptions = getVersionOptions(historyData.leftEnv);
    const rightVersionsOptions = getVersionOptions(historyData.rightEnv);
    const linkedFiles = historyData.linkedFiles
        .filter((f) => f !== 'SECURITY_DATA')
        .map((f) => ({ value: f, label: fileTypeToDisplayName(f) }));

    const [selectedPackage, setSelectedPackage] = useState<ConfigPackage | null>();
    const createNewPackage = load( async (packageName: string) => {
        const pkg = new ConfigPackage();
        pkg.packageName = packageName;
        pkg.packageGuid = uuid()
        configPackages.packages.push(pkg)
        setSelectedPackage(pkg)
    });

    const addRuleToConfigPackage = load( async (version: Version) => {
        if (selectedPackage && version) {
            const guid = selectedPackage.packageGuid;
            configPackageService.doesPackageExist(guid).then( doesPackageExist => {
                if(doesPackageExist) {
                    configPackageService.addVersionsToPackage(guid, [version.versionGuid])
                        .then(() =>
                            toast(`Rule: ${version.versionGuid} successfully added to ${selectedPackage.packageName}`)
                        )
                } else {
                    configPackageService.createPackage(selectedPackage)
                        .then( pkg => {
                            configPackageService.addVersionsToPackage(pkg.packageGuid, [version.versionGuid])
                            toast(`Rule: ${version.versionGuid} successfully added to ${selectedPackage.packageName}`)
                        });
                }
            });
        }
    });

    const renderButtons = (btnVersion: Version) => {
        return (
            <div>
                <Button
                    buttonType="primary"
                    label={`${btnLabelValue} ${btnVersion.versionNumber.toString() || 0}`}
                    onClick={() => handleRevertVersion(btnVersion)}
                />
                <AddToWrapper>
                    <CreateSelect
                        placeholder="Create or select package ..."
                        onChange={setSelectedPackage}
                        isValidNewOption={(inputValue, _, options) =>
                            !!inputValue && !options.some((c) => c.packageName === inputValue)
                        }
                        onCreateOption={createNewPackage}
                        options={configPackages.packages}
                        getNewOptionData={(packageName: string) => {
                            const pkg = new ConfigPackage();
                            pkg.packageGuid = uuid();
                            pkg.packageName = `Create new package: "${packageName}"`;
                            return pkg;
                        }}
                        getOptionLabel={(c: ConfigPackage) => c.packageName}
                        getOptionValue={(c: ConfigPackage) => c.packageGuid}
                        value={selectedPackage}
                    />
                    <Button type="button" buttonType="tertiary" onClick={() => addRuleToConfigPackage(btnVersion)} label="Add to Config Package" />
                </AddToWrapper>
            </div>
        )
    }

    return (
        <HistoryHeaderContainer>
            <div>
                <Select value={historyData.leftEnv.identifier} options={envOptions} onChange={handleEnvChange(true)} />
                <HalfWidthContainer>
                    <Select
                        name={'Linked Files'}
                        validationErrorMessage={'Error message'}
                        onChange={handleLinkedFileChange}
                        required={false}
                        options={linkedFiles}
                        value={historyData.fileType}
                    />
                    <Select
                        value={historyData.leftVersion?.versionGuid}
                        options={leftVersionsOptions}
                        onChange={handleVersionChange(true)}
                    />
                </HalfWidthContainer>
                {leftVersionsOptions.length > 0 && !btnVersionLeft.ignoreable && (
                    renderButtons(btnVersionLeft)
                )}
                <span style={{ color: 'red' }}>
                    {warningLeft ? 'WARNING : No version found in this environment' : ''}
                </span>
            </div>
            <div>
                <Select
                    value={historyData.rightEnv.identifier}
                    options={envOptions}
                    onChange={handleEnvChange(false)}
                />
                <HalfWidthContainer>
                    <Select
                        name={'Linked Files'}
                        validationErrorMessage={'Error message'}
                        onChange={handleLinkedFileChange}
                        required={false}
                        options={linkedFiles}
                        value={historyData.fileType}
                    />
                    <Select
                        value={historyData.rightVersion?.versionGuid}
                        options={rightVersionsOptions}
                        onChange={handleVersionChange(false)}
                    />
                </HalfWidthContainer>
                {rightVersionsOptions.length > 0 && !btnVersionRight.ignoreable && (
                    renderButtons(btnVersionRight)
                )}
                <span style={{ color: 'red' }}>
                    {warningRight ? 'WARNING : No version found in this environment' : ''}
                </span>
            </div>
        </HistoryHeaderContainer>
    );
};

HistoryHeader.defaultProps = {
    environmentService: defaultEnvironmentService,
    historyService: defaultHistoryService,
    entityInformationService: defaultEntityInformationService,
    configPackageService: defaultConfigPackageService
};

export default HistoryHeader;

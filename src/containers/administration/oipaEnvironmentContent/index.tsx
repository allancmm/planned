import {Button} from '@equisoft/design-elements-react';
import {Grid} from '@material-ui/core';
import {Loading, useLoading, WindowContainer} from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, {ChangeEvent, useContext, useEffect} from 'react';
import {toast} from 'react-toastify';
import {useTabActions, useTabWithId} from '../../../components/editor/tabs/tabContext';
import {EDIT_TAB_DATA} from '../../../components/editor/tabs/tabReducerTypes';
import InputText, {Options} from '../../../components/general/inputText';
import {SidebarContext} from '../../../components/general/sidebar/sidebarContext';
import {defaultEnvironmentService} from '../../../lib/context';
import Environment from '../../../lib/domain/entities/environment';
import GitRepoResponse from '../../../lib/domain/entities/gitRepoResponse';
import OipaEnvironmentSession from '../../../lib/domain/entities/tabData/oipaEnvironmentSession';
import EnvironmentService from '../../../lib/services/environmentService';
import {isNumber} from '../../../lib/util/compare';
import {AuthContext} from '../../../page/authContext';
import {AdministrationContainer, ButtonSection} from '../styles';

type TypeAllowedEnvironment = string | number | undefined;

interface OipaEnvironmentContentProps {
    tabId: string;
    environmentService: EnvironmentService;
}

const OipaEnvironmentContent = ({tabId, environmentService}: OipaEnvironmentContentProps) => {
    const tab = useTabWithId(tabId);

    const {data} = tab;

    if (!(data instanceof OipaEnvironmentSession)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }
    const dispatch = useTabActions();

    const [loading, load] = useLoading();

    const {toggleRefreshSidebar} = useContext(SidebarContext);

    const {auth: {versionControlType = ''}} = useContext(AuthContext);

    const {oipaEnvironment, operationMode, optionsGitRepo} = data;

    const isCreate = operationMode === 'CREATE';

    const fetchGitRepo = load(async () => environmentService.getGitRepo());

    const createOipaEnvironment = load(async () => environmentService.createEnvironment(oipaEnvironment));

    const updateOipaEnvironment = load(async () => environmentService.updateEnvironment(oipaEnvironment));

    const testConnectionEnvironment = load(async () => environmentService.testEnvironment(oipaEnvironment));

    useEffect(() => {
        if (optionsGitRepo.length === 0) {
            fetchGitRepo().then((resp: GitRepoResponse) => {
                if(resp.fileNotFound) {
                    toast.warning(resp.message)
                } else {
                    dispatch({
                        type: EDIT_TAB_DATA,
                        payload: {
                            tabId,
                            data: produce(data, (draft) => {
                                draft.optionsGitRepo = resp.gitRepositories.map((gitRepo) => ({label: gitRepo, value: gitRepo}));
                            })
                        }
                    });
                }
            });
        }
    }, []);

    const onClickSaveUpdate = async () => {
        if (isCreate) {
            await createOipaEnvironment();
            toast.success('Environment created successfully');
        } else {
            await updateOipaEnvironment();
            toast.success('Environment updated successfully');
        }
        toggleRefreshSidebar();
    };

    const onClickTestConnection = async () => {
        const resp = await testConnectionEnvironment();
        if (resp) {
            toast.success('Connection was successful');
        } else {
            toast.error(`Cannot establish connection for JNDI name: ${oipaEnvironment.jndiName}`);
        }
    };

    const onChange = (field: keyof Environment, value: TypeAllowedEnvironment) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    (draft.oipaEnvironment[field] as TypeAllowedEnvironment) = value;
                })
            }
        });
    };

    const isEnvironmentValid = (): boolean => {
        let isValid = true;
        Object.keys(oipaEnvironment).map((k) => {
            switch (k) {
                case 'identifier':
                case 'jndiName':
                case 'displayName':
                    isValid = isValid && !!oipaEnvironment[k];
                    break;
                case 'ivsEnvironment':
                case 'ivsTrack':
                    isValid = versionControlType === 'IVS' ? isValid && !!oipaEnvironment[k] : isValid;
                    break;
                default:
                    break;
            }

        });
        return isValid;
    };

    const renderIvsLoginInfo = () => {
        return versionControlType.toUpperCase() === 'IVS' || versionControlType.toUpperCase() === 'GIT-IVS' ? (
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <InputText value={oipaEnvironment.ivsEnvironment}
                               label="IVS Environment"
                               onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                   onChange('ivsEnvironment', e.currentTarget.value)}
                               required
                    />
                </Grid>
                <Grid item sm={6}>
                    <InputText value={oipaEnvironment.ivsTrack}
                               label="IVS Track"
                               onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                   onChange('ivsTrack', e.currentTarget.value)}
                               required
                    />
                </Grid>
            </Grid>
        ) : '';
    };

    return (
        <WindowContainer>
            <Loading loading={loading}/>

            <AdministrationContainer>
                <InputText value={oipaEnvironment.identifier}
                           label="Id"
                           onChange={(e: ChangeEvent<HTMLInputElement>) =>
                               onChange('identifier', e.currentTarget.value)}
                           disabled={!isCreate}
                           required
                />

                <InputText value={oipaEnvironment.deploymentOrder}
                           label="Order"
                           onChange={(e: ChangeEvent<HTMLInputElement>) => {
                               const value = e.target.value;
                               if (!value) {
                                   onChange('deploymentOrder', undefined);
                                   return;
                               }
                               isNumber(value) &&
                               onChange('deploymentOrder', Number(value));
                           }
                           }
                           required={isCreate}
                           disabled={!isCreate}
                />

                <Grid container spacing={2}>
                    <Grid item sm={6}>
                        <InputText value={oipaEnvironment.displayName}
                                   label="Environment Name"
                                   onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                       onChange('displayName', e.currentTarget.value)}
                                   required
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <InputText value={oipaEnvironment.jndiName}
                                   label="JNDI Connection Name (must be defined in the application container)"
                                   onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                       onChange('jndiName', e.currentTarget.value)}
                                   required
                        />
                    </Grid>
                </Grid>

                {renderIvsLoginInfo()}
                <Grid container spacing={2}>
                    <Grid item sm={6}>
                        <InputText type="select"
                                   label="Git Working Directory Path"
                                   placeholder="Select..."
                                   options={optionsGitRepo}
                                   value={oipaEnvironment.gitWorkingDirectoryPath}
                                   onChange={(e: Options) =>
                                       onChange('gitWorkingDirectoryPath', e.value)}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <InputText value={oipaEnvironment.gitRepoRelativePath}
                                   label="Git Repo Relative Path"
                                   onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                       onChange('gitRepoRelativePath', e.currentTarget.value)}
                        />
                    </Grid>
                </Grid>

                <InputText value={oipaEnvironment.urlOIPA}
                           label="OIPA URL"
                           onChange={(e: ChangeEvent<HTMLInputElement>) =>
                               onChange('urlOIPA', e.currentTarget.value)}
                />

                <ButtonSection>
                    <Button
                        buttonType="primary"
                        onClick={onClickTestConnection}
                        label="Test connection"
                        disabled={isCreate || !oipaEnvironment.jndiName}
                    />
                    <Button
                        buttonType="primary"
                        onClick={onClickSaveUpdate}
                        disabled={!isEnvironmentValid()}
                        label="Save"
                    />
                </ButtonSection>
            </AdministrationContainer>
        </WindowContainer>
    );
};

OipaEnvironmentContent.defaultProps = {
    environmentService: defaultEnvironmentService
};

export default OipaEnvironmentContent;
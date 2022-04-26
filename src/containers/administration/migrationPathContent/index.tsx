import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import produce from "immer";
import {Loading, useLoading, WindowContainer} from "equisoft-design-ui-elements";
import {useTabActions, useTabWithId} from "../../../components/editor/tabs/tabContext";
import {toast} from "react-toastify";
import MigrationPathSession from "../../../lib/domain/entities/tabData/migrationPathSession";
import InputText, {Options} from "../../../components/general/inputText";
import EnvironmentService from "../../../lib/services/environmentService";
import {defaultEnvironmentService, defaultMigrationPathService} from "../../../lib/context";
import {MigrationPath} from "../../../lib/domain/entities/migrationPath";
import {CheckboxContent} from "./styles";
import {MigrationType, MigrationTypeCode} from '../../../lib/domain/enums/migrationType';
import {Button, useModal} from "@equisoft/design-elements-react";
import ModalDialog from "../../../components/general/modalDialog";
import MigrationPathService from "../../../lib/services/migrationPathService";
import {SidebarContext} from "../../../components/general/sidebar/sidebarContext";
import {MSG_REQUIRED_FIELD} from "../../../lib/constants";
import {AuthContext} from "../../../page/authContext";
import {CLOSE, EDIT_TAB_DATA} from "../../../components/editor/tabs/tabReducerTypes";
import {AdministrationContainer, ButtonSection} from "../styles";

type TypeAllowedMigrationPath = string | string[];

const OptionsMigrationType = MigrationTypeCode.codes.map((c) => ({ label: c.label ?? c.value, value: c.value }));

const errorInitial: any = {
    hasError: false,
    messages: {}
};

interface MigrationPathContentProps {
    tabId: string;
    layoutId: number;
    migrationPathService: MigrationPathService;
    environmentService: EnvironmentService;
}

const MigrationPathContent = ({ tabId, layoutId, migrationPathService, environmentService } : MigrationPathContentProps) => {
    const tab = useTabWithId(tabId);

    const { data } = tab;

    if (!(data instanceof MigrationPathSession)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const [ loading, load ] = useLoading();

    const dispatch = useTabActions();

    const closeTab = () => dispatch({ type: CLOSE, payload: { id: tabId, layoutId } });

    const {
        isModalOpen,
        closeModal,
        openModal,
    } = useModal();

    const {  toggleRefreshSidebar } = useContext(SidebarContext);

    const { auth: { oipaEnvironment } } = useContext(AuthContext);

    const { migrationPath, operationMode, sourceEnvironmentsOptions, targetEnvironmentsOptions } = data;

    const [errorValidation, setErrorValidation] = useState(errorInitial);

    const [isCreated, setIsCreated] = useState(false);

    const fetchOipaEnvironments = () => {
        load(async () => {
            const { environments } = await environmentService.getEnvironmentList();
            dispatch({ type: EDIT_TAB_DATA,
                          payload: {
                            tabId,
                              data: produce(data, (draft) => {
                                  draft.sourceEnvironmentsOptions = environments.map(env =>
                                      ({ label: env.displayName,
                                         value: env.identifier })
                                  );
                                  draft.targetEnvironmentsOptions = environments.map(env =>
                                      ({ label: env.displayName,
                                          value: env.identifier,
                                          disabled: oipaEnvironment?.identifier === env.identifier })
                                  );
                              })
                         }
            });
        })();
    };

    useEffect(() => {
        if(sourceEnvironmentsOptions.length === 0 || targetEnvironmentsOptions.length === 0){
            fetchOipaEnvironments();
        }
    },[]);

    const onChange = (field: keyof MigrationPath, value: string, checked?: boolean) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    if(field === 'targetEnvironmentIdentifiers') {
                        if(checked){
                            draft.migrationPath.targetEnvironmentIdentifiers.push(value);
                        } else {
                            const list: string[] = migrationPath.targetEnvironmentIdentifiers;
                            const index = list.indexOf(value);
                            draft.migrationPath.targetEnvironmentIdentifiers =
                                [...list.slice(0, index), ...list.slice(index + 1, list.length)];
                        }
                    } else if(field === 'migrationTypes') {
                        if(checked){
                            draft.migrationPath.migrationTypes.push(value as MigrationType);
                        } else {
                            const list: MigrationType[] = migrationPath.migrationTypes;
                            const index = list.indexOf(value as MigrationType);
                            draft.migrationPath.migrationTypes =
                                [...list.slice(0, index), ...list.slice(index + 1, list.length)];
                        }
                    } else {
                        (draft.migrationPath[field] as TypeAllowedMigrationPath) = value;
                    }
                }),
            },
        });
    };

    const validation = () =>
        Object.keys(migrationPath).reduce((error: any, key  ) => {
            let msg;
            switch (key) {
                case 'displayName':
                case 'migrationTypes': {
                    msg = migrationPath[key].length === 0 && MSG_REQUIRED_FIELD;
                    break;
                }
                case 'targetEnvironmentIdentifiers': {
                    msg = migrationPath[key].length === 0 && MSG_REQUIRED_FIELD;
                    break;
                }
                default: return error;
            }
            return {...error, hasError: error.hasError || !!msg, messages: {...error.messages, [key]: msg}};
        }, {});

    const onClickSave = async () => {
        const error = validation();
        setErrorValidation(error)
        if(error.hasError){
            return;
        }
        if(operationMode === 'READ' || isCreated) {
            await load(async () => migrationPathService.updateMigrationPath(migrationPath))();
            toast.success('Migration path updated successfully');
        } else {
            const migrationCreated = await load(async () =>
                migrationPathService.createMigrationPath(migrationPath))();

            dispatch({
                type: EDIT_TAB_DATA,
                payload: {
                    tabId,
                    data: produce(data, (draft) => {
                        draft.migrationPath = migrationCreated;
                    }),
                },
            });
            toast.success('Migration path created successfully');
            setIsCreated(true);
        }
       toggleRefreshSidebar();
    };

    const onClickDelete = async () => {
        await load(async () => migrationPathService.deleteMigrationPath(migrationPath.identifier))();
        toast.success('Migration path deleted successfully');
        closeModal();
        toggleRefreshSidebar();
        closeTab();
    }

    return (
        <WindowContainer>
            <Loading loading={loading} />
            <AdministrationContainer>
                <InputText label='Migration Path Name'
                           value={migrationPath.displayName}
                           feedbackMsg={errorValidation.messages.displayName}
                           onChange={(e: ChangeEvent<HTMLInputElement>) =>
                               onChange('displayName', e.target.value )}
                           required
                />

                <InputText label='Migration Source'
                           type='select'
                           feedbackMsg={errorValidation.messages.sourceEnvironmentIdentifier}
                           options={sourceEnvironmentsOptions}
                           value={migrationPath.sourceEnvironmentIdentifier}
                           onChange={(e: Options) => onChange('sourceEnvironmentIdentifier', e.value )}
                />

                <CheckboxContent>
                    <InputText label='Migration Target(s)'
                               type='checkbox'
                               feedbackMsg={errorValidation.messages.targetEnvironmentIdentifiers}
                               options={targetEnvironmentsOptions}
                               checkedValues={migrationPath.targetEnvironmentIdentifiers}
                               onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                   onChange('targetEnvironmentIdentifiers', e.target.value, e.target.checked )}
                               required
                    />
                </CheckboxContent>

                <CheckboxContent>
                    <InputText label='Migration Option(s)'
                               type='checkbox'
                               feedbackMsg={errorValidation.messages.migrationTypes}
                               options={OptionsMigrationType}
                               checkedValues={migrationPath.migrationTypes}
                               onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                   onChange('migrationTypes', e.target.value, e.target.checked )}
                               required
                    />
                </CheckboxContent>

                <ButtonSection>
                    {(operationMode === 'READ' || isCreated) &&
                        <Button
                            buttonType="destructive"
                            onClick={openModal}
                            label="Delete"
                        />
                    }

                    <Button
                        buttonType="primary"
                        onClick={ onClickSave }
                        label="Save"
                    />

                </ButtonSection>
            </AdministrationContainer>

            <ModalDialog isOpen={isModalOpen}
                         onRequestClose={closeModal}
                         confirmButton={{
                             onConfirm: onClickDelete
                         }}
                         title="Are you sure you want to delete this migration path?"
            />
        </WindowContainer>
    );
}

MigrationPathContent.defaultProps = {
    migrationPathService: defaultMigrationPathService,
    environmentService: defaultEnvironmentService,
};

export default MigrationPathContent;
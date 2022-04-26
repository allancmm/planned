import React, { ChangeEvent, useEffect, useState } from 'react';
import { ModalDialog, InputText, Label, InvalidField } from '../../../general';
import { CreateSelect, useLoading, Loading } from 'equisoft-design-ui-elements';
import ConfigPackage from "../../../../lib/domain/entities/configPackage";
import {v4 as uuid} from "uuid";
import { AddPackageContent, CreateSelectContent, FooterButtons } from '../style';
import { Button, useModal } from '@equisoft/design-elements-react';
import ConfigPackageList from '../../../../lib/domain/entities/configPackageList';
import { defaultConfigPackageService, defaultHistoryService } from '../../../../lib/context';
import { toast } from 'react-toastify';
import ReviewComment from '../../../../lib/domain/entities/reviewComment';

export interface OptionsModal {
    title?: string,
    confirmLabel?: string,
    cancelLabel?: string,
}
const useModalPackages = (entityGuid: string,
                          entityName: string,
                          onConfirmPackage: Function,
                          optionsModal?: OptionsModal,
                          configPackageService = defaultConfigPackageService,
                          historyService = defaultHistoryService ) => {
    const [loading, load] = useLoading();
    const {
        isModalOpen,
        closeModal,
        openModal,
    } = useModal();

    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [configPackages, setConfigPackages] = useState<ConfigPackageList>(new ConfigPackageList());
    const [selectedPackage, setSelectedPackage] = useState<ConfigPackage>();

    const [comment, setComment] = useState<string>('');

    useEffect(() => {
        if(isModalOpen) {
            fetchConfigPackages();
        }
    }, [isModalOpen]);

    const fetchConfigPackages = async () => {
        setConfigPackages(await load(configPackageService.getOpenedPackage)());
    };

    const onClickConfirm = () => {
        if(selectedPackage?.packageGuid) {
            onConfirmPackage();
        } else {
            setFeedbackMessage('Config package is required');
        }
    }

    const createNewPackage = load( async (packageName: string) => {
        const pkg = new ConfigPackage();
        pkg.packageName = packageName;
        pkg.packageGuid = uuid();
        configPackages.packages.push(pkg);
        setSelectedPackage(pkg);
    });

    const onRequestClose = () => {
        setComment('');
        closeModal();
    }

    const addToPackage = load(async () => {
        if (selectedPackage) {
            const [version, doesPackageExist] =  await Promise.all([
                  historyService.getLatestVersion(entityGuid),
                  configPackageService.doesPackageExist(selectedPackage.packageGuid)]);

            if (doesPackageExist) {
                await configPackageService.addVersionsToPackage(selectedPackage.packageGuid, [version.versionGuid]);
                toast.success(`Rule ${entityName} successfully added to ${selectedPackage.packageName}`);
            } else {
                const pkg = await configPackageService.createPackage(selectedPackage);
                await configPackageService.addVersionsToPackage(pkg.packageGuid, [version.versionGuid])
                toast.success(`Rule ${entityName} successfully added to ${selectedPackage.packageName}`);
            }

            if (comment.trim().length > 0) {
                const ruleComment = new ReviewComment();
                ruleComment.configPackageGuid = selectedPackage.packageGuid;
                ruleComment.content = comment;
                ruleComment.ruleGuid = entityGuid;
                ruleComment.ruleName = entityName;
                await configPackageService.addRuleComment(ruleComment);
            }
        }
    });

    return {
        isModalPackagesOpen: isModalOpen,
        openModalPackages: openModal,
        closeModalPackages: closeModal,
        addToPackage,
        modalPackages: () =>
            <ModalDialog
                key='modalDialogPackages'
                title={`${optionsModal?.title ?? 'Add version to config package'}`}
                isOpen={isModalOpen}
                onRequestClose={onRequestClose}
                footerContent={
                    <FooterButtons>
                        <Button label={`${optionsModal?.confirmLabel ?? 'Confirm'}`} buttonType='primary' onClick={onClickConfirm} disabled={loading} />
                        <Button label={`${optionsModal?.cancelLabel ?? 'Cancel'}`} buttonType='tertiary' onClick={onRequestClose} />
                    </FooterButtons>
                }
            >
                <>
                    <Loading loading={loading} />
                    <AddPackageContent>
                        <Label text='Package' required />
                        {feedbackMessage && <InvalidField feedbackMsg={feedbackMessage} />}
                        <CreateSelectContent>
                            <CreateSelect
                                placeholder='Create or select package ...'
                                onChange={(value) => {
                                    setFeedbackMessage('');
                                    setSelectedPackage(value);
                                }}
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
                        </CreateSelectContent>
                    </AddPackageContent>

                    <InputText type='text' key='inputCommentsPackages'
                               label='Comment'
                               value={comment}
                               onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                   e.preventDefault();
                                   setComment(e.currentTarget.value)
                               }}
                    />
                </>
            </ModalDialog>
    }
}

export default useModalPackages;
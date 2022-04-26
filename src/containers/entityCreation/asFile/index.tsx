import React, {ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState} from 'react';
import { CollapseContainer, useLoading } from 'equisoft-design-ui-elements';
import { InputText } from "../../../components/general";
import produce, {immerable} from 'immer';
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import {
    defaultEntitiesService,
    defaultEntityInformationService,
    defaultXmlTemplateService,
} from '../../../lib/context';
import CreateAsFileRequest from '../../../lib/domain/entities/createAsFileRequest';
import XmlTemplate from '../../../lib/domain/entities/xmlTemplate';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import XmlTemplateService from '../../../lib/services/xmlTemplateService';
import GeneralComponent from '../../general/components/generalComponent';
import { OverrideEnumType } from '../../general/components/overrideEnum';
import useDebouncedSearch from "../../../components/general/hooks/useDebounceSearch";
import { validateRequiredFields } from "../util";
import FrameworkComponent from "../frameworkComponent";
import TemplateComponent from "../../general/components/templateComponent";

const FILE_TYPE_CODE = {
    name: 'FILE',
    code: '03',
    label: 'File',
};

class ErrorValidationFile {
    [immerable] = true;
    name = '';
    fileID = '';
}

interface AsFileCreationProps {
    xmlTemplateService: XmlTemplateService;
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const AsFileCreationWizard = ({
    xmlTemplateService,
    entityInformationService,
    entityService,
}: AsFileCreationProps) => {
    const { closeRightbar } = useContext(RightbarContext);
    const dispatch = useTabActions();
    const [request, setRequest] = useState<CreateAsFileRequest>(new CreateAsFileRequest());
    const [templates, setTemplates] = useState<XmlTemplate[]>([]);
    const [debouncedName, setDebouncedName] = useState('');

    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [errorValidation, setErrorValidation] = useState(new ErrorValidationFile());

    const [loading, load] = useLoading();

    const optionsTemplate = useMemo(() =>
        [{label: templates.length > 0 ? 'Select One' : ' No Template Available', value: ''},
            ...templates.map((t) => ({
                label: t.name,
                value: t.name,
            }))], [templates]);

    const useSearch = () =>
        useDebouncedSearch((name: string) => {
            setDebouncedName(name);
        });

    const { inputText, setInputText } = useSearch();

    useEffect(() => {
        setRequest(
            produce(request, (draft) => {
                draft.name = debouncedName;
            }),
        );
        handleFileName(debouncedName);
    }, [debouncedName]);

    const renderOverride = () => {
        return (
            <GeneralComponent
                data={request}
                filteredOverrides = {[
                    { name: OverrideEnumType.PCOMPANY.value, value: OverrideEnumType.PCOMPANY.code }
                ]}
                load={load}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
                setGeneralComponentState={() => setShowMessageOverride(false)}
            />
        );
    };

    const renderTemplates = () => {
        return (
            <TemplateComponent
                name={request.templateName}
                disabled={templates.length === 0}
                options={optionsTemplate}
                onChange={handleTemplateChange}
            />
        );
    };


    const handleFileName = async (val: string) => {
        setTemplates(await load(xmlTemplateService.getTemplates)(FILE_TYPE_CODE.label, val));
        renderTemplates();
    };

    const handleFieldChanged = (value: string) => {
        setInputText(value.trim());
        setErrorValidation(produce(errorValidation, (draft => {
            draft.name = '';
        })));
    }

    const handleFileId = async (val: string) => {
        setRequest(
            produce(request, (draft) => {
                draft.fileID = val;
            }),
        );
        setErrorValidation(produce(errorValidation, (draft) => {
            draft.fileID = '';
        }))
    };

    const handleTemplateChange = (value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft.templateName = value;
            }),
        );
    };

    const validateForm = () => {
        const { isValid, newError} = validateRequiredFields(errorValidation, request);
        setShowMessageOverride(!isOverrideValid);
        setErrorValidation(newError);
        return isValid && isOverrideValid;
    }
    const createAsFile = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()) {
            const file = await load(entityService.createAsFile)(request);
            const entityInformation = await load(entityInformationService.getEntityInformation)(
                file.entityType,
                file.getGuid(),
                'XML_DATA',
            );
            dispatch({ type: OPEN, payload: { data: entityInformation } });
            closeRightbar();
        }
    };

    return (
        <FrameworkComponent
            title='Create As File'
            loading={loading}
            onSubmit={createAsFile}
            onCancel={closeRightbar}
        >
            <CollapseContainer title="General" defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type='text'
                        label="File Name"
                        value={inputText}
                        required
                        feedbackMsg={errorValidation.name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            handleFieldChanged(e.target.value);
                        }}
                    />

                    <InputText
                        type='text'
                        label="File ID"
                        value={request.fileID}
                        required
                        feedbackMsg={errorValidation.fileID}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleFileId(e.target.value.trim())}
                    />
                </PanelSectionContainer>
            </CollapseContainer>
            <CollapseContainer title={'Override'} defaultOpened>
                <PanelSectionContainer>
                    {renderOverride()}
                </PanelSectionContainer>
            </CollapseContainer>
            <CollapseContainer title="Template">
                <PanelSectionContainer>
                    {renderTemplates()}
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

AsFileCreationWizard.defaultProps = {
    xmlTemplateService: defaultXmlTemplateService,
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
};

export default AsFileCreationWizard;

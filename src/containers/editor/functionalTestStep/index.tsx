import React, {ChangeEvent, useCallback, useContext} from "react";
import { useTabActions, useTabWithId } from "../../../components/editor/tabs/tabContext";
import { toast } from "react-toastify";
import FunctionalTestStepSession from "../../../lib/domain/entities/tabData/functionalTestStepSession";
import StepFields from "../functionalTestTab/stepHeader/stepFields";
import AutomatedTestStep, {
    getDefaultValueForStep,
    updateXmlStep
} from "../../../lib/domain/entities/automatedTestItems/automatedTestStep";
import { AutomatedTestStepChildType } from "../../../lib/domain/entities/automatedTestItems/automatedTestStepChild";
import produce, { Draft } from "immer";
import MonacoContainer from "../monaco/monaco";
import AutomatedTestActionSoap from "../../../lib/domain/entities/automatedTestItems/automatedTestActionSoap";
import AutomatedTestService from "../../../lib/services/automatedTestService";
import { defaultAutomatedTestService } from "../../../lib/context";
import { Loading, useLoading, WindowContainer } from "equisoft-design-ui-elements";
import { Button } from "@equisoft/design-elements-react";
import { CLOSE, EDIT_TAB_DATA, MONACO_DISPOSE } from "../../../components/editor/tabs/tabReducerTypes";
import AutomatedTestHeader from "../functionalTestTab/automatedTestHeader";
import { SidebarContext } from "../../../components/general/sidebar/sidebarContext";
import { ButtonSection, HeaderSection} from "./style";
import InputText from "../../../components/general/inputText";

type TypeFieldStep = 'typeStep' | 'nameStep' | 'childField' | 'folderName';

interface FunctionalTestStepProps {
    tabId: string;
    layoutId: number;
    automatedTestService: AutomatedTestService;
}

const FunctionalTestStep = ({ tabId, layoutId, automatedTestService }: FunctionalTestStepProps) => {
    const tab = useTabWithId(tabId);
    const { data : session } = tab;

    if (!(session instanceof FunctionalTestStepSession)) {
        toast.error(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const { toggleRefreshSidebar } = useContext(SidebarContext);

    const { templateStepPath, templateStep, saved, mode } = session;

    const isCreate = mode === 'CREATE';

    const [loading, load] = useLoading();

    const contentEdited = useCallback(() => updateTemplate(() => {}, session), [session]);

    const dispatch = useTabActions();

    const updateTemplate = (recipe: (draft: Draft<FunctionalTestStepSession>) => void,
                            baseSession = session,
                            statusSaved= false) => {
        const newSession = produce(baseSession, (draft) => {
            recipe(draft);
            draft.saved = statusSaved;
        });

        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: newSession
            }
        })

    }

    const handleTypeChange = (field: TypeFieldStep, value : string | AutomatedTestStepChildType | null, editorWillChange = false) => {
        switch (field) {
            case "typeStep":
                dispatch({ type: MONACO_DISPOSE, payload: { layoutId, dispose: [templateStep.modelId] }});
                updateTemplate((draft) => {
                    draft.templateStep.child =  value as AutomatedTestStepChildType;
                });
                break;
            case "childField":
                if (editorWillChange) {
                    dispatch({ type: MONACO_DISPOSE,
                        payload: {
                            layoutId,
                            dispose: [templateStep.modelId]
                        } });
                }
                updateTemplate((draft) => {
                    draft.templateStep.child = value as AutomatedTestStepChildType;
                });
                break;
            case "nameStep":
                updateTemplate((draft) => {
                    draft.templateStep.id =  value as string;
                });
                break;
            case "folderName":
                updateTemplate((draft => {
                    draft.templateStepPath = value as string;
                }));
                break;
        }
    };

    const handleOnClickSave = async () => {
        const modelId = templateStep.modelId || 0;
        const editorText = tab.model[modelId]?.getValue() ?? '';
        const stepToSave : AutomatedTestStep = updateXmlStep(templateStep, editorText);
        const path = isCreate ? templateStepPath + '@@' + stepToSave.id  : templateStepPath;
        if(isCreate){
            await load(async () => automatedTestService.createTemplateStep(path, stepToSave))();
            toast.success('Template step created successfully');
            dispatch({ type: CLOSE, payload: { id: tabId, layoutId } });
        } else  {
            await load(async () => automatedTestService.saveTemplateStep(path, stepToSave))();
            toast.success('Template step saved successfully');
            updateTemplate((draft) => {
                draft.templateStep = stepToSave;
            }, session, true);
        }
        toggleRefreshSidebar();
    }

    return (
        <WindowContainer>
            <Loading loading={loading} />
            {!isCreate &&
                <AutomatedTestHeader
                    saved={saved}
                    testCasePath={templateStepPath}
                    isEditMode={false}
                />
            }
            <HeaderSection>
                {isCreate &&
                    <div className='folder-name'>
                        <InputText
                            disabled
                            type='text'
                            label='Folder Name'
                            value={templateStepPath}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleTypeChange('folderName', e.target.value)}
                        />
                    </div>
                }
                <StepFields
                    automatedTestStep={templateStep}
                    handleTypeChange={handleTypeChange}
                    load={load}
                />

                <ButtonSection>
                   <Button buttonType='primary' disabled={loading} onClick={handleOnClickSave}>Save</Button>
                </ButtonSection>
            </HeaderSection>

            {templateStep &&
                <MonacoContainer
                    tabId={tabId}
                    layoutId={layoutId}
                    defaultValue={getDefaultValueForStep(templateStep)}
                    modelInstance={templateStep.modelId}
                    lang={templateStep.child?.type === 'AssessmentSql' ? 'sql' : 'xml'}
                    onChangeContent={contentEdited}
                    // TODO - Allan - add default actions
                    // defaultActions={monacoActions}
                    readOnly={
                        templateStep.child?.type === 'ActionSoap' &&
                        !!(templateStep.child as AutomatedTestActionSoap).dataFileName
                    }
                />
            }
        </WindowContainer>
    );
};

FunctionalTestStep.defaultProps = {
    automatedTestService: defaultAutomatedTestService
};

export default FunctionalTestStep;
import React, {useCallback, useEffect, useMemo, useState} from "react";
import AutomatedTestStep from "../../../../lib/domain/entities/automatedTestItems/automatedTestStep";
import ActionTypeBadge from "../actionTypeBadge";
import { StepContainer, StepListContainer, RowStepContainer, EmptyListContainer } from "./style";
import { DropZone, ItemDraggable, ItemDropZone } from "../../../../components/dragDrop";
import DraggableComponent from "../../../../components/dragDrop/draggableComponent";
import { CollapseContainer } from "equisoft-design-ui-elements";
import { Button } from "@equisoft/design-elements-react";
import NoRecordsFound from "../../../../components/general/noRecordsFound";

interface FunctionalStepListProps {
    stepList: AutomatedTestStep[];
    listBadgesStatus: {[ stepId: string] : JSX.Element},
    cursor: number,
    handleDragDropStep(step: AutomatedTestStep, index: number) : void,
    handleCursorChange(index: number) : void;
    actionsAddStep(step: AutomatedTestStep): JSX.Element;
    addStep() : void;
}
const FunctionalStepList = ({ stepList,
                              handleDragDropStep,
                              listBadgesStatus,
                              cursor,
                              handleCursorChange,
                              actionsAddStep,
                              addStep} : FunctionalStepListProps) => {

    const [isOpen, setIsOpen] = useState(true);
    const [layout, setLayout] = useState<ItemDraggable[]>([]);
    const [stepActive, setStepActive] = useState<AutomatedTestStep>();

    const isAddingStep = useMemo(() => stepList.some(s => s.htmlInput), [stepList]);

    useEffect(() => setStepActive(stepList[cursor]), [stepList, cursor]);

    useEffect(() =>
        setLayout(stepList.map((step) => new ItemDraggable(step.id, 'row', step)))
        ,[stepList]);

    const handleDrop = useCallback((dropZone: ItemDropZone, { item } : ItemDraggable) => {
        const [indexPath] = dropZone.path.split("-");
        handleDragDropStep(item, parseInt(indexPath, 10));
    }, [layout]);

    const actionsStepsSection = () =>
        <div onClick={(e) => e.stopPropagation()}>
            <Button buttonType="tertiary"
                    onClick={addStep}
                    disabled={!isOpen || isAddingStep}
            >+ Add
            </Button>
        </div>

    const renderRow = ( data: ItemDraggable) =>
            <RowStepContainer active={stepActive?.uuid === data.item.uuid} disabled={data.item.disabled}>
                <div className='step-content'>
                    <ActionTypeBadge type={data?.item?.child?.type}/>
                    <span title={data.id}>{data.id}</span>
                </div>
                <div className='step-icon'>
                    {listBadgesStatus[data?.item?.id]}
                </div>
            </RowStepContainer>;

    return (
        <StepContainer>
            <CollapseContainer
                open={isOpen}
                toggleOpen={() => setIsOpen((prevState) => !prevState)}
                title='Steps'
                actions={actionsStepsSection()}
            >
                <StepListContainer>
                    {layout.length > 0 ?
                        <>
                            {layout.map((row, index) => {
                                const currentPath = `${index}`;
                                return (
                                    <li key={row.id}>
                                        <DropZone
                                            data={new ItemDropZone(currentPath, layout.length)}
                                            onDrop={handleDrop}
                                        />
                                        <div className={row.item.htmlInput ? 'add-test-case' : 'open-test-case'}
                                             onClick={() => {
                                                 !row.item.htmlInput && handleCursorChange(index);
                                                 setStepActive(row.item);
                                             }}>
                                            {row.item.htmlInput ?
                                                <div className='add-container'>
                                                    <div className='add-input'>{row.item.htmlInput}</div>
                                                    <div className='add-buttons'>
                                                        {actionsAddStep(row.item)}
                                                    </div>
                                                </div>
                                                :
                                                <DraggableComponent
                                                    id={row.id}
                                                    item={row.item}
                                                    component={renderRow.bind(null, row)}
                                                    path={currentPath}
                                                />
                                            }
                                        </div>
                                    </li>
                                );
                            })}
                            <DropZone
                                data={new ItemDropZone((layout.length).toString(), layout.length)}
                                onDrop={handleDrop}
                                isLast
                            />
                        </>
                        :
                        <EmptyListContainer>
                            <NoRecordsFound />
                            <DropZone
                                data={new ItemDropZone((layout.length).toString(), layout.length)}
                                onDrop={handleDrop}
                                isLast
                            />
                        </EmptyListContainer>
                    }
                </StepListContainer>
            </CollapseContainer>
        </StepContainer>
    );
}

export default FunctionalStepList;



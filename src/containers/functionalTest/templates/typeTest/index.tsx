import React, {useState} from 'react';
import AutomatedTestTreeTemplateStep
    from "../../../../lib/domain/entities/automatedTestItems/tree/automatedTestTreeTemplateStep";
import { DraggableTemplateItemContainer, FolderContainer, TypeTestContainer } from "../style";
import { nodeGenerator } from "../index";
import DraggableComponent from "../../../../components/dragDrop/draggableComponent";
import { ActionNav, ActionNavItem, NavItem } from "../../../../components/general/sidebar/actionNav/style";
import ActionNavButton from "../../../../components/general/sidebar/actionNav/actionNavButton";

interface TypeTestProps {
    itemTypeTest: AutomatedTestTreeTemplateStep,
    handleItemClick(node: AutomatedTestTreeTemplateStep): void,
    addTemplate(folderName: string) : void,
    processDeleteTemplate(node: AutomatedTestTreeTemplateStep) : void
}

const TypeTest = ({ itemTypeTest, handleItemClick, addTemplate, processDeleteTemplate } : TypeTestProps) => {
    const [open, setOpen] = useState(false);

    return (
        <TypeTestContainer
            onClick={(e) => e.stopPropagation()}
        >
            <FolderContainer onClick={() => {
                setOpen((prev) => !prev);
            }}>
                <div className='content'>
                    {nodeGenerator(itemTypeTest, open)}
                    <span>{itemTypeTest.name}</span>
                </div>
                <div className='menu-actions'>
                    <ActionNav>
                        <ActionNavItem>
                            <NavItem onClick={(e) => e?.stopPropagation()}>...</NavItem>
                            <ul>
                                <li>
                                    <ActionNavButton
                                        onClick={(e) => {
                                            e?.stopPropagation();
                                            addTemplate(itemTypeTest.name);
                                        }}
                                        title='Add template'
                                    />
                                </li>
                                <li>
                                    <ActionNavButton
                                        onClick={(e) => {
                                            e?.stopPropagation();
                                            processDeleteTemplate(itemTypeTest);
                                        }}
                                        title='Delete'
                                    />
                                </li>
                            </ul>
                        </ActionNavItem>
                    </ActionNav>
                </div>
            </FolderContainer>
            {open && itemTypeTest?.children.map((step) =>
                <DraggableComponent
                    key={step.templateStep.uuid}
                    id={step.templateStep.uuid}
                    item={step.templateStep}
                    component={() =>
                        <>
                            <DraggableTemplateItemContainer onClick={() => handleItemClick(step)}>
                                {nodeGenerator(step)}
                                {step?.templateStep?.id}
                                <div className='menu-actions'>
                                    <ActionNav>
                                        <ActionNavItem>
                                            <NavItem onClick={(e) => e?.stopPropagation()}>...</NavItem>
                                            <ul>
                                                <li>
                                                    <ActionNavButton
                                                        onClick={(e) => {
                                                            e?.stopPropagation();
                                                            processDeleteTemplate(step);
                                                        }}
                                                        title='Delete'
                                                    />
                                                </li>
                                            </ul>
                                        </ActionNavItem>
                                    </ActionNav>
                                </div>
                            </DraggableTemplateItemContainer>
                        </>}
                />
            )}
        </TypeTestContainer>
    )};

export default TypeTest;
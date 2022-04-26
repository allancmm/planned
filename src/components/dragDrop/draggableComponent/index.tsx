import React from "react";
import { useDrag } from "react-dnd";
import { ItemDraggable } from "../itemDraggable";
import { DraggableContainer } from "./style";

interface DraggableComponentProps {
    id: string,
    item: any,
    path?: string,
    type?: string,
    component: Function,
}

const DraggableComponent = ({ id, item, type = 'row', path = '', component } : DraggableComponentProps) => {
    const [{ opacity }, drag] = useDrag({
        item: new ItemDraggable(id, type, item, path),
        collect: monitor => ({
            opacity: monitor.isDragging() ? 0.4 : 1,
            isDragging: monitor.isDragging()
        })
    });
    return (
        <DraggableContainer ref={drag} opacity={opacity}>
            {component()}
        </DraggableContainer>
    );
};

export default DraggableComponent;

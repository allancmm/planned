import React from "react";
import classNames from "classnames";
import { useDrop } from "react-dnd";
import { DropZoneContainer } from "./style";
import { ItemDropZone } from "../itemDropZone";
import { ItemDraggable } from "../itemDraggable";

interface DropZonePros {
    data: ItemDropZone;
    isLast?: boolean,
    className?: string;
    children?: JSX.Element;
    onDrop(dropZone: ItemDropZone, item: ItemDraggable) : void;
}
export const DropZone = ({ data, onDrop, isLast = false, className = '', children } : DropZonePros) => {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: ["row"],
        drop: (item: ItemDraggable, _) => {
            onDrop(data, item);
        },
        canDrop: (item : ItemDraggable) => {
            const dropZonePath = data.path;
            const splitDropZonePath = dropZonePath.split("-");
            const itemPath = item.path;

            // items with no path can always be dropped anywhere
            if (!itemPath) {
                return true;
            }

            const splitItemPath = itemPath.split("-");

            // limit columns when dragging from one row to another row
            const dropZonePathRowIndex = splitDropZonePath[0]; // index target
            const itemPathRowIndex = splitItemPath[0]; // index origin
            const diffRow = dropZonePathRowIndex !== itemPathRowIndex;

            if (
                diffRow &&
                splitDropZonePath.length === 2 &&
                data.childrenCount >= 3
            ) {
                return false;
            }

            // Invalid (Can't drop a parent element (row) into a child (column))
            const parentDropInChild = splitItemPath.length < splitDropZonePath.length;
            if (parentDropInChild) return false;

            // Current item can't possible move to it's own location
            if (itemPath === dropZonePath) {
                return false;
            };

            // Current area
            if (splitItemPath.length === splitDropZonePath.length) {
                const pathToItem = splitItemPath.slice(0, -1).join("-");
                const currentItemIndex = Number(splitItemPath.slice(-1)[0]);

                const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");
                const currentDropZoneIndex = Number(splitDropZonePath.slice(-1)[0]);

                if (pathToItem === pathToDropZone) {
                    const nextDropZoneIndex = currentItemIndex + 1;
                    if (nextDropZoneIndex === currentDropZoneIndex) return false;
                }
            }

            return true;
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    });

    const isActive = isOver && canDrop;
    return (
        <DropZoneContainer>
            <div className={classNames("dropZone", { active: isActive, isLast }, className)}
                ref={drop}
            >
                {!!children && children}
            </div>
        </DropZoneContainer>
    );
};

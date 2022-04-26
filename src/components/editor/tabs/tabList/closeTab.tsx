import React from 'react';
import { CloseButton } from './style';
import { CloseIcon } from "../../../../components/general";

interface CloseIconProps {
    onClick(): void;
}

const CloseIconContainer = ({ onClick }: CloseIconProps) => {
    return (
        <CloseButton
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.stopPropagation();
                onClick();
            }}
        >
            <CloseIcon />
        </CloseButton>
    );
};

export default CloseIconContainer;

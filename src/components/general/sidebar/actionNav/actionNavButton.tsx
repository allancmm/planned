import React, { MouseEvent } from 'react';
import {Icon, RIcon, Title} from './style';

interface ButtonProps {
    icon?: React.ReactElement;
    rIcon?: React.ReactElement;
    title: string;

    onClick?(e: MouseEvent<HTMLAnchorElement>): void;
}

const ActionNavButton = ({ icon, rIcon, title, onClick}: ButtonProps) => {
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
    };

    return (
        <Title onClick={handleClick}>
            <Icon>{icon}</Icon>
            {title}
            <RIcon>{rIcon}</RIcon>
        </Title>
    );
};

export default ActionNavButton;

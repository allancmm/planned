import React, { MouseEvent } from 'react';
import { Disabled, Icon, RIcon, Shortcut, Title } from './style';

interface ButtonProps {
    icon?: React.ReactElement;
    rIcon?: React.ReactElement;
    title: string;
    shortcut?: string;
    active?: boolean;
    href?: string;
    target?: string;

    onClick?(e: MouseEvent<HTMLAnchorElement>): void;
}

const SubMenuButton = ({ icon, rIcon, title, shortcut, active = true, onClick, ...props }: ButtonProps) => {
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        onClick && onClick(e);
    };

    return (
        <>
            {active ? (
                <a role="menuitem" onClick={handleClick} {...props}>
                    <Title>
                        <Icon>{icon}</Icon>
                        {title}
                        <RIcon>{rIcon}</RIcon>
                    </Title>
                    <Shortcut>{shortcut}</Shortcut>
                </a>
            ) : (
                <Disabled>
                    <a role="menuitem" onClick={handleClick} {...props}>
                        <Title>
                            <Icon>{icon}</Icon>
                            {title}
                            <RIcon>{rIcon}</RIcon>
                        </Title>
                        <Shortcut>{shortcut}</Shortcut>
                    </a>
                </Disabled>
            )}
        </>
    );
};

export default SubMenuButton;

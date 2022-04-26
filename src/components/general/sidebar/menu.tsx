import React from 'react';
import useGlobalKeydown from '../hooks/globalKeyDown';
import { Icon, LabelContent, MenuContainer, MenuItem, MenuLink } from './style';

interface MenuHeaderProps {
    icon: React.ReactElement;
    title: string;
    description?: string;
    href?: any;
    className?: string;
    children?: React.ReactElement;
    active?: boolean;
    shortcut?: string[];
    disabled?: boolean;
    onClick?(): void;
}

export const MenuHeader = ({
    icon,
    title,
    description,
    children,
    href,
    className,
    onClick = () => {},
    active,
    shortcut = [],
    disabled = false,
}: MenuHeaderProps) => {

    useGlobalKeydown(
        {
            keys: shortcut,
            onKeyDown: onClick,
        },
        [shortcut, onClick],
    );
     const shortcutString = ' (' + shortcut.map((s) => s.toUpperCase()).join('+') + ')';

    const tooltip = (description ?? title) + shortcutString; // idk, chrome title tooltip seems finicky sometimes, so i put it on each element

    return (
        <MenuContainer className={className ?? ''}>
            <MenuItem className={active ? 'active' : ''  } title={tooltip} disabled={disabled}>
                <MenuLink onClick={onClick}
                          {...(href ? {} : { role: 'button' })}
                          href={href}
                          title={tooltip}>
                    <Icon title={tooltip}  active={active}>{icon}</Icon>
                    <LabelContent active={active}>{title}</LabelContent>
                    {children}
                </MenuLink>
            </MenuItem>
        </MenuContainer>
    );
};

export default MenuHeader;

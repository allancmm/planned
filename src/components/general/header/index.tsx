import React, { useContext } from 'react';
import { DesignThemeContext } from 'equisoft-design-ui-elements';
import { AuthContext, hasExternalLoginIntegration } from '../../../page/authContext';
import EditorMenu from '../../editor/menu';
import { HeaderContainer, HeaderElement, LogoEquisoft, MenusContainer } from './style';
import { useModal, UserProfile } from "@equisoft/design-elements-react";
import { ModalChangePassword } from "../../password";

const Header = () => {
    const { auth, logout } = useContext(AuthContext);
    const { theme, setTheme } = useContext(DesignThemeContext);

    const {
        isModalOpen,
        closeModal,
        openModal,
    } = useModal();

    const toggleTheme = () => {
        if (theme === 'dark') {
            setTheme('light');
        } else if (theme === 'light') {
            setTheme('dark');
        }
    };

    const menuList = !hasExternalLoginIntegration() ? [
        { value: 'Logout', onClick: logout, href: '#' },
        { value: 'Preferences', href: '#', disabled: true },
        { value: 'Change Password', onClick: openModal, href: '#' },
        { value: 'Toggle Theme', onClick: toggleTheme, href: '#' },
    ] : [
        { value: 'Logout', onClick: logout, href: '#' },
        { value: 'Preferences', href: '#',  disabled: true },
        { value: 'Toggle Theme', onClick: toggleTheme, href: '#' },
    ];

    return (
        <HeaderContainer>
            <LogoEquisoft src="./Equisoft-design-reverse.svg" alt="Equisoft/design" data-testid="logo" />
            <MenusContainer>
                <EditorMenu />
                <HeaderElement>
                    <li>
                        {auth.environment} | {auth.oipaEnvironment?.displayName}
                    </li>
                    {auth.userName && <UserProfile options={menuList} username={auth.userName}/>}
                </HeaderElement>
            </MenusContainer>
            {isModalOpen && <ModalChangePassword closeModal={closeModal} />}
        </HeaderContainer>
    );
};

export default Header;

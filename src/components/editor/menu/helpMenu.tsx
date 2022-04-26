import React from 'react';
import { NavBarMenuItem } from './style';
import SubMenuButton from './submenubutton';
import { defaultInteropService } from '../../../lib/context';
import InteropService from '../../../lib/services/interopService';

const HelpMenu = ({ interopService }: { interopService: InteropService }) => {

    return (
        <NavBarMenuItem>
            <button>Help</button>
            <ul>
                <li>
                    <SubMenuButton target="_blank" title={'REST API Documentation'} href={interopService.getApiDocUrl()} />
                </li>
                <hr />
                <li>
                    <SubMenuButton
                        title="XML configuration guide 11.2"
                        href="https://docs.oracle.com/cd/E93130_01/xml_guide/Content/introduction/Introduction.htm"
                        target="_blank"
                    />
                </li>
            </ul>
        </NavBarMenuItem>
    );
};

HelpMenu.defaultProps = {
    interopService: defaultInteropService,
};

export default HelpMenu;

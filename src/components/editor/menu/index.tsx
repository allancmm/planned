import React from 'react';
import { Nav } from './style';
import FileMenu from './fileMenu';
import EntityMenu from './entityMenu';
import ToolsMenu from './toolsMenu';
import HelpMenu from './helpMenu';
import GoTo from "./goTo";

const EditorMenu = () => {
    return (
        <Nav>
            <ul>
                <FileMenu />
                <EntityMenu />
                <ToolsMenu />
                <GoTo />
                <HelpMenu />
            </ul>
        </Nav>
    );
};

export default EditorMenu;

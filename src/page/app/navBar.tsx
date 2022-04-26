import React, { useContext } from 'react';
import {
    BookOpen as DataManagement,
    CheckCircle as UnitTestIcon,
    CheckSquare as FunctionIcon,
    FileText as FileTextIcon,
    Home,
    GitPullRequest as GitIcon,
    Package as PackageIcon,
    PlayCircle as DebuggerIcon,
    Search as SearchIcon,
    User as AdminIcon,
} from 'react-feather';
import MenuHeader from '../../components/general/sidebar/menu';
import { SidebarContext } from '../../components/general/sidebar/sidebarContext';
import { MainMenu, Nav } from '../../components/general/sidebar/style';
import { AuthContext } from "../authContext";

const NavBar = () => {
    const { openSidebar, sidebarType } = useContext(SidebarContext);
    const { auth } = useContext(AuthContext);

    return (
        <Nav>
            <MainMenu>
                <MenuHeader
                    active={sidebarType === 'Home'}
                    icon={<Home />}
                    title='Home'
                    onClick={() => openSidebar('Home')}
                    shortcut={['alt', 'h']}
                />

                <MenuHeader
                    active={sidebarType === 'Explorer'}
                    icon={<FileTextIcon />}
                    title='Explorer'
                    onClick={() => openSidebar('Explorer')}
                    shortcut={['alt', 'e']}
                />
                <MenuHeader
                    active={sidebarType === 'Search'}
                    icon={<SearchIcon />}
                    title='Search'
                    onClick={() => openSidebar('Search')}
                    shortcut={['alt', 'f']}
                />
                <MenuHeader
                    active={sidebarType === 'Debug'}
                    icon={<DebuggerIcon />}
                    title='Debug'
                    onClick={() => openSidebar('Debug')}
                    shortcut={['alt', 'd']}
                />

                <MenuHeader
                    active={sidebarType === 'Package'}
                    icon={<PackageIcon />}
                    title='Package'
                    onClick={() => openSidebar('Package')}
                    shortcut={['alt', 'c']}
                />
                <MenuHeader
                    active={sidebarType === 'Git'}
                    icon={<GitIcon />}
                    title='Git'
                    description='Git Source Control'
                    onClick={() => openSidebar('Git')}
                    shortcut={['alt', 'a']}
                    disabled={auth.appFunctionDisabled(['GIT_VIEW'])}
                />

                <MenuHeader
                    active={sidebarType === 'UnitTests'}
                    icon={<UnitTestIcon />}
                    title='Unit'
                    description='Unit Tests'
                    onClick={() => openSidebar('UnitTests')}
                    shortcut={['alt', 'u']}
                />
                <MenuHeader
                    active={sidebarType === 'Function'}
                    icon={<FunctionIcon />}
                    title='Functional'
                    description='Functional Tests'
                    onClick={() => openSidebar('Function')}
                    shortcut={['alt', 't']}
                />
                <MenuHeader
                    active={sidebarType === 'DataManagement'}
                    icon={<DataManagement />}
                    title='Data'
                    description='Data Management'
                    onClick={() => openSidebar('DataManagement')}
                    shortcut={['alt', 'y']}
                />
            </MainMenu>

            <MainMenu>
                <hr/>
                <MenuHeader
                    active={sidebarType === 'Administration'}
                    icon={<AdminIcon />}
                    title='Admin'
                    description='Administration'
                    onClick={() => openSidebar('Administration')}
                    shortcut={['alt', 'b']}
                    disabled={auth.appFunctionDisabled(['ADMINISTRATION_VIEW'])}
                />
            </MainMenu>
        </Nav>
    );
};

export default NavBar;
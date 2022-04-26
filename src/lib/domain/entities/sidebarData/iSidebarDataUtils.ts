import { SidebarType } from '../../../../components/general/sidebar/sidebarContext';
import DebuggerDataDocument from './debuggerData';
import ExplorerDataDocument from './explorerData';
import { ISidebarData } from './iSidebarData';
import SearchRulesDocument from './searchData';

export const SidebarDataFactory = (type: SidebarType): ISidebarData => {
    switch (type) {
        case 'Search':
            return new SearchRulesDocument();
        case 'Explorer':
            return new ExplorerDataDocument();
        case 'Debug':
            return new DebuggerDataDocument();
        default:
            return new ISidebarData();
    }
};

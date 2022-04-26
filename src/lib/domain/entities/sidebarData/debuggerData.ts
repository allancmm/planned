import DebuggerForm from '../debuggerForm';
import { ISidebarData } from './iSidebarData';

export default class DebuggerDataDocument extends ISidebarData {
    clazz: string = 'DebuggerDataDocument';

    public defaultContextForm = new DebuggerForm();
}

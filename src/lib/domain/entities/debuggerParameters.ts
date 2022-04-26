import { immerable } from 'immer';
import MultifieldItem from './multifieldItem';
import ParameterItem from './parameterItem';

export default class DebuggerParameters {
    [immerable] = true;

    public section: string = 'Math';
    public ruleSections: string[] = [];
    public parametersXml: string = '';
    public parametersTable: ParameterItem[] = [];

    // to manage the many sections of multifields that can have many parameters item by index
    public multifieldsIndex: MultifieldItem[] = [];
    public hasSections: boolean = false;
}

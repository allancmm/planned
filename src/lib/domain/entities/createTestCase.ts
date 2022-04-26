import { EntityLevel } from '../enums/entityLevel';
import DebuggerEntity from './debuggerEntity';

export default class CreateTestCase {
    public parameters: string = '';
    public testData: string = '';
    public section: string = '';

    public level: EntityLevel = 'NONE';
    public context: DebuggerEntity = new DebuggerEntity();
}

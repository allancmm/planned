import { Type } from "class-transformer";
import AutomatedTestLogDetail from "./automatedTestLogDetail";

export default class AutomatedTestLogResult extends AutomatedTestLogDetail {
    @Type(() => AutomatedTestLogResult)
    childrenLogs: AutomatedTestLogResult[] = [];

}

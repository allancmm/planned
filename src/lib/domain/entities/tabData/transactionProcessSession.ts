import { ITabData } from "./iTabData";
import { EntityType } from "../../enums/entityType";
import TransactionProcess from "../transactionProcess";

export default class TransactionProcessSession extends ITabData {
    clazz: string = "TransactionProcessSession";

    public isUpdated: boolean = false;

    public transactions: TransactionProcess[] = [];

    public searchText = '';

    public selectedPlan = '';

    constructor(selectedPlan: string) {
        super();
        this.selectedPlan = selectedPlan;
    }

    generateTabId(): string {
        return 'TransactionProcessSession';
    }

    getGuid(): string {
        return this.generateTabId();
    }

    getName(): string {
        return 'Transaction Processing Order';
    }

    getType(): EntityType {
        return 'TRANSACTION_PROCESS';
    }

    getExtra(): string {
        return 'Transaction Processing Order';
    }
}
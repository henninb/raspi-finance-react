import {TransactionState} from "./TransactionState";

export default interface ValidationAmount {
    validationId?: number;
    validationDate: Date;
    accountId?: number;
    amount: number;
    transactionState: TransactionState;
    activeStatus: Boolean;
    dateAdded?: Date;
    dateUpdated?: Date;
}
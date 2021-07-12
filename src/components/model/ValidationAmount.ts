import {TransactionState} from "./TransactionState";

export default interface ValidationAmount {
    validationId?: number;
    validationDate: Date;
    accountId: number;
    accountNameOwner: String;
    amount: number;
    transactionState: TransactionState;
    activeStatus: Boolean;
    dateAdded?: Date;
    dateUpdated?: Date;
}
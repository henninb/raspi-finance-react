import { AccountType } from "./AccountType";
import {TransactionState} from "./TransactionState";
import {ReoccurringType} from "./ReoccurringType";

export default interface Transaction {
    transactionId: number;
    guid: String;
    accountId: number;
    accountType: AccountType;
    accountNameOwner: String;
    transactionDate: Date;
    description: String;
    category: String;
    amount: number;
    transactionState: TransactionState;
    activeStatus: Boolean;
    reoccurringType: ReoccurringType;
    notes: String;
    //images
}

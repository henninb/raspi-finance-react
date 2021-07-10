import {AccountType} from "./AccountType";

export default interface Account {
    accountId: number;
    accountNameOwner: String;
    accountType: AccountType;
    activeStatus: Boolean;
    moniker: String;
    outstanding: number;
    future: number;
    cleared: number;
}

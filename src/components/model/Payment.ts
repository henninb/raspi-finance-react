export default interface Payment {
    paymentId: number;
    accountNameOwner: String;
    transactionDate: Date;
    amount: number;
    activeStatus: Boolean;
}

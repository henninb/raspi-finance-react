import { basicAuth, endpointUrl } from "../Common";
import { v4 as uuidv4 } from "uuid";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { getAccountKey } from "./KeyFile";
import Transaction from "../model/Transaction";

export type TransactionInsertType = {
  accountNameOwner: String;
  newRow: Transaction;
  isFutureTransaction: Boolean;
};

const setupNewTransaction = (
  payload: Transaction,
  accountNameOwner: String
): Transaction => {
  return {
    guid: uuidv4(),
    transactionDate: payload.transactionDate,
    description: payload.description,
    category: payload.category ? payload.category : "undefined",
    notes: payload.notes === undefined ? "" : payload.notes,
    amount: payload.amount,
    dueDate: payload.dueDate ? payload.dueDate : undefined,
    transactionType: payload.transactionType
      ? payload.transactionType
      : "undefined",
    transactionState: payload.transactionState
      ? payload.transactionState
      : "outstanding",
    activeStatus: true,
    accountType: payload.accountType ? payload.accountType : "undefined",
    reoccurringType: payload.reoccurringType
      ? payload.reoccurringType
      : "onetime",
    accountNameOwner: accountNameOwner,
  };

  //TODO: fix dueDate
  // if (payload['dueDate'] === "") {
  //     delete payload['dueDate']
  // }
  //
  // if (payload['dueDate'] !== "") {
  //     newPayload['dueDate'] = payload.dueDate
  // }
  //return newPayload
};

const insertTransaction = async (
  accountNameOwner: String,
  payload: Transaction,
  isFutureTransaction: Boolean
): Promise<any> => {
  let endpoint = endpointUrl() + "/transaction/insert";
  if (isFutureTransaction) {
    endpoint = endpointUrl() + "/transaction/future/insert";
    console.log("will insert futureTransaction");
  }

  let newPayload = setupNewTransaction(payload, accountNameOwner);

  console.log("newPayload: " + JSON.stringify(newPayload));
  const response = await axios.post(endpoint, newPayload, {
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuth(),
    },
  });
  console.log(JSON.stringify(response.data));
  return response.data;
};

export default function useTransactionInsert(accountNameOwner: any) {
  const queryClient = useQueryClient();

  return useMutation(
    ["insertTransaction"],
    (variables: TransactionInsertType) =>
      insertTransaction(
        accountNameOwner,
        variables.newRow,
        variables.isFutureTransaction
      ),
    {
      onError: (error: AxiosError<any>) => {
        console.log(error ? error : "error is undefined.");
        console.log(
          error.response ? error.response : "error.response is undefined."
        );
        console.log(
          error.response
            ? JSON.stringify(error.response)
            : "error.response is undefined - cannot stringify."
        );
        //handleError(error, 'fetchAccountData', true)
      },

      onSuccess: (response) => {
        let oldData: any = queryClient.getQueryData(
          getAccountKey(accountNameOwner)
        );
        if (oldData) {
          let newData = [response, ...oldData];
          queryClient.setQueryData(getAccountKey(accountNameOwner), newData);
        }
      },
    }
  );
}

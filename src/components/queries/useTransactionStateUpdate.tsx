import axios, { AxiosError } from "axios";
import { basicAuth } from "../Common";
import { useMutation, useQueryClient } from "react-query";
import { getAccountKey } from "./KeyFile";
import { TransactionState } from "../model/TransactionState";

const changeTransactionState = async (
  guid: string,
  newTransactionState: TransactionState,
): Promise<any> => {
  const response = await axios.put(
    "/api/transaction/state/update/" + guid + "/" + newTransactionState,
    "{}",
    {
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: basicAuth(),
      },
    },
  );
  return response.data;
};

export default function useTransactionStateUpdate(accountNameOwner: string) {
  const queryClient = useQueryClient();

  return useMutation(
    ["transactionState"],
    (variables: any) =>
      changeTransactionState(variables.guid, variables.transactionState),
    {
      onError: (error: AxiosError<any>) => {
        console.log(error ? error : "error is undefined.");
        console.log(
          error.response ? error.response : "error.response is undefined.",
        );
        console.log(
          error.response
            ? JSON.stringify(error.response)
            : "error.response is undefined - cannot stringify.",
        );
      },

      onSuccess: (response: any) => {
        const oldData: any = queryClient.getQueryData(
          getAccountKey(accountNameOwner),
        );

        const newData = oldData.map((element: any) => {
          if (element["guid"] === response.guid) {
            return { ...element, transactionState: response.transactionState };
          } else {
            return element;
          }
        });

        queryClient.setQueryData(getAccountKey(accountNameOwner), newData);
      },
    },
  );
}

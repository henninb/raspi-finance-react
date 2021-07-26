import axios, { AxiosError } from "axios";
import { basicAuth, endpointUrl } from "../Common";
import { useMutation, useQueryClient } from "react-query";
import { getAccountKey } from "./KeyFile";
import { TransactionState } from "../model/TransactionState";

const changeTransactionState = async (
  guid: String,
  newTransactionState: TransactionState
): Promise<any> => {
  const response = await axios.put(
    endpointUrl() +
      "/transaction/state/update/" +
      guid +
      "/" +
      newTransactionState,
    "{}",
    {
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: basicAuth(),
      },
    }
  );
  return response.data;
};

export default function useTransactionStateUpdate(accountNameOwner: String) {
  const queryClient = useQueryClient();

  return useMutation(
    ["transactionState"],
    (variables: any) =>
      changeTransactionState(variables.guid, variables.transactionState),
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
      },

      onSuccess: (response: any) => {
        let oldData: any = queryClient.getQueryData(
          getAccountKey(accountNameOwner)
        );

        let newData = oldData.map((element: any) => {
          if (element["guid"] === response.guid) {
            return { ...element, transactionState: response.transactionState };
          } else {
            return element;
          }
        });

        queryClient.setQueryData(getAccountKey(accountNameOwner), newData);
      },
    }
  );
}

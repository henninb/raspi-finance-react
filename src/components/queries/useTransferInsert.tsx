import { basicAuth } from "../Common";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import Transfer from "../model/Transfer";

const setupNewTransfer = (payload: any) => {
  return {
    sourceAccount: payload.accountNameOwner,
    destinationAccount: payload.accountNameOwner,
    amount: payload.amount,
    transactionDate: payload.transactionDate.toISOString(),
  };
};

const insertTransfer = async (payload: Transfer): Promise<any> => {
  const endpoint = "/api/transfer/insert";
  const newPayload = setupNewTransfer(payload);

  const response = await axios.post(endpoint, newPayload, {
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuth(),
    },
  });
  return response.data;
};

export default function useTransferInsert() {
  const queryClient = useQueryClient();

  return useMutation(
    ["insertTransfer"],
    (variables: any) => insertTransfer(variables.payload),
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

      onSuccess: (response) => {
        const oldData: any = queryClient.getQueryData("transfer");
        const newData = [response, ...oldData];
        queryClient.setQueryData("transfer", newData);
      },
    },
  );
}

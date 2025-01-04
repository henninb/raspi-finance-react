import { basicAuth } from "../Common";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import Transfer from "../model/Transfer";

const deleteTransfer = async (payload: Transfer): Promise<string> => {
  const endpoint = "/api/transfer/delete/" + payload.transferId;

  const response = await axios.delete(endpoint, {
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuth(),
    },
  });
  return response.data;
};

export default function useTransferDelete() {
  const queryClient = useQueryClient();

  return useMutation(
    ["deleteTransfer"],
    (variables: any) => deleteTransfer(variables.oldRow),
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

      onSuccess: (_response, variables) => {
        const oldData: any = queryClient.getQueryData("transfer");
        const newData = oldData.filter(
          (t: any) => t.tableData.id !== variables.oldRow.tableData.id,
        );
        queryClient.setQueryData("transfer", newData);
      },
    },
  );
}

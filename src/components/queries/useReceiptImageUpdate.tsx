import axios, { AxiosError } from "axios";
import { basicAuth, endpointUrl } from "../Common";
import { useMutation, useQueryClient } from "react-query";
import { getAccountKey } from "./KeyFile";

const insertReceiptImage = async (
  currentTransaction: any,
  fileContent: any
): Promise<any> => {
  let endpoint =
    endpointUrl() +
    "/transaction/update/receipt/image/" +
    currentTransaction.guid;

  const response = await axios.put(endpoint, fileContent, {
    timeout: 0,
    headers: {
      "Content-Type": "text/plain",
      Authorization: basicAuth(),
    },
  });
  return response.data;
};

export default function useReceiptImageUpdate() {
  const queryClient = useQueryClient();

  return useMutation(
    ["insertReceiptImage"],
    (variables: any) =>
      insertReceiptImage(variables.oldRow, variables.fileContent),
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

      onSuccess: (response, variables) => {
        let oldData: any = queryClient.getQueryData(
          getAccountKey(variables.oldRow.accountNameOwner)
        );

        const dataUpdate = [...oldData];
        const index = variables.oldRow.tableData.id;
        dataUpdate[index] = variables.oldRow;
        dataUpdate[index].receiptImage = variables.fileContent;
        let newData = [...dataUpdate];

        queryClient.setQueryData(
          getAccountKey(variables.oldRow.accountNameOwner),
          newData
        );
      },
    }
  );
}

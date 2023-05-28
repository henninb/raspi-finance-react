import { basicAuth } from "../Common";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";

const deleteAccount = async (payload: any): Promise<any> => {
  let endpoint = "/account/delete/" + payload.accountNameOwner;

  const response = await axios.delete(endpoint, {
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuth(),
    },
  });
  return response.data;
};

export default function useAccountDelete() {
  const queryClient = useQueryClient();

  return useMutation(
    ["deleteAccount"],
    (variables: any) => deleteAccount(variables.oldRow),
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
        let oldData: any = queryClient.getQueryData("account");
        let newData = oldData.filter(
          (t: any) => t.tableData.id !== variables.oldRow.tableData.id
        );
        queryClient.setQueryData("account", newData);
      },
    }
  );
}

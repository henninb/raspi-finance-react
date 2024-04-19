import { basicAuth } from "../Common";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import Account from "../model/Account";

const setupNewAccount = (payload: Account) => {
  const now = new Date();
  payload.cleared = 0.0;
  payload.future = 0.0;
  payload.outstanding = 0.0;
  payload.dateClosed = new Date(0);
  payload.dateAdded = now;
  payload.dateUpdated = now;
  payload.activeStatus = true;
  return payload;
};

const insertAccount = async (payload: Account): Promise<any> => {
  let endpoint = "/account/insert";
  let newPayload = setupNewAccount(payload);

  const response = await axios.post(endpoint, newPayload, {
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuth(),
    },
  });
  return response.data;
};

export default function useAccountInsert() {
  const queryClient = useQueryClient();

  return useMutation(
    ["insertAccount"],
    (variables: any) => insertAccount(variables.payload),
    {
      onError: (error: AxiosError) => {
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
        let oldData: any = queryClient.getQueryData("account");
        let newData = [response, ...oldData];
        queryClient.setQueryData("account", newData);
      },
    },
  );
}

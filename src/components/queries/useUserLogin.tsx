import { basicAuth, endpointUrl } from "../Common";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import User from "../model/User";

const userLogin = async (payload: User): Promise<any> => {
  let endpoint = endpointUrl() + "/user/signin/";

  const response = await axios.post(endpoint, payload, {
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuth(),
    },
  });
  return response.data;
};

export default function useUserLogin() {
  const queryClient = useQueryClient();

  return useMutation(
    ["userLogin"],
    (variables: any) => userLogin(variables.payload),
    {
      onError: (error: AxiosError) => {
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

      onSuccess: (response) => {
        let oldData: any = queryClient.getQueryData("user");
        let newData = [response, ...oldData];
        queryClient.setQueryData("user", newData);
      },
    }
  );
}

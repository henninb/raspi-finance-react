import axios, { AxiosError } from "axios";
import { basicAuth } from "../Common";
import { useQuery } from "react-query";

//interfaces in a models dir

const fetchAccountData = async (accountNameOwner: String): Promise<any> => {
  const response = await axios.get(
    `/transaction/account/select/${accountNameOwner}`,
    {
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: basicAuth(),
      },
    },
  );
  // console.log(JSON.stringify(response.data));
  return response.data;
};

export default function useFetchTransactionByAccount(accountNameOwner: String) {
  return useQuery(
    ["accounts", accountNameOwner],
    () => fetchAccountData(accountNameOwner),
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
    },
  );
}

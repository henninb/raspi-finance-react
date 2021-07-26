import { basicAuth, endpointUrl } from "../Common";
import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";

const fetchTotalsPerAccount = async (accountNameOwner: any): Promise<any> => {
  const response = await axios.get(
    endpointUrl() + "/transaction/account/totals/" + accountNameOwner,
    {
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: basicAuth(),
      },
    }
  );
  console.debug(JSON.stringify(response.data));
  return response.data;
};

export default function useFetchTotalsPerAccount(accountNameOwner: any) {
  return useQuery(
    ["totals", accountNameOwner],
    () => fetchTotalsPerAccount(accountNameOwner),
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
    }
  );
}

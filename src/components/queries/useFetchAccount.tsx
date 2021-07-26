import axios, { AxiosError } from "axios";
import { basicAuth, endpointUrl } from "../Common";
import { useQuery } from "react-query";

const fetchAccountData = async (): Promise<any> => {
  const response = await axios.get(endpointUrl() + "/account/select/active", {
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: basicAuth(),
    },
  });
  console.debug(JSON.stringify(response.data));
  return response.data;
};

export default function useFetchAccount() {
  return useQuery("account", () => fetchAccountData(), {
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
  });
}

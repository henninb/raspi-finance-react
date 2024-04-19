import axios, { AxiosError } from "axios";
import { basicAuth } from "../Common";
import { useQuery } from "react-query";

const fetchValidationAmountData = async (
  accountNameOwner: String,
): Promise<any> => {
  const response = await axios.get(
    `/validation/amount/select/${accountNameOwner}/cleared`,
    {
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: basicAuth(),
      },
    },
  );
  //console.debug(JSON.stringify(response.data));
  return response.data;
};

export default function useFetchValidationAmount(accountNameOwner: String) {
  return useQuery(
    ["validationAmount", accountNameOwner],
    () => fetchValidationAmountData(accountNameOwner),
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

import axios, { AxiosError } from "axios";
import { endpointUrl } from "../Common";
import { useQuery } from "react-query";

const fetchPaymentData = async (): Promise<any> => {
  const response = await axios.get(endpointUrl() + "/payment/select", {
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  console.debug(JSON.stringify(response.data));
  return response.data;
};

export default function useFetchPayment() {
  return useQuery("payment", () => fetchPaymentData(), {
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
  });
}

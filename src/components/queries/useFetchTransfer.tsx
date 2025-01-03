import axios, { AxiosError } from "axios";
import { basicAuth } from "../Common";
import { useQuery } from "react-query";

const fetchTransferData = async (): Promise<any> => {
  const response = await axios.get("/transfer/select", {
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: basicAuth(),
    },
  });
  //console.debug(JSON.stringify(response.data));
  return response.data;
};

export default function useFetchTransfer() {
  return useQuery("transfer", () => fetchTransferData(), {
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
  });
}

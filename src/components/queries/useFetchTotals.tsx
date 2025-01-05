import { basicAuth } from "../Common";
import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";

const fetchTotals = async (): Promise<any> => {
  const response = await axios.get("/api/account/totals", {
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

export default function useFetchTotals() {
  return useQuery(["all_totals"], () => fetchTotals(), {
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
  });
}

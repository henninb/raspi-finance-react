import axios, { AxiosError } from "axios";
import { endpointUrl } from "../Common";
import { useQuery } from "react-query";

const fetchCategoryData = async (): Promise<any> => {
  const response = await axios.get(endpointUrl() + "/category/select/active", {
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  console.debug(JSON.stringify(response.data));
  return response.data;
};

export default function useFetchCategory() {
  return useQuery("category", () => fetchCategoryData(), {
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

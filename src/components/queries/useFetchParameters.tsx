import axios, { AxiosError } from "axios";
import { basicAuth, endpointUrl } from "../Common";
import { useQuery } from "react-query";

// wget http://hornsup:8443/parm/select/active
const fetchParameterData = async (): Promise<any> => {
  const response = await axios.get(endpointUrl() + "/parm/select/active", {
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: basicAuth(),
    },
  });
  console.log(JSON.stringify(response.data))
  return response.data;
};

export default function useFetchParameter() {
  return useQuery("parameter", () => fetchParameterData(), {
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

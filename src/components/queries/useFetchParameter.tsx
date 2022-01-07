import axios, { AxiosError } from "axios";
import { basicAuth, endpointUrl } from "../Common";
import { useQuery } from "react-query";

const fetchParameterData = async (parameterName: any): Promise<any> => {
  const response = await axios.get(
    endpointUrl() + "/parm/select/" + parameterName,
    {
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: basicAuth(),
      },
    }
  );
  //console.debug(JSON.stringify(response.data));
  return response.data;
};

export default function useFetchParameter(parameterName: any) {
  return useQuery(
    ["parameter", parameterName],
    () => fetchParameterData(parameterName),
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

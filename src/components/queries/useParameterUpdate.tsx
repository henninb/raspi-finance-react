import axios, { AxiosError } from "axios";
import { basicAuth, endpointUrl } from "../Common";
import { useMutation, useQueryClient } from "react-query";
import Parameter from "../model/Parameter";

const updateParameter = async (
  newData: Parameter,
  oldData: Parameter
): Promise<any> => {
  let endpoint = endpointUrl() + "/parm/update/" + oldData.parameterName;

  console.log(newData);
  const response = await axios.put(endpoint, newData, {
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: basicAuth(),
    },
  });
  return response.data;
};

export default function useParameterUpdate() {
  const queryClient = useQueryClient();

  return useMutation(
    ["updateParameter"],
    (variables: any) => updateParameter(variables.newRow, variables.oldRow),
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

      onSuccess: (response, variables) => {},
    }
  );
}
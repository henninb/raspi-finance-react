import { basicAuth, endpointUrl } from "../Common";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";

const deleteParameter = async (payload: any): Promise<any> => {
  let endpoint = endpointUrl() + "/parm/delete/" + payload.parameterName;

  const response = await axios.delete(endpoint, {
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuth(),
    },
  });
  return response.data;
};

export default function useParameterDelete() {
  const queryClient = useQueryClient();

  return useMutation(
    ["deleteParameter"],
    (variables: any) => deleteParameter(variables.oldRow),
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

      onSuccess: (response, variables) => {
        let oldData: any = queryClient.getQueryData("parameter");
        console.log('delete was a success.')
        //let oldData: any = queryClient.getQueryData("parameter");
        let newData = oldData.filter(
          (t: any) => t.parameterName !== variables.oldRow.parameterName
        );
        queryClient.setQueryData("parameter", newData);
      },
    }
  );
}

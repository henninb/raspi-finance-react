import axios, { AxiosError } from "axios";
import {endpointUrl, typeOf} from "../Common";
import { useQuery } from "react-query";

//import {ApolloClient, InM} from "apollo/client";

const fetchDescriptionData = async (): Promise<any> => {
  const query = "{\"query\":\"query{descriptions {  description }}\"}"
  const response = await axios.post(endpointUrl() + "/graphql", query, {
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  console.log("*******")
  console.log(JSON.stringify(response.data ? response.data : "{}"));
  console.log("*******")
  console.log(typeOf(response.data))
  console.log(JSON.stringify(response.data ? response.data : "{}"));
  return response.data;
};

export default function useGraphqlFetchDescription() {
  return useQuery("description", () => fetchDescriptionData(), {
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

import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
//import { gql } from "@apollo/client";
//import { ApolloError } from "apollo-client";
//import { apolloClient } from "../ApolloClient";
import { basicAuth } from "../Common";

// const query = gql`
//   query {
//     descriptions {
//       descriptionName
//     }
//   }
// `;

// const graphqlDescriptionData = async () => {
//   const client = apolloClient();
//   const { data } = await client.query({ query });
//   console.log("fetching descriptions");
//   return data.descriptions;
// };

const fetchDescriptionData = async (): Promise<any> => {
  const response = await axios.get("/description/select/all", {
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

// export default function useFetchDescription() {
//   return useQuery("description", () => fetchDescriptionData(), {
//     onError: (error: ApolloError) => {
//       console.log("graphql error with description");
//       //console.log(error ? error : "error is undefined.");
//     },
//   });
// }

export default function useFetchDescription() {
  return useQuery("description", () => fetchDescriptionData(), {
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

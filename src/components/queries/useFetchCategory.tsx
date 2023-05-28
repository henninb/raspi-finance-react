import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
//import { gql } from "@apollo/client";
//import { ApolloError } from "apollo-client";
//import { apolloClient } from "../ApolloClient";
import { basicAuth } from "../Common";

// const query = gql`
//   query {
//     categories {
//       categoryName
//     }
//   }
// `;

// const graphqlCategoryData = async () => {
//   const client = apolloClient();
//   const { data } = await client.query({ query });
//   console.log("fetching categories");
//   return data.categories;
// };

const fetchCategoryData = async (): Promise<any> => {
  const response = await axios.get("/category/select/active", {
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

// export default function useFetchCategory() {
//   return useQuery("category", () => fetchCategoryData(), {
//     onError: (error: ApolloError) => {
//       console.log("graphql error with category");
//       //console.log(error ? error : "error is undefined.");
//     },
//   });
// }

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

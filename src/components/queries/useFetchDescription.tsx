//import { client } from "../Common";
import { useQuery } from "react-query";
import { gql } from "@apollo/client";
import { ApolloError } from "apollo-client";
import { apolloClient } from "../ApolloClient";

const query = gql`
  query {
    descriptions {
      descriptionName
    }
  }
`;

const fetchDescriptionData = async () => {
  const client = apolloClient();
  const { data } = await client.query({ query });
  console.log("fetching descriptions");
  return data.descriptions;
};

export default function useFetchDescription() {
  return useQuery("description", () => fetchDescriptionData(), {
    onError: (error: ApolloError) => {
      console.log("graphql error with description");
      //console.log(error ? error : "error is undefined.");
    },
  });
}

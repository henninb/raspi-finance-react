import { endpointUrl } from "../Common";
import { useQuery } from "react-query";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { ApolloError } from "apollo-client";

const client = new ApolloClient({
  uri: endpointUrl() + "/graphql",
  cache: new InMemoryCache(),
});

const query = gql`
  query {
    descriptions {
      description
    }
  }
`;

const fetchDescriptionData = async () => {
  const { data } = await client.query({ query });
  return data.descriptions;
};

export default function useGraphqlFetchDescription() {
  return useQuery("description", () => fetchDescriptionData(), {
    onError: (error: ApolloError) => {
      console.log(error ? error : "error is undefined.");
    },
  });
}

import { client } from "../Common";
import { useQuery } from "react-query";
import { gql } from "@apollo/client";
import { ApolloError } from "apollo-client";

const query = gql`
  query {
    descriptions {
      description
    }
  }
`;

const fetchDescriptionData = async () => {
  const { data } = await client.query({ query });
  console.log("fetching descriptions");
  return data.descriptions;
};

export default function useFetchDescription() {
  return useQuery("description", () => fetchDescriptionData(), {
    onError: (error: ApolloError) => {
      console.log(error ? error : "error is undefined.");
    },
  });
}

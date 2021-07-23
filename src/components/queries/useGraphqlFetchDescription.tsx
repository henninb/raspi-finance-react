import axios, { AxiosError } from "axios";
import { endpointUrl } from "../Common";
//import { useQuery } from "react-query";
// import gql from "graphql-tag";

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql
} from "@apollo/client";

const client = new ApolloClient({
    uri: endpointUrl() + "/graphql",
    cache: new InMemoryCache()
});

// import { ApolloProvider } from "react-apollo";
// import { ApolloClient } from "apollo-client";
// import { Query } from "react-apollo";

//import { HttpLink } from 'apollo-link-http';
//import { InMemoryCache } from 'apollo-cache-inmemory';

const query = gql`
  query {
    descriptions {
      description
    }
  }
`;

const fetchDescriptionData = async (): Promise<any> => {
    let response = client.query({
        query: query
    })
    //.then(result => console.log(result));
    return response
  };


export default function useGraphqlFetchDescription() {
  return useQuery(query);
}

import axios, { AxiosError } from "axios";
import { endpointUrl } from "../Common";
import { useQuery } from "react-query";
import gql from "graphql-tag";

import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { Query } from "react-apollo";

//import { HttpLink } from 'apollo-link-http';
//import { InMemoryCache } from 'apollo-cache-inmemory';

const query1 = gql`
  query {
    descriptions {
      description
    }
  }
`;

const fetchDescriptionData = async (): Promise<any> => {
  // <Query query={query1} >
  //   {/*{({ data: { organization }, loading }) => {*/}
  //   {/*  if (loading || !organization) {*/}
  //   {/*    return <div>Loading ...</div>;*/}
  //   {/*  }*/}
  //
  //   {/*  return (*/}
  //   {/*      <RepositoryList repositories={organization.repositories} />*/}
  //   {/*  );*/}
  //   {/*}}*/}
  //   return (<div>test</div>
  //   )
  // </Query>

  const query = '{"query":"query{descriptions {  description }}"}';
  const response = await axios.post(endpointUrl() + "/graphql", query, {
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

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

import {ApolloClient, InMemoryCache, createHttpLink, from, HttpLink} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { NormalizedCacheObject } from "@apollo/client/core";
import { basicAuth, endpointUrl } from "./Common";
import {onError} from "@apollo/client/link/error";

export const apolloClient = (): ApolloClient<NormalizedCacheObject> => {

  const errorLink = onError(({ graphqlErrors, networkError } :any) => {
    if (graphqlErrors) {
      graphqlErrors.map(({ message, location, path } : any) => {
        alert(`Graphql error ${message}`);
      });
    }
  });

  const link = from([
    errorLink,
    new HttpLink({ uri: `${endpointUrl()}/graphql` }),
  ]);

  // const client = new ApolloClient({
  //   cache: new InMemoryCache(),
  //   link: link,
  // });


  const httpLink = createHttpLink({
    uri: `${endpointUrl()}/graphql`,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        //authorization: `Basic ${btoa("user:password")}`,
        authorization: `${basicAuth()}`,
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(link),
  });
};

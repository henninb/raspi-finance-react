import { ApolloClient, InMemoryCache, from, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { NormalizedCacheObject } from "@apollo/client/core";
import { basicAuth } from "./Common";
import { onError } from "@apollo/client/link/error";

export const apolloClient = (): ApolloClient<NormalizedCacheObject> => {
  const errorLink = onError(({ graphqlErrors, networkError }: any) => {
    if (graphqlErrors) {
      graphqlErrors.map(({ message, location, path }: any) =>
        console.log(`Graphql error ${message}`),
      );
    }
  });

  const link = from([errorLink, new HttpLink({ uri: `/graphql` })]);

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

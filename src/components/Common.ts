import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

export const convertUTCDateToLocalDate = (date: any) => {
  let newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  let offset = date.getTimezoneOffset() / 60;
  let hours = date.getHours();

  newDate.setHours(hours - offset);
  return newDate;
};

export const formatDate = (date: Date) => {
  let month = "" + (date.getMonth() + 1);
  let day = "" + date.getDate();
  let year = date.getFullYear();

  month = ("0" + month).slice(-2);
  day = ("0" + day).slice(-2);

  return [year, month, day].join("-");
};

export const fetchTimeZone = () => {
  return process.env.REACT_APP_TIMEZONE;
};

export const currencyFormat = (inputData: string) => {
  inputData = parseFloat(inputData).toFixed(2);
  return inputData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const epochToDate = (epoch: number): Date => {
  return new Date(epoch); // The 0 there is the key, which sets the date to the epoch
  //return new Date(0)
};

export const basicAuth = () => {
  let token = process.env.REACT_APP_API_KEY;
  return "Basic " + token;
};

export const endpointUrl = () => {
  let port = process.env.REACT_APP_ENDPOINT_PORT;
  let server = process.env.REACT_APP_ENDPOINT_SERVER;
  let httpEnabled = process.env.REACT_APP_ENDPOINT_SSL_ENABLED;

  if (httpEnabled === "true") {
    return "https://" + server + ":" + port;
  }
  return "http://" + server + ":" + port;
};

export const typeOf = (obj: any) => {
  return {}.toString.call(obj).split(" ")[1].slice(0, -1).toLowerCase();
};

export const noNaN = (n: any) => {
  return isNaN(n) ? 0.0 : n;
};

export const capitalizeFirstChar = (inString: String) => {
  return inString.charAt(0).toUpperCase() + inString.slice(1);
};

export function isFloat(n: number) {
  return Number(n) === n && n % 1 !== 0;
}

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      // authorization: localStorage.getItem('token') || null,
      authorization: basicAuth(),
    },
  }));

  return forward(operation);
});

const httpLink = new HttpLink({ uri: endpointUrl() + "/graphql" });

const middlewareAuthLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: basicAuth(),
    },
  });
  return forward(operation);
});

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);

const authLink = new ApolloLink((operation, forward): any => {
  // if (isLoggedIn()) {
  // passing props object to be use in the request
  operation.setContext({
    // setting http headers
    // We are setting Request Header in operation context to use in http request
    headers: {
      authorization: basicAuth(),
    },
  });
});

export const client = new ApolloClient({
  // link: ApolloLink.from([
  //   // authLink code will be executed first & then HttpLink to make request
  //   // By adding authLink before, we are 'preparing request' for setting Authorization Header before it gets sent
  //   authLink,
  //   new HttpLink({ uri: endpointUrl() + "/graphql" }),
  // ]),
  //link: httpLinkWithAuthToken,
    uri: endpointUrl() + "/graphql",
    cache: new InMemoryCache(),
    //credentials: 'include',
    headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth(),
      //Authorization: basicAuth(),
    },
});

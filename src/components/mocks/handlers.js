import { rest } from "msw";
import { basicAuth, endpointUrl } from "../Common";

export const handlers = [
  rest.get("https://hornsup:8443/payment/select", (req, res, ctx) => {
    return res(
      ctx.json([
      {"paymentId":1001,
      "accountNameOwner":"boa-cash_brian",
      "transactionDate":"2022-01-04",
      "amount":0.46,
      "guidSource":"c3018078-2a77-488f-bec9-837faee0c83b",
      "guidDestination":"6d5cd6d7-968a-4064-97bf-f2ad1083efe7",
      "activeStatus":true}
      ])
    );
  }),

    rest.get("https://hornsup:8443/parm/select/payment_account", (req, res, ctx) => {
      return res(
        ctx.json(
        {"parameterId":1,"parameterName":"payment_account","parameterValue":"bcu-checking_brian","activeStatus":true})
      );
    }),

//    rest.get('/payment/select', null),
//    rest.get('/parm/select/payment_account', null),
];

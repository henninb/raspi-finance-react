import { rest } from "msw";
import { basicAuth } from "../Common";

export const handlers = [
  rest.get("https://hornsup:8443/payment/select", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          paymentId: 1001,
          accountNameOwner: "boa-cash_brian",
          transactionDate: "2022-01-04",
          amount: 0.46,
          guidSource: "c3018078-2a77-488f-bec9-837faee0c83b",
          guidDestination: "6d5cd6d7-968a-4064-97bf-f2ad1083efe7",
          activeStatus: true,
        },
      ]),
    );
  }),

  rest.get(
    "https://hornsup:8443/parm/select/payment_account",
    (req, res, ctx) => {
      return res(
        ctx.json({
          parameterId: 1,
          parameterName: "payment_account",
          parameterValue: "bcu-checking_brian",
          activeStatus: true,
        }),
      );
    },
  ),

  rest.get(
    "https://hornsup:8443/transaction/payment/required",
    (req, res, ctx) => {
      return res(
        ctx.json([
          {
            accountId: 1001,
            accountNameOwner: "amex_brian",
            accountType: "credit",
            activeStatus: true,
            moniker: "0000",
            outstanding: 0.0,
            future: 176.71,
            cleared: 0.0,
            dateClosed: "1970-01-01T00:00:00.000-06:00",
          },
        ]),
      );
    },
  ),

  rest.get("https://hornsup:8443/account/select/active", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          accountId: 1001,
          accountNameOwner: "test_brian",
          accountType: "credit",
          activeStatus: true,
          moniker: "0000",
          outstanding: 0.0,
          future: 0.0,
          cleared: 0.0,
          dateClosed: "1970-01-01T00:00:00.000-06:00",
        },
      ]),
    );
  }),
];

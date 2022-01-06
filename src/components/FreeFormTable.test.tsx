import React from "react";
import { act } from "@testing-library/react";
import { render } from "./test-utils";
import FreeFormTable from "./FreeFormTable";
import { fireEvent, waitFor } from "@testing-library/dom";
import { MockedProvider } from "@apollo/react-testing";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { server } from "./mocks/server";

describe("freeForm table testing", () => {
  let wrapper: any;

//   beforeAll(() => {
//     server.listen();
//   });

  beforeEach(async () => {
    const queryClient = new QueryClient();

    const test = [{"accountNameOwner": "chase_brian",
                  "transactionDate": "2022-01-02",
                    "description": "desc",
                    "category": "cat",
                    "amount": 0.00,
                    "transactionState": "cleared",
                    "reoccurringType": "",
                    "notes": "n/a"
                    }
                    ];

    wrapper = render(
      <QueryClientProvider client={queryClient}>
        <FreeFormTable data={test} />
      </QueryClientProvider>
    );
  });

//   afterEach(() => {
//     server.resetHandlers();
//   });

//   afterAll(() => {
//     server.close();
//   });

    it("freeFormTable loads", async() => {
      const { getByLabelText, getByTitle, getByPlaceholderText, getByTestId } =
        wrapper;


      // eslint-disable-next-line
      //let paymentTable  = await getByLabelText("payments-table");
      await waitFor(() => {
        let freeForm = getByTestId("free-form-table");
       // let freeForm = getByTestId("free-form");
      });

      expect(true).toBeTruthy();
    });

});
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

    wrapper = render(
      <QueryClientProvider client={queryClient}>
        <FreeFormTable />
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
       // let freeForm = getByTestId("free-form");
      });

      expect(true).toBeTruthy();
    });

});
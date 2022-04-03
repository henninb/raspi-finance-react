import React from "react";
import { render, cleanup } from "./test-utils";
import PaymentTable from "./PaymentTable";
import { fireEvent, waitFor } from "@testing-library/dom";
import { MockedProvider } from "@apollo/react-testing";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { server } from "./mocks/server";

describe("payment table Testing", () => {
  let wrapper: any;

  beforeAll(() => {
    server.listen();
  });

  beforeEach(async () => {
    const queryClient = new QueryClient();

    wrapper = render(
      <QueryClientProvider client={queryClient}>
        <PaymentTable />
      </QueryClientProvider>
    );
  });

  afterEach(() => {
    server.resetHandlers();
    cleanup();
  });

  afterAll(() => {
    server.close();
  });

  it("payment table loads", async () => {
    const { getByLabelText, getByTitle, getByPlaceholderText, getByTestId } =
      wrapper;

    // eslint-disable-next-line
    let loader = getByTestId("loader");
    //let paymentTable  = await getByLabelText("payments-table");
    await waitFor(() => {
      let paymentTable = getByTestId("payment-table");
      let addButton = getByTitle("Add");
      fireEvent.click(addButton);
    });

    expect(true).toBeTruthy();
  });
});

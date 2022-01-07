import React from "react";
import { render } from "./test-utils";
import PaymentRequired from "./PaymentRequired";
import { fireEvent, waitFor } from "@testing-library/dom";
import { MockedProvider } from "@apollo/react-testing";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { server } from "./mocks/server";

describe("payment required table testing", () => {
  let wrapper: any;

  beforeAll(() => {
    server.listen();
  });

  beforeEach(async () => {
    const queryClient = new QueryClient();

    wrapper = render(
      <QueryClientProvider client={queryClient}>
        <PaymentRequired />
      </QueryClientProvider>
    );
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it("payment required table loads", async () => {
    const { getByLabelText, getByTitle, getByPlaceholderText, getByTestId } =
      wrapper;

    await waitFor(() => {
      let freeForm = getByTestId("payment-required-table");
    });

    expect(true).toBeTruthy();
  });
});

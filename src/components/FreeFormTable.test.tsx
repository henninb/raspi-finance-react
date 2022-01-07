import React from "react";
import { render, cleanup } from "./test-utils";
import FreeFormTable from "./FreeFormTable";
import { fireEvent, waitFor } from "@testing-library/dom";
import { MockedProvider } from "@apollo/react-testing";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { server } from "./mocks/server";

describe("freeForm table testing", () => {
  let wrapper: any;

  const data = [
    {
      accountNameOwner: "chase_brian",
      transactionDate: "2022-01-02",
      description: "desc",
      category: "cat",
      amount: 0.0,
      transactionState: "cleared",
      reoccurringType: "",
      notes: "n/a",
    },
  ];

  //   beforeAll(() => {
  //     server.listen();
  //   });

  beforeEach(async () => {
    const queryClient = new QueryClient();

    wrapper = render(
      <QueryClientProvider client={queryClient}>
        <FreeFormTable data={data} />
      </QueryClientProvider>
    );
  });

    afterEach(() => {
      //server.resetHandlers();
      cleanup();
    });

  //   afterAll(() => {
  //     server.close();
  //   });

  it("freeFormTable loads", async () => {
    const { getByLabelText, getByTitle, getByPlaceholderText, getByTestId } =
      wrapper;

    await waitFor(() => {
      let freeForm = getByTestId("free-form-table");
    });

    expect(true).toBeTruthy();
  });
});

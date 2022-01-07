import React from "react";
import { render, cleanup } from "./test-utils";
import SelectAccountNameOwnerCredit from "./SelectAccountNameOwnerCredit";
import { fireEvent, waitFor } from "@testing-library/dom";
import { MockedProvider } from "@apollo/react-testing";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { server } from "./mocks/server";

describe("select accountNameOwner credit testing", () => {
  let wrapper: any;

  beforeAll(() => {
    server.listen();
  });

  beforeEach(async () => {
    const queryClient = new QueryClient();

    wrapper = render(
      <QueryClientProvider client={queryClient}>
        <SelectAccountNameOwnerCredit />
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

  it("select accountNameOwner credit loads", async () => {
    const { getByLabelText, getByTitle, getByPlaceholderText, getByTestId } =
      wrapper;

    await waitFor(() => {
      let freeForm = getByTestId("accounts-credit");
    });

    expect(true).toBeTruthy();
  });
});

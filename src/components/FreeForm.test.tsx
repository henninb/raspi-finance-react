import React from "react";
import { render, cleanup } from "./test-utils";
import FreeForm from "./FreeForm";
import { fireEvent, waitFor } from "@testing-library/dom";
import { MockedProvider } from "@apollo/react-testing";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { server } from "./mocks/server";

describe("freeForm testing", () => {
  let wrapper: any;

  //   beforeAll(() => {
  //     server.listen();
  //   });

  beforeEach(async () => {
    const queryClient = new QueryClient();

    wrapper = render(
      <QueryClientProvider client={queryClient}>
        <FreeForm />
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

  it("freeForm loads", async () => {
    const { getByLabelText, getByTitle, getByPlaceholderText, getByTestId } =
      wrapper;

    await waitFor(() => {
      let freeForm = getByTestId("free-form");
    });

    expect(true).toBeTruthy();
  });
});

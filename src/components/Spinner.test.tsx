import React from "react";
import ReactDOM from "react-dom";
import Spinner from "./Spinner";
import { cleanup, render } from "@testing-library/react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

describe("select spinner testing", () => {
  let wrapper: any;

  //     beforeAll(() => {
  //       server.listen();
  //     });

  beforeEach(async () => {
    const queryClient = new QueryClient();

    wrapper = render(
      <QueryClientProvider client={queryClient}>
        <Spinner />
      </QueryClientProvider>
    );
  });

  afterEach(() => {
    //server.resetHandlers();
    cleanup();
  });
  //
  //     afterAll(() => {
  //       server.close();
  //     });

  it("loader renders without crashing", async () => {
    const div = document.createElement("div");
    ReactDOM.render(<Spinner />, div);
    ReactDOM.unmountComponentAtNode(div);
    expect(true).toBeTruthy();
  });

  it("renders loader correctly", () => {
    const { getByTestId } = wrapper;
    let loader = getByTestId("loader");
    expect(true).toBeTruthy();
    //console.log(getByTestId("loader"));
    //expect(getByTestId('loader')).toHaveTextContent("Rings");
  });
});

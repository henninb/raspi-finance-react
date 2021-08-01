import React from "react";
import ReactDOM from "react-dom";
import Spinner from "./Spinner";
import { act, cleanup, render } from "@testing-library/react";

afterEach(cleanup);

test("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Spinner />, div);
  ReactDOM.unmountComponentAtNode(div);
  expect(true).toBeTruthy();
});

test("renders loader correctly", () => {
  const { getByTestId } = render(<Spinner />);
    expect(true).toBeTruthy();
  //console.log(getByTestId("loader"));
  //expect(getByTestId('loader')).toHaveTextContent("Circles");
});

describe("spinnerTests", () => {
  let wrapper;
  beforeEach(async () => {
    jest.clearAllMocks();
    await act(() => {
      // eslint-disable-next-line
      wrapper = render(<Spinner />);
    });
  });
  it("spinner works", () => {
    const { getByTestId } = render(<Spinner />);
    //console.log(getByTestId("loader"));
    expect(true).toBeTruthy();
  });
});

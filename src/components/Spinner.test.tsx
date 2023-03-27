import { render, screen } from "@testing-library/react";
import React from "react";
import Spinner from "./Spinner";
import "@testing-library/jest-dom";

describe("Spinner component", () => {
  it("should render a spinner", () => {
    render(<Spinner />);
    const spinnerElement = screen.getByTestId("loader");
    expect(spinnerElement).toBeInTheDocument();
  });
});

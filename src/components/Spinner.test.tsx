import { render, screen } from "@testing-library/react";
import React from "react";
import Spinner from "./Spinner";
// import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";

// Define a mock localStorage object
// const localStorageMock = (() => {
//   let store: Record<string, string> = {};
//   return {
//     getItem: (key: string) => store[key],
//     setItem: (key: string, value: string) => {
//       store[key] = value.toString();
//     },
//     clear: () => {
//       store = {};
//     },
//     removeItem: (key: string) => {
//       delete store[key];
//     },
//   };
// })();

// Set localStorageMock as a global variable before running the tests
// beforeAll(() => {
//   Object.defineProperty(window, 'localStorage', { value: localStorageMock });
// });

describe("Spinner component", () => {
  it("should render a spinner", () => {
    render(<Spinner />);
    const spinnerElement = screen.getByTestId("loader");
    expect(spinnerElement).toBeInTheDocument();
  });
});

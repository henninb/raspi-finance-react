import { act, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
//import userEvent from "@testing-library/user-event";
import FreeForm from "./FreeForm";
import "@testing-library/jest-dom";
// import { act } from "react-dom/test-utils";

describe("FreeForm", () => {
  it("should render the component", async () => {
    await act(async () => {
      const queryClient = new QueryClient();
      render(
        <QueryClientProvider client={queryClient}>
          <FreeForm />
        </QueryClientProvider>,
      );
      await Promise.resolve();
    });
    const freeFormElement = screen.getByTestId("free-form");
    expect(freeFormElement).toBeInTheDocument();
  });
});

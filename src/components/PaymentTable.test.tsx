// import { render, screen } from "@testing-library/react";
import { render, screen, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import PaymentTable from "./PaymentTable";
import "@testing-library/jest-dom";

describe("PaymentTable", () => {
  test("renders home page", async () => {
    const queryClient = new QueryClient();

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={["/"]}>
            <PaymentTable />
          </MemoryRouter>
        </QueryClientProvider>
      );
      await Promise.resolve();
    });

    //const heading = await screen.findByRole('heading', { name: /home/i });
    // expect(heading).toBeInTheDocument();
  });
});

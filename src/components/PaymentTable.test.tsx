import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import PaymentTable from "./PaymentTable";

describe("PaymentTable", () => {
  test("renders home page", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/"]}>
          <PaymentTable />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // const heading = await screen.findByRole('heading', { name: /home/i });
    // expect(heading).toBeInTheDocument();
  });
});

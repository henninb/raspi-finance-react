import React from "react";
import { render, screen, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import FreeFormTable from "./FreeFormTable";
import '@testing-library/jest-dom';

describe("FreeFormTable", () => {
  const data = [
    {
      accountNameOwner: "test",
      transactionDate: new Date().toISOString(),
      description: "test",
      category: "test",
      amount: 100,
      transactionState: "test",
      reoccurringType: "test",
      notes: "test",
      dueDate: new Date().toISOString(),
    },
  ];

  it("renders a data grid", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <FreeFormTable data={data} toggleDisplayList={() => {}} />
        </QueryClientProvider>
      );
    await Promise.resolve();
    });

    expect(screen.getByTestId('free-form-table')).toBeInTheDocument();
  });
});

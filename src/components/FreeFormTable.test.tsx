import React from "react";
import { render, screen, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { rest } from "msw";
// import { setupServer } from 'msw/node';
import FreeFormTable from "./FreeFormTable";

// const server = setupServer(
//   rest.post('/api/transactions', (req, res, ctx) => {
//     return res(ctx.status(200), ctx.json({}));
//   })
// );
//
// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

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

    // expect(screen.getByTestId('free-form-table')).toBeInTheDocument();
  });

  // it("submits data and calls toggleDisplayList", async () => {
  //   const toggleDisplayList = jest.fn();
  //   const queryClient = new QueryClient({
  //     defaultOptions: { queries: { retry: false } },
  //   });
  //   const { container } = render(
  //     <QueryClientProvider client={queryClient}>
  //       <FreeFormTable data={data} toggleDisplayList={toggleDisplayList} />
  //     </QueryClientProvider>
  //   );
  //
  //   const submitButton = container.querySelector(
  //     'input[type="submit"]'
  //   ) as HTMLInputElement;
  //   act(() => {
  //     submitButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  //   });
  //
  //   expect(toggleDisplayList).toHaveBeenCalled();
  // });
});

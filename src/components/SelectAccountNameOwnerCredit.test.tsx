import { render, screen, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import SelectAccountNameOwnerCredit, {
  Props,
} from "./SelectAccountNameOwnerCredit";
import "@testing-library/jest-dom";

describe("SelectAccountNameOwnerCredit", () => {
  const onChangeFunctionMock = jest.fn();
  const currentValueMock = "testValue";

  const props: Props = {
    onChangeFunction: onChangeFunctionMock,
    currentValue: currentValueMock,
  };

  it("renders the SelectAccountNameOwnerCredit component", async () => {
    const queryClient = new QueryClient();
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <SelectAccountNameOwnerCredit {...props} />
        </QueryClientProvider>,
      );
      await Promise.resolve();
    });
  });

  it("calls onChangeFunctionMock with the selected value", async () => {
    const queryClient = new QueryClient();
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <SelectAccountNameOwnerCredit {...props} />
        </QueryClientProvider>,
      );
      await Promise.resolve();
    });
  });
});

import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import SelectAccountNameOwnerCredit, {
  Props,
} from "./SelectAccountNameOwnerCredit";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";

describe("SelectAccountNameOwnerCredit", () => {
  const onChangeFunctionMock = jest.fn();
  const currentValueMock = "testValue";

  const props: Props = {
    onChangeFunction: onChangeFunctionMock,
    currentValue: currentValueMock,
  };

  it("renders the SelectAccountNameOwnerCredit component", () => {
    const queryClient = new QueryClient();
    act(() => {
      render(
        <QueryClientProvider client={queryClient}>
          <SelectAccountNameOwnerCredit {...props} />
        </QueryClientProvider>
      );
    });
  });

  it("calls onChangeFunctionMock with the selected value", () => {
    const queryClient = new QueryClient();
    act(() => {
      render(
        <QueryClientProvider client={queryClient}>
          <SelectAccountNameOwnerCredit {...props} />
        </QueryClientProvider>
      );
    });
  });
});

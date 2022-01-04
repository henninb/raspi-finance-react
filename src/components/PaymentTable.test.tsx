import React from "react";
import { act } from "@testing-library/react";
import { render } from "./test-utils";
import PaymentTable from "./PaymentTable";
import { fireEvent } from "@testing-library/dom";
import { MockedProvider } from '@apollo/react-testing';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const MOCKS = [];

test("dummy test", () => {
  expect(true).toBeTruthy();
});

describe("paymentTableTests", () => {
  let wrapper: any;
  //const {result} = renderHook(() => setLoading(true))

  beforeEach(async () => {
    jest.clearAllMocks();
    await act(() => {
    const queryClient = new QueryClient()

      wrapper = render(
      <QueryClientProvider client={queryClient}>
            <PaymentTable />
            </QueryClientProvider>
      );
    });
  });

  it("test me", () => {
    expect(true).toBeTruthy();
  });


//   it("paymentTable - add a record", () => {
//     //console.log(wrapper);
//     const { getByLabelText, getByTitle, getByPlaceholderText } = wrapper;
//     // eslint-disable-next-line
//     let paymentTable = getByLabelText("payment-table");
//
//     //TODO: set the hook value of loading to true otherwise this will not work
//     let addButton = getByTitle("Add");
//
//     //const {getByLabelText} = render(<PaymentTable/>);
//     console.log(getByLabelText("payment-table"));
//
//     fireEvent.click(addButton);
//     //let transactionDate = getByPlaceholderText("transactionDate");
//     let amount = getByPlaceholderText("amount");
//
//     fireEvent.change(amount, { target: { value: 10 } });
//     //fireEvent.accountNameOwner(amount, {target: {value: 'test_brian'}});
//
//     expect(amount.value).toBe("10");
//   });
});

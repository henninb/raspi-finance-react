import React from 'react';
import {act, render} from "@testing-library/react";
import PaymentTable from "./PaymentTable";
import {fireEvent} from "@testing-library/dom";

//afterEach(cleanup);

describe('paymentTableTests', () => {
    let wrapper;
    beforeEach(async () => {
        jest.clearAllMocks();
        await act(() => {
            wrapper = render(<PaymentTable/>)
        });
    });
    it('renders without crashing', () => {
        //console.log(wrapper);
        const {getByTestId, getByTitle, getByPlaceholderText} = wrapper
        let addButton = getByTitle("Add");

        fireEvent.click(addButton);
        //let transactionDate = getByPlaceholderText("transactionDate");
        let amount = getByPlaceholderText("amount");

        fireEvent.change(amount, {target: {value: 10}});
        //fireEvent.accountNameOwner(amount, {target: {value: 'test_brian'}});
        
        expect(amount.value).toBe("10");
    });
});
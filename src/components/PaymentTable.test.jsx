import React from 'react';
import ReactDOM from 'react-dom';
import Spinner from "./Spinner";
import {render, cleanup,act} from "@testing-library/react";
import MaterialTable from "material-table";
import PaymentTable from "./PaymentTable";
import {fireEvent} from "@testing-library/dom";

//afterEach(cleanup);

describe('paymentTableTests', () => {
    let wrapper;
    beforeEach (async() =>{
        jest.clearAllMocks();
        await act (() => {  wrapper = render(<PaymentTable />) } );
    });
    it ('renders without crashing', () => {
      //console.log(wrapper);
      const {getByTestId, getByTitle, getByPlaceholderText} = wrapper
        let addButton = getByTitle("Add");

        fireEvent.click(addButton);
        let amount = getByPlaceholderText("amount");
        fireEvent.change(amount,{target: {value: 10}})

        //let table = getByTestId("payment-table");
        //console.log(table)
        //table.
      expect(amount.value).toBe("10");

    });
});



// test('renders without crashing', () => {
//     await act (() => { wrapper =  } )
//     //const materialTable = document.createElement("div");
//     render(<PaymentTable />);
//     //ReactDOM.unmountComponentAtNode(div)
//     expect(true).toBeTruthy();
// });
//
// test("renders loader correctly", () => {
//     const {getByTestId} = render(<Spinner type="Circles"/>);
//     console.log(getByTestId('loader'));
//     //expect(getByTestId('loader')).toHaveTextContent("Circles");
// });

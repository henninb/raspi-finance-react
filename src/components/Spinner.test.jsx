import React from 'react';
import ReactDOM from 'react-dom';
import Spinner from "./Spinner";
import {render, cleanup, act} from "@testing-library/react";
import {fireEvent} from "@testing-library/dom";

afterEach(cleanup)

test('renders without crashing', () => {
    const div = document.createElement("div");
    ReactDOM.render(<Spinner type="Circles"/>, div);
    ReactDOM.unmountComponentAtNode(div)
    expect(true).toBeTruthy();
});

test("renders loader correctly", () => {
    const {getByTestId} = render(<Spinner type="Circles"/>);
    console.log(getByTestId('loader'));
    //expect(getByTestId('loader')).toHaveTextContent("Circles");
});



describe('spinnerTests', () => {
    let wrapper;
    beforeEach(async () => {
        jest.clearAllMocks();
        await act(() => {
            wrapper = render(<Spinner type="Circles"/>);
        });
    });
    it('spinner works', () => {
        const {getByTestId} = render(<Spinner type="Circles"/>);
        console.log(getByTestId('loader'));
        expect(true).toBeTruthy();
    });
});
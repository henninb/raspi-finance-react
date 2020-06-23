import React from 'react';
import ReactDOM from 'react-dom';
import Spinner from "./Spinner";
import {render, cleanup} from "@testing-library/react";

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

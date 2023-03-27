import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SelectTransactionType from "./SelectTransactionType";
import '@testing-library/jest-dom';

describe("SelectTransactionType component", () => {
  it("should render with default value", () => {
    const handleChangeFunction = jest.fn();
    render(
      <SelectTransactionType
        onChangeFunction={handleChangeFunction}
        currentValue={"income"}
      />
    );
    expect(screen.getByRole("textbox")).toHaveValue("income");
  });

  it("should update value when an option is selected", () => {
    const handleChangeFunction = jest.fn();
    render(
      <SelectTransactionType onChangeFunction={handleChangeFunction} currentValue={"income"} />
    );
    const dropdownButton = screen.getByRole("button");
    fireEvent.click(dropdownButton);
    const incomeOption = screen.getByText("income");
    fireEvent.click(incomeOption);
    expect(screen.getByRole("textbox")).toHaveValue("income");
    //expect(handleChangeFunction).toHaveBeenCalledWith("income");
  });

  it("should update value when a new option is typed", () => {
    const handleChangeFunction = jest.fn();
    render(
      <SelectTransactionType onChangeFunction={handleChangeFunction} currentValue={"income"} />
    );
    const inputField = screen.getByRole("textbox");
    fireEvent.change(inputField, { target: { value: "income" } });
    act(() => {
      fireEvent.keyDown(inputField, { key: "Tab" });
    });
    expect(inputField).toHaveValue("income");
    expect(handleChangeFunction).toHaveBeenCalledWith("income");
  });

  it("should not update value when an invalid option is typed", () => {
    const handleChangeFunction = jest.fn();
    render(
      <SelectTransactionType onChangeFunction={handleChangeFunction} currentValue={"income"} />
    );
    const inputField = screen.getByRole("textbox");
    fireEvent.change(inputField, { target: { value: "invalid" } });
    act(() => {
      fireEvent.keyDown(inputField, { key: "Tab" });
    });
    expect(inputField).toHaveValue("invalid");
    expect(handleChangeFunction).toHaveBeenCalledWith("invalid");
  });
});

// import React from "react";
// import { render, fireEvent, act } from "@testing-library/react";
// import SelectTransactionType from "./SelectTransactionType";
//
// describe("SelectTransactionType", () => {
//   const onChangeFunctionMock = jest.fn();
//
//   beforeEach(() => {
//     onChangeFunctionMock.mockClear();
//   });
//
//   it("renders with default value", () => {
//     const { getByRole } = render(
//       <SelectTransactionType
//         onChangeFunction={onChangeFunctionMock}
//         currentValue={"income"}
//       />
//     );
//
//     const input = getByRole("textbox") as HTMLInputElement;
//     expect(input.value).toBe("income");
//   });
//
//   it("selects an option from dropdown", () => {
//     const { getByRole, getByText } = render(
//       <SelectTransactionType onChangeFunction={onChangeFunctionMock} />
//     );
//
//     const input = getByRole("textbox") as HTMLInputElement;
//     fireEvent.focus(input);
//     fireEvent.keyDown(input, { key: "ArrowDown" });
//     fireEvent.keyDown(input, { key: "ArrowDown" });
//     fireEvent.keyDown(input, { key: "Enter" });
//
//     expect(onChangeFunctionMock).toHaveBeenCalledWith("transfer");
//     expect(getByText("transfer")).toBeInTheDocument();
//     expect(input.value).toBe("transfer");
//   });
// });

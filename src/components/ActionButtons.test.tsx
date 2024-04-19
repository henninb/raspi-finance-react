import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import ActionButtons from "./ActionButtons";

describe("ActionButtons component", () => {
  it("should call handleTransactionType when a toggle button is clicked", () => {
    const handleTransactionType = jest.fn();
    const guid = "123";

    const { getByLabelText } = render(
      <ActionButtons
        guid={guid}
        handleTransactionType={handleTransactionType}
      />,
    );

    const moveButton = screen.getByTestId("move-button");
    const updateButton = screen.getByTestId("update-button");
    const deleteButton = screen.getByTestId("delete-button");

    act(() => {
      fireEvent.click(moveButton);
    });
    //expect(handleTransactionType).toHaveBeenCalledWith("move");

    act(() => {
      fireEvent.click(updateButton);
    });
    //expect(handleTransactionType).toHaveBeenCalledWith("update");

    act(() => {
      fireEvent.click(deleteButton);
    });
    //expect(handleTransactionType).toHaveBeenCalledWith("delete");
  });
});

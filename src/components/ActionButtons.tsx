import React from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ReactTooltip from "react-tooltip";
import ChevronRightRounded from "@material-ui/icons/ChevronRightRounded";
import Delete from "@material-ui/icons/Delete";
import Update from "@material-ui/icons/Update";

export default function ActionButtons({ guid }: any) {
  const handleTransactionType = (event: any) => {
    console.log(event.value);
    // setIconColorToGreen(newTransactionState);
    // handlerToUpdateTransactionState(
    //   guid,
    //   accountNameOwner,
    //   newTransactionState
    // );
    // setTransactionType(newTransactionState);
  };

  // useEffect(() => {
  //   if (transactionState !== transactionType) {
  //     setIconColorToGreen(transactionState);
  //     setTransactionType(transactionState);
  //   }
  // }, [transactionType, transactionState]);

  // let buttonType = 'delete'
  return (
    <div data-testid="action-buttons">
      <ToggleButtonGroup
        value={""}
        exclusive
        onChange={(e) => handleTransactionType(e)}
        aria-label="text transactionType"
      >
        <div data-testid="move-button">
          <ToggleButton value="move">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a data-tip="move transaction">
              <ChevronRightRounded
                style={{ color: "black", fontSize: "small" }}
              />
            </a>
            <ReactTooltip effect="solid" />
          </ToggleButton>
        </div>

        <div data-testid="update-button">
          <ToggleButton value="update">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a data-tip="update transaction">
              <Update style={{ color: "black", fontSize: "small" }} />
            </a>
            <ReactTooltip effect="solid" />
          </ToggleButton>
        </div>

        <div data-testid="delete-button">
          <ToggleButton value="delete">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a data-tip="delete transaction">
              <Delete style={{ color: "black", fontSize: "small" }} />
            </a>
            <ReactTooltip effect="solid" />
          </ToggleButton>
        </div>
      </ToggleButtonGroup>
    </div>
  );
}

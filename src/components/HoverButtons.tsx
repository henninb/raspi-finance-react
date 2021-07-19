import React, { useState } from "react";
import AttachMoneyRounded from "@material-ui/icons/AttachMoneyRounded";
import TransactionStateButtons from "./TransactionStateButtons";

export default function HoverButtons({
  transactionState,
  guid,
  accountNameOwner,
  handlerToUpdateTransactionState,
}: any) {
  const [display, setDisplay] = useState("notdisplayed");
  const showButton = (e: any) => {
    e.preventDefault();
    setDisplay("displayed");
  };

  const hideButton = (e: any) => {
    e.preventDefault();
    setDisplay("notdisplayed");
  };

  return (
    <div className="App">
      <div
        onMouseEnter={(e) => showButton(e)}
        onMouseLeave={(e) => hideButton(e)}
      >
        {transactionState}
        <div className={display}>
          <TransactionStateButtons
            transactionState={transactionState}
            guid={guid}
            accountNameOwner={accountNameOwner}
            handlerToUpdateTransactionState={handlerToUpdateTransactionState}
          />
        </div>
      </div>
    </div>
  );
}
//onClick={handlerToUpdateTransactionState(guid, accountNameOwner, 'cleared')}

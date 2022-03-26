import React, { useState } from "react";
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
    <div
      className="displayed"
      onMouseEnter={(e) => showButton(e)}
      onMouseLeave={(e) => hideButton(e)}
    >
      <span>{transactionState}</span>
      <span className={display}>
        <TransactionStateButtons
          transactionState={transactionState}
          guid={guid}
          accountNameOwner={accountNameOwner}
          handlerToUpdateTransactionState={handlerToUpdateTransactionState}
        />
      </span>
    </div>
  );
}

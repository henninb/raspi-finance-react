import React, { useState } from "react";
import AttachMoneyRounded from "@material-ui/icons/AttachMoneyRounded";

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
        <div className="row">
          <div className="column">
            <button
              className={display}
              onClick={() => console.log("cleared: " + guid)}
            >
              cleared
            </button>
          </div>
          <div className="column">
            <button
              className={display}
              onClick={() => console.log("future" + guid)}
            >
              future
            </button>
          </div>
          <div className="column">
            <button
              className={display}
              onClick={() => console.log("outstanding" + guid)}
            >
              outstanding
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
//onClick={handlerToUpdateTransactionState(guid, accountNameOwner, 'cleared')}

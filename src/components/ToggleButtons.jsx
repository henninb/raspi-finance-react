import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {DoneAllRounded} from "@material-ui/icons";
import ReactTooltip from "react-tooltip";
import AttachMoneyRounded from '@material-ui/icons/AttachMoneyRounded';
//import green from "@material-ui/core/colors/green";
//import grey from "@material-ui/core/colors/grey";

export default function ToggleButtons({ transactionState, guid, handlerToUpdateTransactionState }) {
    const colorOn = "green";
    const colorOff = "grey";

    const determineColor  = (transactionState) => {
        if( transactionType === transactionState) {
            return colorOn;
        }
        return colorOff;
    }
    const [transactionType, setTransactionType] = React.useState(transactionState);
    const [clearedColor, setClearedColor] = React.useState( determineColor('cleared'));
    const [outstandingColor, setOutStandingColor] = React.useState( determineColor('outstanding'));
    const [futureColor, setFutureColor] = React.useState( determineColor('future'));

    const handleTransactionType = (event, newTransactionType) => {

        if( newTransactionType === 'cleared') {
            setClearedColor( colorOn);
            setOutStandingColor(colorOff);
            setFutureColor(colorOff);
        } else if( newTransactionType === 'future') {
            setClearedColor( colorOff);
            setOutStandingColor(colorOff);
            setFutureColor(colorOn);
        } else if( newTransactionType === 'outstanding') {
            setClearedColor( colorOff);
            setOutStandingColor(colorOn);
            setFutureColor(colorOff);
        }
        handlerToUpdateTransactionState(guid, newTransactionType);
        setTransactionType(newTransactionType);
    };

    return (
        <ToggleButtonGroup
            value={transactionType}
            exclusive
            onChange={handleTransactionType}
            aria-label="text transactionType"
        >

            <ToggleButton value="future" aria-label="future">
                <a data-tip="future transaction">
                <AttachMoneyRounded style={{ color: futureColor }} />
                </a>
                <ReactTooltip effect="solid"  />
            </ToggleButton>

            <ToggleButton value="outstanding" aria-label="outstanding">
                <a data-tip="outstanding transaction">
                <AttachMoneyRounded style={{ color: outstandingColor }} />
                </a>
                <ReactTooltip effect="solid"  />
            </ToggleButton>

            <ToggleButton value="cleared" aria-label="cleared">
                <a data-tip="cleared transaction">
                    <AttachMoneyRounded style={{ color: clearedColor }} />
                </a>
                <ReactTooltip effect="solid"  />
            </ToggleButton>


        </ToggleButtonGroup>
    );
}
import React from 'react'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ReactTooltip from "react-tooltip"
import AttachMoneyRounded from '@material-ui/icons/AttachMoneyRounded'

export default function ToggleButtons({ transactionState, guid, handlerToUpdateTransactionState }) {
    const colorOn = "green"
    const colorOff = "grey"

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

        if( newTransactionType === 'cleared' || newTransactionType.toLowerCase() === 'cleared' ) {
            setClearedColor( colorOn);
            setOutStandingColor(colorOff);
            setFutureColor(colorOff);
        } else if( newTransactionType === 'future' || newTransactionType.toLowerCase() === 'future' ) {
            setClearedColor( colorOff);
            setOutStandingColor(colorOff);
            setFutureColor(colorOn);
        } else if( newTransactionType === 'outstanding' || newTransactionType.toLowerCase() === 'outstanding' ) {
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

            <ToggleButton value="future">
                <a data-tip="future transaction">
                <AttachMoneyRounded style={{ color: futureColor }} />
                </a>
                <ReactTooltip effect="solid"  />
            </ToggleButton>

            <ToggleButton value="outstanding">
                <a data-tip="outstanding transaction">
                <AttachMoneyRounded style={{ color: outstandingColor }} />
                </a>
                <ReactTooltip effect="solid"  />
            </ToggleButton>

            <ToggleButton value="cleared">
                <a data-tip="cleared transaction">
                    <AttachMoneyRounded style={{ color: clearedColor }} />
                </a>
                <ReactTooltip effect="solid" />
            </ToggleButton>

        </ToggleButtonGroup>
    );
}
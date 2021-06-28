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
    const [clearedColor, setClearedColor] = React.useState( determineColor('Cleared'));
    const [outstandingColor, setOutStandingColor] = React.useState( determineColor('Outstanding'));
    const [futureColor, setFutureColor] = React.useState( determineColor('Future'));

    const handleTransactionType = (event, newTransactionType) => {

        if( newTransactionType === 'Cleared') {
            setClearedColor( colorOn);
            setOutStandingColor(colorOff);
            setFutureColor(colorOff);
        } else if( newTransactionType === 'Future') {
            setClearedColor( colorOff);
            setOutStandingColor(colorOff);
            setFutureColor(colorOn);
        } else if( newTransactionType === 'Outstanding') {
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

            <ToggleButton value="Future">
                <a data-tip="future transaction">
                <AttachMoneyRounded style={{ color: futureColor }} />
                </a>
                <ReactTooltip effect="solid"  />
            </ToggleButton>

            <ToggleButton value="Outstanding">
                <a data-tip="outstanding transaction">
                <AttachMoneyRounded style={{ color: outstandingColor }} />
                </a>
                <ReactTooltip effect="solid"  />
            </ToggleButton>

            <ToggleButton value="Cleared">
                <a data-tip="cleared transaction">
                    <AttachMoneyRounded style={{ color: clearedColor }} />
                </a>
                <ReactTooltip effect="solid" />
            </ToggleButton>

        </ToggleButtonGroup>
    );
}
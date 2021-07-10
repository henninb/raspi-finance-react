import React from 'react'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ReactTooltip from "react-tooltip"
import AttachMoneyRounded from '@material-ui/icons/AttachMoneyRounded'
import { TransactionState } from './model/TransactionState'

export default function ToggleButtons({ transactionState, guid, accountNameOwner, handlerToUpdateTransactionState } : any) {
    const colorOn = "green"
    const colorOff = "grey"

    const determineColor  = (transactionState: TransactionState) => {
        if( transactionType === transactionState) {
            return colorOn;
        }
        return colorOff;
    }
    const [transactionType, setTransactionType] = React.useState(transactionState);
    const [clearedColor, setClearedColor] = React.useState( determineColor('cleared'));
    const [outstandingColor, setOutStandingColor] = React.useState( determineColor('outstanding'));
    const [futureColor, setFutureColor] = React.useState( determineColor('future'));

    const handleTransactionType = (event: any, newTransactionState: TransactionState) => {
        console.log(newTransactionState)
        if( newTransactionState === 'cleared' ) {
            setClearedColor(colorOn);
            setOutStandingColor(colorOff);
            setFutureColor(colorOff);
        } else if( newTransactionState === 'future' ) {
            setClearedColor( colorOff);
            setOutStandingColor(colorOff);
            setFutureColor(colorOn);
        } else if( newTransactionState === 'outstanding' ) {
            setClearedColor(colorOff);
            setOutStandingColor(colorOn);
            setFutureColor(colorOff);
        }
        handlerToUpdateTransactionState(guid, accountNameOwner, newTransactionState);
        setTransactionType(newTransactionState);
    }

    return (
        <ToggleButtonGroup
            value={transactionType}
            exclusive
            onChange={handleTransactionType}
            aria-label="text transactionType"
        >

            <ToggleButton value="future">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a data-tip="future transaction">
                <AttachMoneyRounded style={{ color: futureColor }} />
                </a>
                <ReactTooltip effect="solid"  />
            </ToggleButton>

            <ToggleButton value="outstanding">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a data-tip="outstanding transaction">
                <AttachMoneyRounded style={{ color: outstandingColor }} />
                </a>
                <ReactTooltip effect="solid"  />
            </ToggleButton>

            <ToggleButton value="cleared">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a data-tip="cleared transaction">
                    <AttachMoneyRounded style={{ color: clearedColor }} />
                </a>
                <ReactTooltip effect="solid" />
            </ToggleButton>

        </ToggleButtonGroup>
    );
}
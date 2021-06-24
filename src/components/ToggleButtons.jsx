import React from 'react';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

export default function ToggleButtons() {
    const [transactionType, setTransactionType] = React.useState('cleared');

    const handleTransactionType = (event, newTransactionType) => {
        setTransactionType(newTransactionType);
    };

    return (
        <ToggleButtonGroup
            value={transactionType}
            exclusive
            onChange={handleTransactionType}
            aria-label="text transactionType"
        >
            <ToggleButton value="cleared" aria-label="left aligned">
                <FormatAlignLeftIcon />
            </ToggleButton>
            <ToggleButton value="future" aria-label="centered">
                <FormatAlignCenterIcon />
            </ToggleButton>
            <ToggleButton value="outstanding" aria-label="right aligned">
                <FormatAlignRightIcon />
            </ToggleButton>
            {/*<ToggleButton value="justify" aria-label="justified" disabled>*/}
            {/*    <FormatAlignJustifyIcon />*/}
            {/*</ToggleButton>*/}
        </ToggleButtonGroup>
    );
}
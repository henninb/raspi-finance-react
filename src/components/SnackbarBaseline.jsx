
import React, {useEffect, useState} from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
//import Alert from "@material-ui/lab/Alert";

export default function SnackbarBaseline({message, state, handleSnackbarClose}) {
    const [open, setOpen] = useState(false)

    // const handleClose = (event, reason) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }
    //
    //     setOpen(false);
    // };

    useEffect(() => {
       setOpen(state)
    }, [state])

    return (
        <div>
            <Snackbar
                open={open}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                autoHideDuration={4500}
                onClose={() => {
                    console.log('from onClose close me:' + open)
                    setOpen(false)
                    handleSnackbarClose()
                    console.log('from onClose close me:' + open)
                }}
            >
                <Alert severity="info">{message}</Alert>
            </Snackbar>

            {/*<Alert severity="error">This is an error message!</Alert>*/}
            {/*<Alert severity="warning">This is a warning message!</Alert>*/}
            {/*<Alert severity="info">This is an information message!</Alert>*/}
            {/*<Alert severity="success">This is a success message!</Alert>*/}

        </div>
    )
}
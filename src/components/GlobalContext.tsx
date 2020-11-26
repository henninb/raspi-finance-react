import React, {Context, useState} from "react";
import {Color as Severity} from "@material-ui/lab";

export interface SnackbarStateProps {
    message: string,
    severity: Severity
}

export let initialState : SnackbarStateProps = {
    message: '',
    severity: 'success'
};

// @ts-ignore
export function GlobalProvider({children}) {
    const [message, setMessage] = useState<SnackbarStateProps>(initialState)

    return (
        <GlobalContext.Provider value={{
            lang: 'en',
            theme: 'dark',
            message,
            setMessage
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

// @ts-ignore
export const GlobalContext: Context<any> = React.createContext({});
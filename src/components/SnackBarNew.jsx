import React, { PureComponent, useState } from 'react';
import Styles from './master.scss'

//export class SnackbarNew extends PureComponent {
export default function SnackbarNew({onClick}) {
    let message = 'test'

    const [isActive, setIsActive] = useState(true);

    // state = {
    //     isActive: false,
    // }

    const openSnackBar = (message = 'Something went wrong...') => {
        setIsActive(true);
    }

    return (
        <div className = {true ? [Styles.snackbar, Styles.show].join(" ") : Styles.snackbar}>
            {"testing"}
        </div>
    )

}
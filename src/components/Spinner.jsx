import React from 'react'
import Loader from "react-loader-spinner";

export default function Spinner() {
    return (
        <div data-testid="loader">
            <Loader type="Rings" color="#2BAD60"/>
        </div>
    );
}
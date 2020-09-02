export const formatDate = (date) => {
    let d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    month = ("0" + month).slice(-2);
    day = ("0" + day).slice(-2);

    return [year, month, day].join('-');
    //TODO: potentially use this
    // return date.toISOString().split('T')[0] + "T12:00:00.000"

}

export const toEpochDateAsMillis = (transactionDate) => {
    let date_val = new Date(transactionDate);
    let utc_val = new Date(date_val.getTime() + date_val.getTimezoneOffset() * 60000);

    return utc_val.valueOf();
}

export const currencyFormat = (inputData) => {
    inputData = parseFloat(inputData).toFixed(2);
    return inputData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

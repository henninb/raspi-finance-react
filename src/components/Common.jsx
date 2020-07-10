export default function formatDate(date) {
    let d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    month = ("0" + month).slice(-2);
    day = ("0" + day).slice(-2);

    return [year, month, day].join('-');
}

export function toEpochDateAsMillis(transactionDate) {
    let date_val = new Date(transactionDate);
    let utc_val = new Date(date_val.getTime() + date_val.getTimezoneOffset() * 60000);

    return utc_val.valueOf();
}

//
// export function currencyFormat(inputData) {
//     inputData = parseFloat(inputData).toFixed(2);
//     return inputData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }

//export default {formatDate, toEpochDateAsMillis, currencyFormat};
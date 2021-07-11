export const convertUTCDateToLocalDate = (date: any) => {
    let newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000)

    let offset = date.getTimezoneOffset() / 60
    let hours = date.getHours()

    newDate.setHours(hours - offset)
    return newDate
}

export const formatDate = (date: Date) => {
    let month = "" + (date.getMonth() + 1)
    let day = "" + date.getDate()
    let year = date.getFullYear()

    month = ("0" + month).slice(-2)
    day = ("0" + day).slice(-2)

    return [year, month, day].join("-")
}

export const fetchTimeZone = () => {
    return process.env.REACT_APP_TIMEZONE
}

export const currencyFormat = (inputData: string) => {
    inputData = parseFloat(inputData).toFixed(2)
    return inputData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const endpointUrl = () => {
    let port = process.env.REACT_APP_ENDPOINT_PORT
    let server = process.env.REACT_APP_ENDPOINT_SERVER
    let httpEnabled = process.env.REACT_APP_ENDPOINT_SSL_ENABLED

    if (httpEnabled === 'true') {
        return "https://" + server + ":" + port
    }
    return "http://" + server + ":" + port
}

export const typeOf = (obj: any) => {
    return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
}

export const noNaN = (n: any) => {
    return isNaN(n) ? 0.0 : n;
}

export const capitalizeFirstChar = (inString: String) => {
    return inString.charAt(0).toUpperCase() + inString.slice(1)
}

export function isFloat(n: number) {
    return Number(n) === n && n % 1 !== 0;
}
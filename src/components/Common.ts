import moment from "moment";

export const convertUTCDateToLocalDate = (date: any) => {
    let newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000)

    let offset = date.getTimezoneOffset() / 60
    let hours = date.getHours()

    newDate.setHours(hours - offset)
    return newDate
}

export const formatDate = (date: any) => {
    //moment(props.value).format('YYYY-MM-DD')
    //TODO: use moment here
    let d = convertUTCDateToLocalDate(new Date(date))
    let month = "" + (d.getMonth() + 1)
    let day = "" + d.getDate()
    let year = d.getFullYear()

    month = ("0" + month).slice(-2)
    day = ("0" + day).slice(-2)

    return [year, month, day].join("-")
}

export const fetchTimeZone = () => {
    return process.env.REACT_APP_TIMEZONE
}

//TODO: change this to moment
export const toEpochDateAsMillis = (transactionDate: any) => {
    // @ts-ignore
    return moment(transactionDate).tz(fetchTimeZone()).toDate().valueOf()
    // let date_val = new Date(transactionDate)
    // let utc_val = new Date(
    //     date_val.getTime() + date_val.getTimezoneOffset() * 60000
    // )
    //
    // return utc_val.valueOf()
}

export const currencyFormat = (inputData: string) => {
    inputData = parseFloat(inputData).toFixed(2)
    return inputData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const endpointUrl = () => {
    let port = process.env.REACT_APP_ENDPOINT_PORT
    let server = process.env.REACT_APP_ENDPOINT_SERVER
    let httpEnabled = process.env.REACT_APP_ENDPOINT_SSL_ENABLED

    console.log(typeOf(httpEnabled))
    console.log(httpEnabled)
    if (httpEnabled === 'true') {
        console.log(server + ":" + port)
        return "https://" + server + ":" + port
    }
    console.log(server + ":" + port)
    return "http://" + server + ":" + port
}

export const typeOf = (obj: any) => {
    return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
}

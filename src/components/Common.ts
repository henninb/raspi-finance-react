export const formatDate = (date: any) => {
  let d = new Date(date)
  let month = "" + (d.getMonth() + 1)
  let day = "" + d.getDate()
  let year = d.getFullYear()

  month = ("0" + month).slice(-2)
  day = ("0" + day).slice(-2)

  return [year, month, day].join("-")
  //TODO: potentially use this
  // return date.toISOString().split('T')[0] + "T12:00:00.000"
}

export const toEpochDateAsMillis = (transactionDate: any) => {
  let date_val = new Date(transactionDate)
  let utc_val = new Date(
    date_val.getTime() + date_val.getTimezoneOffset() * 60000
  )

  return utc_val.valueOf()
}

export const currencyFormat = (inputData: string) => {
  inputData = parseFloat(inputData).toFixed(2)
  return inputData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const endpointUrl = () => {
  //TODO: figure this out
  let port = process.env.REACT_APP_ENDPOINT_PORT
  let server = process.env.REACT_APP_ENDPOINT_SERVER
  let httpEnabled = process.env.HTTPS

  if( httpEnabled === 'true' ) {
    console.log(server + ":" + port)
    return "https://" + server + ":" + port
  }
  console.log(server + ":" + port)
  return "http://" + server + ":" + port
}

export const typeOf = (obj: any) => {
    return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
}

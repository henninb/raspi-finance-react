import React, { useCallback, useEffect, useState } from "react"
import MaterialTable from "material-table"
import Spinner from "./Spinner"
import "./master.scss"
import axios from "axios"
import Button from "@material-ui/core/Button"
import { useHistory } from "react-router-dom"
import { endpointUrl } from "./Common"

export default function AccountSummaryTable() {
  const [totals, setTotals] = useState([])
  const [loading, setLoading] = useState(true)
  const [accountData, setData] = useState([])
  const history = useHistory()

  const handleButtonClickLink = (accountNameOwner) => {
    history.push("/transactions/" + accountNameOwner)
    history.go(0)
  }

  const addRow = (newData) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const newPayload = await postCall(newData)
          setData([newPayload, ...accountData])
          resolve()
        } catch (error) {
          if (error.response) {
            alert(
              "addRow - status: " +
                error.response.status +
                " - " +
                JSON.stringify(error.response.data)
            )
          }
          reject()
        }
      }, 1000)
    })
  }

  const postCall = useCallback(async (payload) => {
    let CancelToken = axios.CancelToken
    let source = CancelToken.source()
    let endpoint = endpointUrl() + "/account/insert/"

    const now = new Date()
    payload.totals = 0.0
    payload.totalsBalanced = 0.0
    payload.dateClosed = 0
    payload.dateAdded = Math.round(now.getTime())
    payload.dateUpdated = Math.round(now.getTime())
    payload.activeStatus = true

    let response = await axios.post(endpoint, payload, {
      timeout: 0,
      headers: { "Content-Type": "application/json" },
      cancelToken: source.token,
    })
    console.log(response.data)
    return payload
  }, [])

  const currencyFormat = (inputData) => {
    inputData = parseFloat(inputData).toFixed(2)
    return inputData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const deleteCall = useCallback(async (payload) => {
    let endpoint = endpointUrl() + "/account/delete/" + payload.accountNameOwner

    let response = await axios.delete(endpoint, {
      timeout: 0,
      headers: { "Content-Type": "application/json" },
    })
    if (response.status !== 200) {
      alert("not a 200")
    }
    console.log(response.data)
  }, [])

  const fetchTotals = useCallback(async () => {
    try {
      const response = await axios.get(endpointUrl() + "/account/totals",
          {
              timeout: 0,
              headers: {"Content-Type": "application/json"},
          }
          )
      setTotals(response.data)
    } catch (error) {
      if (error.response) {
        alert("fetchTotals: " + error.response.status)
        alert("fetchTotals: " + JSON.stringify(error.response.data))
      }
    }
  }, [])

  const fetchData = useCallback(async () => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()

    try {
      const response = await axios.get(endpointUrl() + "/account/select/active",
          {
              timeout: 0,
              headers: {"Content-Type": "application/json"},
          }
          )
      setData(response.data)
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          console.log(error.response.status)
        } else {
            console.log("fetchData: " + error.response.status)
            console.log("fetchData: " + JSON.stringify(error.response.data))
        }
      }
    } finally {
        setLoading(false)
    }

    return () => {
      source.cancel()
    }
  }, [])

  useEffect(() => {
    if (accountData.length === 0) {
      let response = fetchData()
      console.log(response)
    }

    if (totals.length === 0) {
      let response = fetchTotals()
      console.log(response)
    }

    return () => {}
  }, [totals, accountData, fetchData, fetchTotals])

  return (
    <div>
      {!loading ? (
        <div className="table-formatting">
          <MaterialTable
            columns={[
              {
                title: "accountNameOwner",
                field: "accountNameOwner",
                cellStyle: { whiteSpace: "nowrap" },
                render: (rowData) => {
                  return (
                    <Button
                      onClick={() =>
                        handleButtonClickLink(rowData.accountNameOwner)
                      }
                    >
                      {rowData.accountNameOwner}
                    </Button>
                  )
                },
              },
              {
                title: "accountType",
                field: "accountType",
                cellStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "moniker",
                field: "moniker",
                cellStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "unbalanced",
                field: "totals",
                type: "currency",
                  editable: "never",
                cellStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "balanced",
                field: "totalsBalanced",
                type: "currency",
                  editable: "never",
                cellStyle: { whiteSpace: "nowrap" },
              },
            ]}
            data={accountData}
            title={` [ $${currencyFormat(
              totals["totalsCleared"]
            )} ], [ $${currencyFormat(totals["totals"])} ]`}
            options={{
              paging: false,
              search: true,
              addRowPosition: "first",
              headerStyle: {
                backgroundColor: "#9965f4",
                color: "#FFF",
                // position: 'sticky', top: 0
              },
              rowStyle: { fontSize: ".6rem" },
            }}
            editable={{
              onRowAdd: addRow,
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(async () => {
                    const dataDelete = [...accountData]
                    const index = oldData.tableData.id
                    dataDelete.splice(index, 1)
                    try {
                      await deleteCall(oldData)
                      setData([...dataDelete])
                      resolve()
                    } catch (error) {
                      if (error.response) {
                        alert(
                          "onRowDelete - status: " +
                            error.response +
                            " - " +
                            JSON.stringify(error.response.data)
                        )
                      }
                      reject()
                    }
                  }, 1000)
                }),
            }}
          />
        </div>
      ) : (
        <div className="centered">
          <Spinner />
        </div>
      )}
    </div>
  )
}

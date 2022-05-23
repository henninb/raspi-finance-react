//import React, { useState } from "react";

import useFetchParameters from "./queries/useFetchParameters";
import React, { useEffect } from "react";
import Spinner from "./Spinner";

export default function ParameterConfiguration() {
  const { data, isSuccess, isLoading } = useFetchParameters();

       function generateTable(params :any) {
           const rows = params.map((param: any, index: any) => {
      return (
          <tr id={index}>
            <td>{index}</td>
            <td>{param.parameterName}</td>
            <td>{param.parameterValue}</td>
          </tr>
      )
    })

    return (
        <div>
          <table>
            <tbody>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Value</th>
            </tr>
            {rows}
            </tbody>
          </table>
        </div>
    )
  }

  useEffect(() => {
  }, []);
  // @ts-ignore
  return (
    <div>
      {!isLoading && isSuccess ? (
          <div>
        <h1>Configuration</h1>
          {generateTable(data)}
          </div>
      ) : (
        <div className="centered">
          <Spinner />
        </div>
      )}
    </div>
  );
}

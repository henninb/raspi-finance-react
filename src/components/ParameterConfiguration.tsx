//import React, { useState } from "react";

import useFetchParameters from "./queries/useFetchParameters";
import useParameterDelete from "./queries/useParameterDelete";
import useParameterUpdate from "./queries/useParameterUpdate";
import React, { useEffect } from "react";
import Spinner from "./Spinner";
import "./parameter.css";

export default function ParameterConfiguration() {
  const { data, isSuccess, isLoading } = useFetchParameters();
  const { mutate: deleteParameter } = useParameterDelete();
  const { mutate: updateParameter } = useParameterUpdate();

  function handleDelete(parameterName: any) {
    let row = {parameterName: parameterName}
    deleteParameter({oldRow: row})
  }

  function handleUpdate(parameterName: any) {
    let oldData = {parameterName: parameterName}
    let newData = {parameterName: parameterName, parameterValue: 'test'}
    updateParameter({ newRow: newData, oldRow: oldData });
  }

  function generateTable(params: any) {
    const rows = params.map((param: any, index: any) => {
      return (
        <tr key={index} id={index} className="config-var-item ember-view">
          <td>
            <input
              readOnly
              id={index}
              className="config-var-key monospace ember-text-field form-control ember-view"
              type="text"
              value={param.parameterName}
            />
          </td>

          <td>
            <textarea
              wrap="off"
              readOnly
              id={index}
              value={param.parameterValue}
              style={{ height: "34px" }}
              className="config-var-value monospace ember-text-area form-control ember-view"
            />
          </td>

          <td id={index} className="action-cell ember-view">
            <button
              className="bg-transparent hk-focus-ring--blue:focus cursor-hand br1 ba0 b--none pa--1"
              title="Edit"
              type="button"
              onClick={() => handleUpdate(param.parameterName)}
            >
              <span className="clip">Edit</span>
              <svg
                style={{ height: "16px", width: "16px" }}
                className="icon malibu-icon"
                aria-hidden="false"
                role="img"
              >
                <use
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  xlinkHref="#edit-16"
                />
              </svg>
            </button>

            <button
              className="bg-transparent hk-focus-ring--blue:focus cursor-hand br1 ba0 b--none pa--1"
              title="Delete"
              type="button"
              onClick={() => handleDelete(param.parameterName)}
            >
              <span className="clip">Delete</span>
              <svg
                style={{ height: "16px", width: "16px" }}
                className="icon malibu-icon hover-fill-red"
                data-test-icon-name="delete-16"
                data-test-target="malibu-icon"
                aria-hidden="false"
                role="img"
              >
                <use
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  xlinkHref="#delete-16"
                />
              </svg>
            </button>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <form>
          <table className="table editable-list purple-list config-vars-list-table">
            <tbody>
              {rows}

              <tr className="config-var-new">
                <td>
                  <div id="ember953" className="form-group ember-view">
                    <input
                      placeholder="KEY"
                      id="ember954"
                      className="form-control config-var-key monospace  ember-text-field ember-view"
                      type="text"
                    />
                  </div>
                </td>

                <td>
                  <div id="ember955" className="ember-view">
                    <textarea
                      wrap="off"
                      style={{ height: "34px" }}
                      placeholder="VALUE"
                      id="ember956"
                      className="config-var-value monospace form-control ember-text-area ember-view"
                    />
                  </div>
                </td>

                <td className="config-var-add">
                  <button
                    disabled
                    id="ember957"
                    className="async-button default hk-button ember-view"
                    type="submit"
                  >
                    Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            visibility: "hidden",
          }}
        >
          <defs>
            <symbol id="delete-16" viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                d="M6.663 8.01l-3.362 3.362a.955.955 0 00-.005 1.352.953.953 0 001.352-.005L8.01 9.357l3.362 3.362a.955.955 0 001.352.005.953.953 0 00-.005-1.352L9.357 8.01l3.362-3.362a.955.955 0 00.005-1.352.953.953 0 00-1.352.005L8.01 6.663 4.648 3.301a.955.955 0 00-1.352-.005.953.953 0 00.005 1.352L6.663 8.01z"
              ></path>
            </symbol>
            <symbol id="edit-16" viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                d="M13.24 5.066l-2.187-2.188.733-.733c.39-.39 1.03-.385 1.412-.003l.779.779a1.001 1.001 0 01-.004 1.412l-.733.733zm-.618.618l-6.858 6.858c-.391.391-1.133.83-1.675.987L2 14.13l.594-2.097c.152-.537.595-1.292.982-1.68l6.858-6.857 2.188 2.187z"
              ></path>
            </symbol>
          </defs>
        </svg>
      </div>
    );
  }

  useEffect(() => {}, []);
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

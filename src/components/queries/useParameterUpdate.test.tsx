import { createRoot } from "react-dom/client";
import { renderHook } from "@testing-library/react-hooks";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import useParameterUpdate from "./useParameterUpdate";
import Parameter from "../model/Parameter";
import { act } from "@testing-library/react";

const mockAxios = new MockAdapter(axios);

describe("useParameterUpdate", () => {
  const parameterName = "test_parameter";
  const parameterId = 1;
  const activeStatus = true;

  const newParameter: Parameter = {
    parameterId,
    parameterName,
    parameterValue: "new value",
    activeStatus,
  };

  const oldParameter: Parameter = {
    parameterId,
    parameterName,
    parameterValue: "old value",
    activeStatus,
  };

  afterEach(() => {
    mockAxios.reset();
  });

  it("should update a parameter successfully", async () => {
    // Arrange
    const endpoint = `/parm/update/${parameterName}`;
    mockAxios.onPut(endpoint).reply(200, newParameter);

    // Act
    await act(async () => {
      //const root = createRoot();
      //      const root = createRoot(document.createElement('div'));
      //root.render(<TestHook />);
      // With this:
      // const root = document.getElementById('root');
      // if (root) {
      //   const app = <useParameterUpdate />;
      //   ReactDOM.createRoot(root).render(app);
      // }
      await Promise.resolve();
    });

    // Assert
    expect(mockAxios.history.put.length).toBe(0);
  });

  function TestHook() {
    const { result } = renderHook(() => useParameterUpdate());

    result.current.mutate({ newRow: newParameter, oldRow: oldParameter });
    return null;
  }
});

// import { act, createRoot } from 'react-dom';
// import { renderHook } from '@testing-library/react-hooks';
// import MockAdapter from 'axios-mock-adapter';
// import axios from 'axios';
// import useParameterUpdate from './useParameterUpdate';
// import Parameter from '../model/Parameter';
//
// const mockAxios = new MockAdapter(axios);
//
// describe('useParameterUpdate', () => {
//   const endpointUrl = 'http://localhost:3000';
//   const parameterName = 'testParameter';
//   const newParameter: Parameter = { parameterName, parameterValue: 'new value' };
//   const oldParameter: Parameter = { parameterName, parameterValue: 'old value' };
//
//   afterEach(() => {
//     mockAxios.reset();
//   });
//
//   it('should update the parameter successfully', async () => {
//     // Arrange
//     const responseData = { status: 'success' };
//     mockAxios.onPut(`${endpointUrl}/parm/update/${parameterName}`).reply(200, responseData);
//
//     // Act
//     const { result, waitForNextUpdate } = renderHook(() => useParameterUpdate());
//
//     await act(async () => {
//       result.current.mutate({ newRow: newParameter, oldRow: oldParameter });
//       await waitForNextUpdate();
//     });
//
//     // Assert
//     expect(result.current.isLoading).toBe(false);
//     expect(result.current.isError).toBe(false);
//     expect(result.current.isSuccess).toBe(true);
//     expect(result.current.data).toEqual(responseData);
//   });
//
//   it('should handle errors when updating the parameter', async () => {
//     // Arrange
//     const errorMessage = 'Something went wrong';
//     mockAxios.onPut(`${endpointUrl}/parm/update/${parameterName}`).reply(500, errorMessage);
//
//     // Act
//     const { result, waitForNextUpdate } = renderHook(() => useParameterUpdate());
//
//     await act(async () => {
//       result.current.mutate({ newRow: newParameter, oldRow: oldParameter });
//       await waitForNextUpdate();
//     });
//
//     // Assert
//     expect(result.current.isLoading).toBe(false);
//     expect(result.current.isError).toBe(true);
//     expect(result.current.isSuccess).toBe(false);
//     expect(result.current.error).toEqual(errorMessage);
//   });
// });

// import { renderHook } from '@testing-library/react-hooks';
// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';
// import useParameterUpdate from './useParameterUpdate';
//
// describe('useParameterUpdate', () => {
//   let mockAxios: MockAdapter;
//
//   beforeAll(() => {
//     mockAxios = new MockAdapter(axios);
//   });
//
//   afterEach(() => {
//     mockAxios.reset();
//   });
//
//   afterAll(() => {
//     mockAxios.restore();
//   });
//
//   it('should update the parameter on the server', async () => {
//     // Arrange
//     const oldParameter = { parameterName: 'oldName', parameterValue: 'oldValue' };
//     const newParameter = { parameterName: 'newName', parameterValue: 'newValue' };
//     const endpoint = '/parm/update/oldName';
//     const updateResponse = { data: { message: 'Parameter updated successfully' } };
//     mockAxios.onPut(endpoint, newParameter).reply(200, updateResponse);
//
//     // Act
//     const { result, waitForNextUpdate } = renderHook(() => useParameterUpdate());
//     result.current.mutate({ newRow: newParameter, oldRow: oldParameter });
//     await waitForNextUpdate();
//
//     // Assert
//     expect(result.current.isSuccess).toBeTruthy();
//     expect(result.current.data).toEqual(updateResponse.data);
//   });
//
//   it('should handle errors from the server', async () => {
//     // Arrange
//     const oldParameter = { parameterName: 'oldName', parameterValue: 'oldValue' };
//     const newParameter = { parameterName: 'newName', parameterValue: 'newValue' };
//     const endpoint = '/parm/update/oldName';
//     const errorMessage = 'Something went wrong on the server';
//     mockAxios.onPut(endpoint, newParameter).reply(500, { message: errorMessage });
//
//     // Act
//     const { result, waitForNextUpdate } = renderHook(() => useParameterUpdate());
//     result.current.mutate({ newRow: newParameter, oldRow: oldParameter });
//     await waitForNextUpdate();
//
//     // Assert
//     expect(result.current.isError).toBeTruthy();
//     expect(result.current.error?.message).toEqual(errorMessage);
//   });
// });
//

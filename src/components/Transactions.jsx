import React, { useState, useEffect } from 'react';
import {v4 as uuidv4} from 'uuid';
import { useMatch } from 'react-router-dom';
import AddRowOverlay from "./AddRowOverlay";


export default function Transactions() {
//export default function Transactions({accountNameOwner="test_brian"}) {
  const [data, setData] = useState([]); // Your spreadsheet data
  const [selectedRows, setSelectedRows] = useState([]);
  const [areButtonsVisible, setAreButtonsVisible] = useState(false);
  const [content, setContent] = useState({});
  const [editableCell, setEditableCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [showAddRowOverlay, setShowAddRowOverlay] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const routeMatch = useMatch("/transactionsnew/:account");
  let accountNameOwner = "none-set";
  try {
    accountNameOwner = routeMatch.params["account"];
  } catch {
    console.log("accountNameOwner is not set.");
    accountNameOwner = "none-set";
  }

  // Functions to handle data modification, row selection, and pagination
  useEffect(() => {
    setIsLoading(true);
    console.log('accountNameOwner: '+ accountNameOwner);
    console.log(isLoading)
    fetch(`/transaction/account/select/${accountNameOwner}`)
    .then((response) => response.json())
    .then((data) => {
      setData(data);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    });
  }, [accountNameOwner]);

  useEffect(() => {
    setAreButtonsVisible(selectedRows.length > 0);
  }, [selectedRows]);

  const handleRowCheckboxChange = (rowId) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(rowId)) {
        return prevSelectedRows.filter((id) => id !== rowId);
      } else {
        return [...prevSelectedRows, rowId];
      }
    });
  };

  const handleFieldClick = (fieldName, rowId, displayValue) => {
    setEditableCell({ fieldName, rowId });
    setEditValue(displayValue); // Initialize the edit field with the previous value
  };

  const handleCellValueChange = (value, fieldName, rowId) => {
    setContent((prevContent) => ({
      ...prevContent,
      [rowId]: {
        ...prevContent[rowId],
        [fieldName]: value,
      },
    }));
    setEditableCell(null);
  };

  const formatCurrency = (amount) => {
    if (typeof amount === 'number') {
      return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    } else {
      return 'Invalid amount';
    }
  };

  const renderEditableCell = (fieldName, displayValue, rowId) => {
    const isSelected = selectedRows.includes(rowId);
    const isEditing = editableCell && editableCell.fieldName === fieldName && editableCell.rowId === rowId;


    const handleEscapeKeyPress = (e) => {
      if (e.key === 'Escape') {
        // Revert changes when "Escape" key is pressed
        setEditValue(displayValue);
        setEditableCell(null);
      }
    };

    const handleBlur = () => {
      if (isEditing) {
        handleCellValueChange(editValue, fieldName, rowId);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleCellValueChange(editValue, fieldName, rowId);
        console.log(editValue);
        //data['fieldName'] = editValue;
        const index = data.findIndex((item) => item.guid === rowId);
        console.log(index)
        const newData = { ...data[index], [fieldName]: editValue };
        console.log(newData)
        //setData(newData)
        //displayValue = editValue;
      }
    };

    return (
      <td
        onClick={() => handleFieldClick(fieldName, rowId, displayValue)}
        onBlur={handleBlur}
        className={isEditing ? 'editing' : ''}
      >
        {fieldName === 'selected' ? (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleRowCheckboxChange(rowId)}

          />
        ) : (
          <span>
            {isEditing ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleEscapeKeyPress}
                className="dracula-input"
                onKeyPress={handleKeyPress}
                autoFocus
              />
            ) : (
              (content[rowId] && content[rowId][fieldName]) || displayValue
            )}
          </span>
        )}
      </td>
    );
  };

  const handleReset = () => {
    if (selectedRows.length === 1) {
      console.log(`Selected row for reset: ${selectedRows[0]}`);
    } else if (selectedRows.length > 1) {
      console.log(`Selected rows for reset: ${selectedRows.join(', ')}`);
    } else {
      console.log('No rows selected for reset');
    }

    setSelectedRows([]);
    setAreButtonsVisible(false);
  };

  const handleDeleteRows = async () => {
    if (selectedRows.length === 0) {
      console.log('No rows selected for deletion');
      return;
    }

    const deleteRows = data.filter((row) => selectedRows.includes(row.guid));
    const updatedData = data.filter((row) => !selectedRows.includes(row.guid));

    setSelectedRows([]); // Clear the selected rows
    setAreButtonsVisible(false);

    const deletePromises = deleteRows.map((row) =>
      fetch(`/api/transaction/delete/${row.guid}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to delete row with UUID ${row.guid}`);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          // Handle any errors that occurred during the fetch
        })
    );

    try {
      await Promise.all(deletePromises);
      // If all deletions were successful, update the state with the updated data
      setData(updatedData);
      console.log(`Deleted rows: ${deleteRows.map((row) => row.guid).join(', ')}`);
    } catch (error) {
      console.error('Error deleting rows:', error.message);
    }
  };

  // Function to slice the data based on current page and rows per page
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Function to handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Function to handle changing the number of rows per page
  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to the first page when changing rows per page
  };

  const handleAddRow = (newRowData) => {
    newRowData.guid = uuidv4();
    newRowData.accountNameOwner = accountNameOwner;
    newRowData.activeState = true;
    newRowData.accountType = "credit";

    fetch(`/api/transaction/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRowData),
    })
    .then(async (response) => {
      if (!response.ok) {
        const errorMessage = await response.json(); // Parse the error message from the server
        console.log("response is not ok:", errorMessage.error);
        throw new Error(errorMessage.error);
      }
      return response.json();
    })
    .then((data) => {
      // Handle the response from the server
      console.log('Data added to the database:', data);
      console.log(newRowData);
      setData((prevData) => [...prevData, newRowData]);
    })
    .catch((error) => {
      console.log('error:', error.message);
      // Handle any errors that occurred during the fetch
      console.error('Error:', error);
    });
  };

  const handleMove = () => {
    if (selectedRows.length === 1) {
      console.log(`Selected row for moving: ${selectedRows[0]}`);
    } else if (selectedRows.length > 1) {
      console.log(`Selected rows for moving: ${selectedRows.join(', ')}`);
    } else {
      console.log('No rows selected for moving');
    }
  };

  return (

    <div>
    {isLoading ? (
      <div className="spinner">
        <p>Loading...</p>
      </div>
    ) : (
    <div>

      <div className="button-container">
        {areButtonsVisible ? (
          <>
            <button className="reset-button" onClick={handleReset}>
              Reset
            </button>
            <button className="move-button" onClick={handleMove}>
              Move
            </button>
            <button className="delete-button" onClick={handleDeleteRows}>
              Delete
            </button>
          </>
        ) : (
            <>
         <button className="add-button"
         onClick={() => setShowAddRowOverlay(true)}>Add</button>
         </>
        )}
      </div>

      {showAddRowOverlay ? (
        <AddRowOverlay
          onAddRow={handleAddRow}
          onClose={() => setShowAddRowOverlay(false)}
        />
      ) : (
     <>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>State</th>
            <th>Type</th>
            <th>Recurring</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={index}>
              {renderEditableCell('selected', null,  row.guid)}
              {renderEditableCell('date', row.transactionDate, row.guid)}
              {renderEditableCell('description', row.description, row.guid)}
              {renderEditableCell('category', row.category, row.guid)}
              {renderEditableCell('amount', formatCurrency(row.amount), row.guid)}
              {renderEditableCell('state', row.transactionState, row.guid)}
              {renderEditableCell('type', row.transactionType, row.guid)}
              {renderEditableCell('recurring', row.reoccurringType, row.guid)}
              {renderEditableCell('notes', row.notes, row.guid)}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="rows-per-page-selector">
        <label>Show
          <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          records per page
        </label>
      </div>

      <div className="pagination-container">
        <button
          className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      </>
    )}

    </div>
    )}
    </div>
  );
}
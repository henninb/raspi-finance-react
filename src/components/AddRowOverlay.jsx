import React, { useState, useEffect } from 'react';
import { NumericFormat } from 'react-number-format';

export default function AddRowOverlay({ onAddRow, onClose }) {
  const initialFormData = {
    transactionDate: new Date().toISOString().slice(0, 10),
    //transactionDate: new Date().toLocaleDateString().slice(0, 10),
    //transactionDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    description: '',
    category: '',
    amount: '0.00',
    transactionState: 'outstanding',
    transactionType: 'expense',
    reoccurringType: 'onetime',
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAmountChange = (values) => {
    const { value } = values;
    setFormData((prevData) => ({
      ...prevData,
      amount: value,
    }));
  };

  const handleSave = () => {
    // Pass the form data to the parent component

    // Convert the amount from string to decimal
    const decimalAmount = parseFloat(formData.amount);
  
    // Update formData with the decimal amount
    const updatedFormData = {
      ...formData,
      amount: decimalAmount,
    };

    onAddRow(updatedFormData);
    onClose();
  };

  // Add an event listener for the 'keydown' event
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.keyCode === 27) {
        onClose();
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener('keydown', handleKeyDown);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="overlay">
      <div className="overlay-content">
        <h2>Add Row</h2>
        <form>
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={handleInputChange}
              className="dracula-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="description"
              value={formData.description}
              onChange={handleInputChange}
              className="dracula-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <input
              type="text"
              id="category"
              name="category"
              placeholder="category"
              value={formData.category}
              onChange={handleInputChange}
              className="dracula-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount:</label>
            <NumericFormat
              id="amount"
              name="amount"
              placeholder="amount"
              value={formData.amount}
              onValueChange={handleAmountChange}
              className="dracula-input"
              thousandSeparator={true}
              prefix="$"
              decimalScale={2}
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">State:</label>
            <select
              id="state"
              name="transactionState"
              value={formData.transactionState}
              onChange={handleInputChange}
              className="dracula-input"
            >
              <option value="future">Future</option>
              <option value="outstanding">Outstanding</option>
              <option value="cleared">Cleared</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="type">Type:</label>
            <select
              id="state"
              name="transactionType"
              value={formData.transactionType}
              onChange={handleInputChange}
              className="dracula-input"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="transfer">Transfer</option>
              <option value="undefined">Undefined</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="recurring">Recurring:</label>
            <input
              type="text"
              id="recurring"
              name="recurring"
              placeholder="reocurring"
              value={formData.reoccurringType}
              onChange={handleInputChange}
              className="dracula-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes:</label>
            <input
              type="text"
              id="notes"
              name="notes"
              placeholder="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="dracula-input"
            />
          </div>
          <div className="button-container">
            <button type="button" onClick={handleSave} className="save-button">
              Save
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import './CreateFurniturePopup.css';

const CreateFurniturePopup = ({ isOpen, onClose, onSubmit, marketplace, web3 }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');

  const handleSubmit = async () => {
    onSubmit({ name, price, condition });

    try {
      if (marketplace && web3) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];

        await marketplace.methods.createFurniture(name, condition, price).send({ from: userAddress, gas: 1000000 });

        onClose();
      } else {
        console.error('Marketplace or Web3 not available');
      }
    } catch (error) {
      console.error('Error creating furniture listing:', error);
    }
  };

  return (
    <div className={`popup-container ${isOpen ? 'open' : ''}`}>
      <div className="popup-content">
        <h3>Create Furniture Listing</h3>
        <div className="input-container">
          <label htmlFor="furnitureName">Name:</label>
          <input
            type="text"
            id="furnitureName"
            placeholder="Enter the furniture name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="furnitureCondition">Condition:</label>
          <input
            type="text"
            id="furnitureCondition"
            placeholder="Enter the furniture condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="furniturePrice">Price:</label>
          <input
            type="text"
            id="furniturePrice"
            placeholder="Enter the furniture price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="button-container">
          <button className='popup' onClick={handleSubmit}>Submit</button>
          <button className='popup' onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CreateFurniturePopup;

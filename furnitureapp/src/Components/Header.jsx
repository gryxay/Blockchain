import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import CreateFurniturePopup from './CreateFurniturePopup';
import './Header.css';

const Header = ({ marketplace, web3, incrementFetchFurniture, home, userFurniture, createFurniture }) => {
  const { loggedIn, loginWithMetaMask } = useAuth();
  const [isCreatePopupOpen, setCreatePopupOpen] = useState(false);

  const handleLoginButtonClick = async () => {
    try {
      if (!loggedIn) {
        await loginWithMetaMask();
      }
    } catch (error) {
      console.error('Error logging in with MetaMask:', error);
    }
  };

  return (
    <div className="header-container">
      {loggedIn && (
        <div style={{ marginRight: "auto" }}>
          <strong>Wallet:</strong> {window.ethereum.selectedAddress}
        </div>
      )}

      {home && (
        <Link to="/">
          <button className="styled-button">Home</button>
        </Link>
      )}
      {createFurniture && (
        <>
          <CreateFurniturePopup
            isOpen={isCreatePopupOpen}
            onClose={() => setCreatePopupOpen(false)}
            onSubmit={() => {
              setCreatePopupOpen(false);
              incrementFetchFurniture();
            }}
            marketplace={marketplace}
            web3={web3}
          />
          <button className="styled-button" onClick={() => setCreatePopupOpen(true)}>
            Create Furniture
          </button>
        </>
      )}
      {userFurniture && (
        <Link to="/account">
          <button className="styled-button">My Furniture</button>
        </Link>
      )}
      {!loggedIn && (
        <button className="styled-button" onClick={handleLoginButtonClick}>
          Login with MetaMask
        </button>
      )}
    </div>
  );
};

export default Header;

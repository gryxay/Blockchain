import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(window.ethereum.selectedAddress ? true : false);

  const loginWithMetaMask = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setLoggedIn(true);
          console.log('MetaMask login successful');
        } else {
          console.error('MetaMask login failed. No accounts available.');
        }
      } else {
        console.error('MetaMask not detected');
      }
    } catch (error) {
      console.error('Error logging in with MetaMask:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ loggedIn, loginWithMetaMask }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

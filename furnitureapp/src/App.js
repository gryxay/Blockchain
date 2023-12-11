import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import FrontPage from './FrontPage.jsx';
import Details from "./Components/Details.jsx";
import { AuthProvider } from './AuthContext';
import SingleListing from "./Components/SingleListing.jsx";

function App() {

  const [user, setUser] = useState({});
  const [marketDetails, setMarketDetails] = useState({});
  const [selectedId, setSelectedId] = useState(-1);

  useEffect(() => {
    const switchAccount = async () => {
      setUser(window.ethereum.selectedAddress)
    }

    if (marketDetails.web3) {
      if(window.ethereum) {
        window.ethereum.on('chainChanged', () => { window.location.reload(); })
        window.ethereum.on('accountsChanged', () => { window.location.reload(); })
      }
  
      switchAccount();
    }
  }, [marketDetails.web3])

  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <header className="App-header">
            <Routes>
              <Route path="/" element={<FrontPage setUser={setUser} setMarketDetails={setMarketDetails} setSelectedId={setSelectedId} />} />
              <Route path="/account" element={<Details marketplace={marketDetails.marketplace} web3={marketDetails.web3} />} />
              <Route path={"/listing"} element={<SingleListing id={selectedId} marketplace={marketDetails.marketplace} />} />
            </Routes>
          </header>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;

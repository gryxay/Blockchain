import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Link } from 'react-router-dom';
import contract from './FurnitureMarketplace.json';
import Header from './Components/Header';
import './Components/FrontPage.css';

const contractABI = contract.abi;
const contractAddress = '0xe931D73804F1f1078Cca29C0fd81f13BcF1D6F6A';
const ganacheUrl = 'http://127.0.0.1:7545';

const FrontPage = ({ setUser, setMarketDetails, setSelectedId }) => {
  const [userAddress, setUserAddress] = useState('');
  const [furnitureList, setFurnitureList] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [marketplace, setMarketplace] = useState(null);
  const [fetchFurniture, setFetchFurniture] = useState(0);

  useEffect(() => {
    setUser(userAddress);
  }, [userAddress, furnitureList, setUser]);

  useEffect(() => {
    if (web3 && marketplace) {
      setMarketDetails({web3: web3, marketplace: marketplace});
    }
  }, [web3, marketplace, setMarketDetails])

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3Instance = new Web3(new Web3.providers.HttpProvider(ganacheUrl));
        setWeb3(web3Instance);

        setUserAddress(window.ethereum.selectedAddress);

        // Initialize the Marketplace contract
        const Marketplace = new web3Instance.eth.Contract(contractABI, contractAddress);
        setMarketplace(Marketplace);
      } catch (error) {
        console.error('Error initializing Web3:', error);
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (web3 && marketplace) {
          const furnitureCount = await marketplace.methods.id.call().call();
          const furnitureData = [];

          for (let i = 0; i < furnitureCount; i++) {
            const furniture = await marketplace.methods.furnitureList(i).call();
            if (furniture.active) {
              furnitureData.push(furniture);
            }
          }

          setFurnitureList(furnitureData);
        }
      } catch (error) {
        console.error('Error fetching furniture data:', error);
      }
    };

    fetchData();
  }, [web3, marketplace, userAddress, fetchFurniture]);

  // Refreshes main page every 5 seconds to check for new furniture
  const incrementFetchFurniture = () => {
    setTimeout(() => {
      setFetchFurniture(fetchFurniture + 1);
    }, 5000);
  }

  return (
    <>
      {
        userAddress !== null &&
        <Header web3={web3} marketplace={marketplace} incrementFetchFurniture={incrementFetchFurniture} home={false} userFurniture={true} createFurniture={true} />
      }
      {
        userAddress === null &&
        <Header web3={web3} marketplace={marketplace} incrementFetchFurniture={incrementFetchFurniture} home={false} userFurniture={false} createFurniture={false} />
      }
      <div id="main-page">
        <h1>Furniture Marketplace</h1>
        <div>
          <ul>
            {furnitureList.map((furniture) => (
              <li key={furniture.id}>
                <strong>Name: </strong>
                <Link to={"/listing"} onClick={() => (setSelectedId(furniture.id))}  className="styled-link">
                  {furniture.name}<br />
                </Link>
                <strong>Price:</strong> {Number(furniture.price)} wei<br />
                <hr />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default FrontPage;

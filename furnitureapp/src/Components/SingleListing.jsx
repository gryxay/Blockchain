import React, { useState, useEffect } from "react";
import Header from "./Header";

const SingleListing = ({ id, marketplace }) => {
  const [furniture, setFurniture] = useState(null);
  const [user, setUser] = useState(window.ethereum.selectedAddress);
  const [buying, setBuying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hideButton, setHideButton] = useState(false);

  useEffect(() => {
    const fetchFurnitureItem = async () => {
      try {
        if (id !== -1) {
          const item = await marketplace.methods.furnitureList(id).call();
          setFurniture(item);
        }
      } catch (error) {
        console.error('Error fetching furniture item:', error);
      }
    };

    fetchFurnitureItem();
  }, [id, marketplace]);

  const buyFurnitureItem = async () => {
    setBuying(true);

    try {
      await marketplace.methods.transferFurniture(id, user).send({ from: user, value: furniture.price, gas: 1000000 });
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setHideButton(true);
      }, 1000);
    } catch (error) {
      console.error('Error buying furniture:', error);
    } finally {
      setBuying(false);
    }
  };

  return (
    <>
      <Header loggedIn={true} home={true} userFurniture={true} createFurniture={false} />
      <div>
        {id === -1 ? (
          <div>Loading...</div>
        ) : (
          <div style={{ marginBottom: "35vh" }}>
            <ul style={{ listStylePosition: 'inside', paddingLeft: '0' }}>
              <li><strong>Name:</strong> {furniture?.name}</li>
              <li><strong>Condition:</strong> {furniture?.condition}</li>
              <li><strong>Owner:</strong> {furniture?.ownerAddress}</li>
              <li><strong>Price:</strong> {Number(furniture?.price)} wei</li>
            </ul>
            <hr />
            {furniture && Number(furniture.ownerAddress) !== Number(user) && !hideButton && (
              <button className="styled-button" onClick={() => buyFurnitureItem()} disabled={buying}>
                {buying ? 'Buying...' : success ? 'Success!' : 'Buy'}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SingleListing;

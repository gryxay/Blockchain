  import React, { useState, useEffect } from 'react';
  import Header from './Header';
  import './Header.css';

  const Details = ({ marketplace, web3 }) => {
    const [userFurniture, setUserFurniture] = useState({});
    const [user, setUser] = useState(window.ethereum.selectedAddress)

    useEffect(() => {
      const fetchData = async () => {
        try {
          if (web3 && marketplace && user) {
            const furnitureCount = await marketplace.methods.id.call().call();
            const furnitureData = [];

            for (let i = 0; i < furnitureCount; i++) {
              const furniture = await marketplace.methods.furnitureList(i).call();
              if (Number(furniture.ownerAddress) === Number(user)) {
                furnitureData.push(furniture);
              }
            }

            setUserFurniture(furnitureData);
          }
        } catch (error) {
          console.error('Error fetching furniture data:', error);
        }
      }

      fetchData();
    }, [web3, marketplace, user])

    const handleEditClick = (index) => {
      setUserFurniture((prevFurniture) => {
        const updatedFurniture = [...prevFurniture];
        updatedFurniture[index].isEditing = true;
        return updatedFurniture;
      });
    };

    const handleUpdateClick = async (index, id, newName, newCondition, newPrice) => {
      setUserFurniture((prevFurniture) => {
        const updatedFurniture = [...prevFurniture];
        updatedFurniture[index].isUpdating = true;
        return updatedFurniture;
      });
    
      try {
        if (marketplace && web3) {
          // Validate inputs before updating
          if (newName.length > 0 && newCondition.length > 0 && newPrice.toString().length > 0) {
            await marketplace.methods.updateFurniture(id, newName, newCondition, Number(newPrice)).send({ from: user, gas: 1000000 });
          }
    
          setUserFurniture((prevFurniture) => {
            const updatedFurniture = [...prevFurniture];
            updatedFurniture[index].name = newName;
            updatedFurniture[index].condition = newCondition;
            updatedFurniture[index].price = newPrice;
            updatedFurniture[index].isEditing = false;
            updatedFurniture[index].isUpdating = false;
            return updatedFurniture;
          });
        } else {
          console.error('Marketplace or Web3 not available');
        }
      } catch (error) {
        console.error('Error updating furniture:', error);
      }
    };
    

    const handleCancelEditClick = (index) => {
      setUserFurniture((prevFurniture) => {
        const updatedFurniture = [...prevFurniture];
        const originalFurniture = userFurniture[index];
        
        if (
          originalFurniture.isEditing &&
          (originalFurniture.name.length > 0 && originalFurniture.condition.length > 0 && originalFurniture.price.toString().length > 0)
        ) {
          updatedFurniture[index].isEditing = false;
          updatedFurniture[index].isUpdating = false;
        }
    
        return updatedFurniture;
      });
    };
    

    const handleDeleteClick = async (index, id) => {
      setUserFurniture((prevFurniture) => {
        const updatedFurniture = [...prevFurniture];
        updatedFurniture[index].isDeleting = true;
        return updatedFurniture;
      });

      try {
        if (marketplace && web3) {
          await marketplace.methods.deleteFurniture(id, user).send({ from: user, gas: 1000000 });

          setUserFurniture((prevFurniture) => {
            const updatedFurniture = [...prevFurniture];
            updatedFurniture.splice(index, 1);
            return updatedFurniture;
          });
        } else {
          console.error('Marketplace or Web3 not available');
        }
      } catch (error) {
        console.error('Error deleting furniture:', error);
      }
    };

    return (
      <>
        <Header loggedIn={true} home={true} userFurniture={false} createFurniture={true} />
        <div style={{ marginBottom: "auto" }}>
          {userFurniture.length > 0 ? (
            <ul>
              {userFurniture.map((furniture, index) => (
                <li key={furniture.id}>
                  <strong>Name:</strong> {furniture.isEditing ? (
                    <input
                      type="text"
                      value={furniture.name}
                      onChange={(e) => setUserFurniture((prevFurniture) => {
                        const updatedFurniture = [...prevFurniture];
                        updatedFurniture[index].name = e.target.value;
                        return updatedFurniture;
                      })}
                    />
                  ) : (
                    furniture.name
                  )}
                  <br />
                  <strong>Condition:</strong> {furniture.isEditing ? (
                    <input
                      type="text"
                      value={furniture.condition}
                      onChange={(e) => setUserFurniture((prevFurniture) => {
                        const updatedFurniture = [...prevFurniture];
                        updatedFurniture[index].condition = e.target.value;
                        return updatedFurniture;
                      })}
                    />
                  ) : (
                    furniture.condition
                  )}
                  <br />
                  <strong>Price:</strong> {furniture.isEditing ? (
                    <input
                      type="text"
                      value={furniture.price.toString()}
                      onChange={(e) => setUserFurniture((prevFurniture) => {
                        const updatedFurniture = [...prevFurniture];
                        updatedFurniture[index].price = e.target.value.toString();
                        return updatedFurniture;
                      })}
                    />
                  ) : (
                    `${furniture.price.toString()} wei`
                  )}
                  <br />
                  {furniture.isEditing ? (
                    <>
                      <button
                        className='styled-button'
                        style={{ height: '40px', margin: '8px 4px 8px 0px' }}
                        onClick={() => handleUpdateClick(index, furniture.id, furniture.name, furniture.condition, furniture.price)}
                        disabled={furniture.isUpdating}
                      >
                        {furniture.isUpdating ? 'Updating...' : 'Update item'}
                      </button>
                      <button
                        className='styled-button'
                        style={{ height: '40px', margin: '8px 0px 8px 4px' }}
                        onClick={() => handleCancelEditClick(index)}
                        disabled={furniture.isUpdating}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className='styled-button'
                        style={{ height: '40px', margin: '8px 4px 8px 0px' }}
                        onClick={() => handleEditClick(index)}
                        disabled={furniture.isDeleting || furniture.isUpdating}
                      >
                        {furniture.isDeleting ? 'Deleting...' : 'Edit item'}
                      </button>
                      <button
                        className='styled-button'
                        style={{ height: '40px', margin: '8px 0px 8px 4px' }}
                        onClick={() => handleDeleteClick(index, furniture.id)}
                        disabled={furniture.isDeleting || furniture.isUpdating}
                      >
                        {furniture.isDeleting ? 'Deleting...' : 'Delete item'}
                      </button>
                    </>
                  )}
                  <hr />
                </li>
              ))}
            </ul>
          ) : (
            <h1>You have no furniture</h1>
          )}
        </div>
      </>
    );
  };

  export default Details;

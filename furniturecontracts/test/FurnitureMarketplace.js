const Marketplace = artifacts.require('FurnitureMarketplace');

contract('Marketplace', (accounts) => {
    let marketplace;
    let furnitureName = 'Desk';
    let furniturePrice = 10;
    let furnitureCondition = 'Good';
    let furnitureItem;

    before(async () => {
        marketplace = await Marketplace.deployed();
        await marketplace.createFurniture(furnitureName, furnitureCondition, furniturePrice);

        furnitureItem = await marketplace.furnitureList.call(3);
    });


    describe('Create furniture', () => {
        it('Creates furniture', () => {
            assert.equal(furnitureItem.name, furnitureName, 'Incorrect item name');
            assert.equal(furnitureItem.price, furniturePrice, 'Incorrect item price');
            assert.equal(furnitureItem.ownerAddress, accounts[0], 'Incorrect owner address');
        });
    });

    describe('Update furniture', () => {
        it('Updates furniture details', async () => {
            let newName = 'Updated Desk';
            let newPrice = 20;
            let newCondition = 'New';

            await marketplace.updateFurniture(3, newName, newCondition, newPrice);

            let updatedFurniture = await marketplace.furnitureList.call(3);

            assert.equal(updatedFurniture.name, newName, 'Incorrect updated item name');
            assert.equal(updatedFurniture.price, newPrice, 'Incorrect updated item price');
            assert.equal(updatedFurniture.ownerAddress, accounts[0], 'Incorrect owner address');
        });
    });

    describe('Delete furniture', () => {
        it('Deletes furniture with owner address provided', async () => {
            await marketplace.deleteFurniture(3, accounts[0]);

            let deletedFurniture = await marketplace.furnitureList.call(3);
    
            assert.isFalse((!'id' in deletedFurniture), 'Furniture should be deleted');
        });
    
        it('Fails to delete furniture if owner address not provided', async () => {
            let errorOccurred = false;
    
            try {
                await marketplace.deleteFurniture(3);
            } catch (error) {
                errorOccurred = true;
            }
    
            assert.isTrue(errorOccurred, 'Deletion should fail if owner address not provided');
        });
    });
});

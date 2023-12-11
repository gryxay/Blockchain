pragma solidity ^0.8.13;

contract FurnitureMarketplace {
    struct Furniture {
        uint256 id;
        string name;
        string condition;
        address ownerAddress;
        uint256 price;
        bool active;
    }

    uint256 public id = 3;

    mapping(uint256 => Furniture) public furnitureList;

    event FurnitureCreated(uint256 id, string name, string condition, address ownerAddress, uint256 price, bool active);
    event FurnitureUpdated(uint256 id, string name, string condition, uint256 price);
    event FurnitureTransferred(uint256 id, address from, address to);
    event FurnitureDeleted(uint256 id);

    // Inject starter data into blockchain
    constructor() {
        furnitureList[0] = Furniture(0, "1900s authentic vintage desk", "New", msg.sender, 100000000000000000, true);
        furnitureList[1] = Furniture(1, "1880s vintage chandelier", "Fair", msg.sender, 250000000000000000, true);
        furnitureList[2] = Furniture(2, "IKEA bed frame", "New", msg.sender, 13000000000000000, true);
    }

    // Create new furniture item
    function createFurniture(string memory _name, string memory _condition, uint256 _price) external {
        Furniture memory newFurniture = Furniture({
            id: id,
            name: _name,
            condition: _condition,
            ownerAddress: msg.sender,
            price: _price,
            active: true    // furniture is active by default
        });

        furnitureList[id] = newFurniture;

        emit FurnitureCreated(id, _name, _condition, msg.sender, _price, true);
        id++;
    }

    // Update furniture item details
    function updateFurniture(uint256 _id, string memory _name, string memory _condition, uint256 _price) external {
        Furniture storage furniture = furnitureList[_id];
        require(msg.sender == furniture.ownerAddress, "You are not the owner of this furniture");

        furniture.name = _name;
        furniture.condition = _condition;
        furniture.price = _price;

        emit FurnitureUpdated(_id, _name, _condition, _price);
    }

    // Transfer furniture item to another user
    function transferFurniture(uint256 _id, address payable _to) external payable {
        Furniture storage furniture = furnitureList[_id];
        require(msg.value == furniture.price, "Incorrect payment amount");

        furniture.ownerAddress = _to;

        address payable previousOwner = payable(msg.sender);
        previousOwner.transfer(msg.value);

        emit FurnitureTransferred(_id, msg.sender, _to);
    }

    // Delete user's created furniture
    function deleteFurniture(uint256 _id, address _owner) external {
        Furniture storage furniture = furnitureList[_id];
        
        address owner = (_owner == address(0)) ? msg.sender : _owner;

        require(owner == furniture.ownerAddress, "You are not the owner of this furniture");

        // Label item as inactive = logical delete
        furnitureList[_id].active = false;

        delete furnitureList[_id];

        emit FurnitureDeleted(_id);
    }
}

pragma solidity ^0.4.25;

contract Lottery {
    
    address public manager;
    address[] public players;
    
    constructor() public {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .01 ether, "Insufficient funds to allow transfer");
        
        players.push(msg.sender);
    }
    
    function random() private view returns(uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, block.number, players)));
    }
    
    function pickWinner() public restricted {
        
        //require(msg.sender == manager); // sadece manager kazananı seçebilir. modifier fonksiyonun gelmesiyle kalkacak.
        
        uint256 index = random() % players.length;
        
        players[index].transfer(address(this).balance);
        
        players = new address[](0); // 0 elemanlı new dynamic array yapıyoruz 'ki oyun 0 dan başlayabilsin.
    }
    
    modifier restricted(){
        require(msg.sender == manager, "Insufficient funds to allow transfer");  // sadece manager kazananı seçebilir
        _;
    }
    
    function getPlayers() public view returns(address[]){
        return players;
    }
}
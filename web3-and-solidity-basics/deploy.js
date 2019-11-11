const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
  
const provider = new HDWalletProvider(
    'six project birth wise window blame gallery impulse recipe change lumber filter',
    'https://ropsten.infura.io/v3/741b62b06288435e856e8567767a3a5b'
);

const web3 = new Web3(provider);

const deploy = async () => {
        const accounts = await web3.eth.getAccounts();
        console.log('Attempting to deploy from account ', accounts[0]);
    
        const result = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({ data : bytecode })
            .send({ gas : '1000000', from : accounts[0] });
    
        console.log(interface);
        console.log('contract deployed to ', result.options.address);
   
}

deploy();

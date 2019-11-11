
const ganache = require('ganache-cli');
const assert = require('assert');
const { interface, bytecode } = require('../compile');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

let accounts;
let lottery;

beforeEach( async () => {

    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data : bytecode })
        .send({ from : accounts[0], gas : '1000000'});

});

describe ('Lottery', () => {
    it('deploying control', () => {
        assert.ok(lottery.options.address);
    });

    it('deploy players to one accounts', async () => {
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({ from : accounts[0]});

        assert.equal( accounts[0], players[0] );
        assert.equal( 1, players.length );
    }); 


    it('deploy players multiple accounts', async () => {
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from : accounts[1],
            value : web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from : accounts[2],
            value : web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({ from : accounts[0]});

        assert.equal( accounts[0], players[0] );
        assert.equal( accounts[1], players[1] );
        assert.equal( accounts[2], players[2] );
        assert.equal( 3, players.length );
    }); 


    it('set a mininmum amount to enter', async () => {
       try {
           await lottery.methods.enter().send({
           from : accounts[0], 
           value : 0
       });
       assert(false);
    } catch(err) {
        assert(err);
    }
    });

    it('only manager pick a winner', async () => {
        try {
            await lottery.methods.pickWinner().send({
            from : accounts[1]
        });
        assert(false);
    } catch (err) {
        assert(err)
    }
    });

    
    it('send money to the winner and reset players array', async () => {
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('2', 'ether')
        });
        
        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({ from : accounts[0] });
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;

        assert(difference > web3.utils.toWei('1.8', 'ether'));

    });

});


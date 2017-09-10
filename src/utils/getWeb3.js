import Web3 from 'web3';
import contract from 'truffle-contract';
import PortfolioContract from './Portfolio.json';

const contractAddress = '0x6532Fc9c95A622A504e5bB4539eC159970b3abF3';

const getWeb3 = new Promise((resolve) => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', () => {
    let results;
    let web3 = window.web3;
    const provider = new Web3.providers.HttpProvider('http://localhost:8545');

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider);

      instantiateContract(web3).then((ret) => {
        results = {
          web3,
          contract: ret.contract,
          account: ret.account,
          instance: ret.instance,
        };
        console.log('Injected web3 detected.');

        resolve(results);
      });
    } else {
      // Fallback to localhost if no web3 injection.
      web3 = new Web3(provider);

      instantiateContract(web3).then((ret) => {
        results = {
          web3,
          contract: ret.contract,
          account: ret.account,
          instance: ret.instance,
        };
        console.log('No web3 instance injected, using Local web3.');

        resolve(results);
      });
    }
  });
});

let instantiateContract = function (web3) {
  return new Promise((resolve, reject) => {
    let results;
    const portfolio = contract(PortfolioContract);
    portfolio.setProvider(web3.currentProvider);

    web3.eth.getAccounts((error, accounts) => {
      if (error) {
        reject(error);
      }
      portfolio.at(contractAddress).then((instance) => {
        results = {
          contract: portfolio,
          account: accounts[0],
          instance,
        };
        resolve(results);
      });
    });
  });
};

export default getWeb3;

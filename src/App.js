import './App.css';
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import AccountInfo from './components/AccountInfo';
import ContractInfo from './components/ContractInfo';

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [chain, setChain] = useState({ id: null, name: null })
  const [balance, setBalance] = useState(0)
  const [contract, setContract] = useState(null)

  useEffect(()=> {
    let defaultProvider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/3117e0728b2740d5b5de2782abe77488')
    setSimpleStorageContract(defaultProvider)

    if(window.ethereum) {
      connectMetamask()
    }
  }, [])

  const setWeb3 = async () => {
    console.log('Setting web3...')

    let tmpProvider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = tmpProvider.getSigner()
    const address = await signer.getAddress()

    let chain = await tmpProvider.getNetwork()
    
    setIsConnected(true)
    setAccount(address)
    setProvider(tmpProvider)
    setChain({ id: chain.chainId, name: chain.name })

    updateBalance(tmpProvider, address)
    setSimpleStorageContract(signer)
  }

  const connectMetamask = () => {
    console.log('Connecting to metamask')

    if (window.ethereum) {
      console.log('Metamask found! Waiting for user...')

      window.ethereum.enable().then(async () => {
        console.log('User accepted request to connect')

        await setWeb3()

        window.ethereum.on('accountsChanged', (accounts) => {
          console.log('New account selected ', accounts[0])
          if (!accounts[0]) {
            disconnectWallet()
          } else {
            setAccount(accounts[0])
            updateBalance(provider, accounts[0])
          }
        })

        window.ethereum.on('chainChanged', async (id) => {
          console.log('chain changed', id)
          setWeb3()
        })
      })
    } else {
      console.log('Metamask not found')
      window.alert('Please install metamask')
    }
  }

  const updateBalance = async (provider, account) => {
    console.log('Updating balance... ')
    let balance = (await provider.getBalance(account)).toString()
  
    setBalance(ethers.utils.formatEther(balance))
}


  const setSimpleStorageContract = async (provider) => {
    const address = '0x6DA2cDD38526224ac8A9Ba194a01d59d32817212'
    const abi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newNumber", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "user", "type": "address" }], "name": "NumberUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "oldOwner", "type": "address" }, { "indexed": false, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnerUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "ReceivedEthereum", "type": "event" }, { "stateMutability": "payable", "type": "fallback" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "changeOwner", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "get", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getOwner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "num", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_num", "type": "uint256" }], "name": "set", "outputs": [], "stateMutability": "payable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]
    
    const contract = new ethers.Contract(address, abi, provider);
    console.log('contract', contract);
    
    setContract(contract)
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAccount(null)
    setProvider(null)
    setChain({ id: null, name: null })
  }

  return (
    <div className="App">
      <header className="App-header">

        {isConnected === true ? '' : <button onClick={connectMetamask}>Connect Metamask</button>}

        {isConnected ?
          <div>
            <AccountInfo account={account} provider={provider} chain={chain} balance={balance}></AccountInfo>
            <button onClick={disconnectWallet}>Disconnect Wallet</button>
          </div>
          : ''}

        {contract ? <ContractInfo contract={contract}></ContractInfo> : 'No contract'}

      </header>
    </div>
  );
}

export default App;

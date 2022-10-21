import './App.css';
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import AccountInfo from './AccountInfo';

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [chain, setChain] = useState({ id: null, name: null })

  useEffect(()=> {
    if(window.ethereum) {
      connectMetamask()
    }
  }, [])

  const setWeb3 = async () => {
    let tmpProvider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = tmpProvider.getSigner()
    const address = await signer.getAddress()

    let chain = await tmpProvider.getNetwork()
    console.log('chain', chain)
    setIsConnected(true)
    setAccount(address)
    setProvider(tmpProvider)
    setChain({ id: chain.chainId, name: chain.name })

  }

  const connectMetamask = () => {
    console.log('Connecting to metamask')

    if (window.ethereum) {
      console.log('Metamask found!')

      let tmpProvider
      window.ethereum.enable().then(async (accounts) => {
        console.log('waiting to initialize provider')

        await setWeb3()

        window.ethereum.on('accountsChanged', (accounts) => {
          console.log('New account selected ', accounts[0])
          if (!accounts[0]) {
            disconnectWallet()
          } else {
            setAccount(accounts[0])
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
            <AccountInfo account={account} provider={provider} chain={chain}></AccountInfo>
            <button onClick={disconnectWallet}>Disconnect Wallet</button>
          </div>
          : ''}
      </header>
    </div>
  );
}

export default App;

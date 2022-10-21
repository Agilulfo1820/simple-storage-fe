import './App.css';
import {useState} from 'react'
import {ethers} from 'ethers'
import AccountInfo from './AccountInfo';

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)

  const connectMetamask = () => {
    console.log('Connecting to metamask')

    if (window.ethereum) {
      console.log('Metamask found!')

      let tmpProvider
      window.ethereum.enable().then(async (accounts) => {
          console.log('waiting to initialize provider')

          tmpProvider = new ethers.providers.Web3Provider(window.ethereum)

          setIsConnected(true)
          setAccount(accounts[0])
          setProvider(tmpProvider)
      })
  } else {
      console.log('Metamask not found')
      window.alert('Please install metamask')
  }
  }

  return (
    <div className="App">
      <header className="App-header">

        {isConnected === true ? '' : <button onClick={connectMetamask}>Connect Metamask</button>}

        {isConnected ? <AccountInfo account={account} provider={provider}></AccountInfo> : ''}
      </header>
    </div>
  );
}

export default App;

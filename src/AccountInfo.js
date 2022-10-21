import {useState, useEffect} from 'react'

function AccountInfo({account, provider}) {
    const [networkName, setNetworkName] = useState(null)

    useEffect(()=> {
        getConnectedChain()
    }, [])

    const getConnectedChain = async () => {
        if (provider) {
            let chain = await provider.getNetwork()
            setNetworkName(chain.name)
        }
    }

    return (
        <div>
            <p>Connected to {account}</p>
            <p>Chain: {networkName}</p>
        </div>
    )
}

export default AccountInfo
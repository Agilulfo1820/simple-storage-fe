import { useState, useEffect } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import {ethers} from 'ethers'

function AccountInfo({ account, chain, provider, balance}) {
    const abbreviateAddress = (account) => {
        if (!account)
            return ''

        return account.slice(0, 6) + '...' + account.slice(account.length - 4, account.length)
    }

    const addGoerliToMetamask = async () => {
        const provider = await detectEthereumProvider()

        provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x5' }]
        }).then((res) => {
            console.log(res)
        })
    }

    return (
        <div>
            <p>Connected to {abbreviateAddress(account)}</p>
            {chain.id === 5 || chain.id === '0x5' ? <p>Chain: {chain.name}</p> :
                <div>
                    <h5>Wrong network: please connect to Goerli!</h5>
                    <h6>Click <a style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }} onClick={addGoerliToMetamask}>here</a> to add Goerli to your Metamask.</h6>
                </div>}
            <p>Balance: {balance} goeETH</p>
        </div>
    )
}

export default AccountInfo
import {useState, useEffect} from 'react'

function AccountInfo({account, chain, provider}) {
    const abbreviateAddress = (account) => {
        if (!account)
            return ''

        return account.slice(0, 6) + '...' + account.slice(account.length - 4, account.length)
    }

    return (
        <div>
            <p>Connected to {abbreviateAddress(account)}</p>
            {chain.id === 5 || chain.id === '0x5' ? <p>Chain: {chain.name}</p> : <p>Wrong network: please connect to Goerli</p>}
        </div>
    )
}

export default AccountInfo
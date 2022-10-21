import { useState, useEffect } from 'react'
import {ethers} from 'ethers'

function ContractInfo({ contract }) {

    const [number, setNumber] = useState(null)

    useEffect(() => {
        getNumber()
    }, [])

    const getNumber = async () => {
        console.log('getNumber', contract);
        if (contract) {
            let number = await contract.get()
            setNumber(number.toString())
        }
    }
    return (
        <div>
            <p>The number is: {number || 'Loading...'}</p>
        </div>
    )
}

export default ContractInfo
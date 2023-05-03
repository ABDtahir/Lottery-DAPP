import React from 'react'
import Image from 'next/image'
import { ConnectWallet} from "@thirdweb-dev/react";

function Login() {
  return (
    <div className='bg-[#3b513d] min-h-screen flex flex-col
    items-center justify-center text-center'>

        <h1 className='text-6xl text-white font-bold py-5'>THE LOTTERY ARENA</h1>

        <h2 className='text-white py-5'>Get Started by connecting your MetaMask</h2>
        <ConnectWallet btnTitle="Connect Wallet" />
    </div>
  )
}

export default Login
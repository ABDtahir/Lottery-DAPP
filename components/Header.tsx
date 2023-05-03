import React from 'react'
import NavButton from './NavButton';
import { Bars3BottomRightIcon} from "@heroicons/react/24/solid";
import { ConnectWallet , useDisconnect} from "@thirdweb-dev/react";

function Header() {
    const disconnect = useDisconnect();
  return (
    <div className='grid grid-cols-2 md:grid-cols-5 justify-between
    items-center p-5'>
        <div className='flex items-center space-x-2'>
            {/* <div>
                <h1 className='text-lg text-emerald-500'>Current User ...</h1>
            </div> */}
            <ConnectWallet btnTitle="Connect Wallet" />
        </div>

        <div className='hidden md:flex md:col-span-3 items-center justify-center rounded-md'>
            <div className='bg-[#0A1F1C] p-4 space-x-2'>
                <NavButton isActive title='Buy Tickets'/>
                <NavButton onClick = {disconnect} title='Logout'/>
            </div>
        </div>

        <div className='flex flex-col ml-auto text-right'>
            <Bars3BottomRightIcon className='h-8 w-8 mx-auto text-white cursor-pointer' />
            <span className='md:hidden'>
                <NavButton onClick = {disconnect} title='Logout'/>
            </span>
        </div>
    </div>
  )
}

export default Header;
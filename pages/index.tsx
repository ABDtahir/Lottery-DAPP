import Header from '@/components/Header'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useAddress , useContractRead , useContract , useContractWrite } from "@thirdweb-dev/react";
import Login from '@/components/Login';
import { useState } from 'react';
import { ethers } from 'ethers';
import toast from "react-hot-toast";

export default function Home() {
  const myaddress = useAddress();
  const [quantity , setQuantity] = useState<number>(1);
  const { contract , isLoading } = useContract("0x04e3f476d6b4972f04BA070552f9d1DD1eE3653d");
  console.log("my address:- ", myaddress);
  const { data: remainingTickets} = useContractRead(
  contract, "RemainingTickets" );
  const { data: currentWinning} = useContractRead(
  contract, "CurrentWinningReward");
  const { data: ticketPrice} = useContractRead(
  contract, "ticketPrice");
  const { data: ticketCommission} = useContractRead(
  contract, "ticketCommission");

  const handleClick = async () => {
    if(!ticketPrice) return;

    const notification = toast.loading("Buying your tickets...");

    try{
      const data = await contract.call('BuyTickets', "",{ value: ethers.utils.parseEther((Number(ethers.utils.formatEther(ticketPrice)) * quantity ).toString())});
      
      toast.success("Ticket Purchased sucessfully!", {
        id: notification,
      });
      console.info("contract call successs", data);
    } catch(err) {
      toast.error("Ticket Purchase Failed!", {
        id: notification,
      });
      console.error("contract call failure", err);
    }
  }

  if(!myaddress) return (<Login />);
  return (
    <div className='bg-[#091B1B] min-h-screen flex flex-col'>
    <Head>
      <title>
        Lottery DAPP
      </title>
    </Head> 
    <Header />

    {/* The next draw box  */}
    <div className='space-y-5 md:space-y-0 m-5 md:flex md:flex-row 
    items-start justify-center md:space-x-5'>
      <div className='stats-container'>
        <h1 className='text-5xl text-white font-semibold text-center'>The Next Draw</h1>
        {/*The price per ticket box*/}
        <div className='flex justify-between p-2 space-x-2'>
          <div className='stats'>
            <h2 className='text-sm'>Total Pool</h2>
            <p className='text-xl'>
              {currentWinning && ethers.utils.formatEther(
                currentWinning.toString()
              )}{" "}
              MATIC
            </p>
          </div>
          <div className='stats'>
            <h2 className='text-sm'>Tickets Remaining</h2>
            <p className='text-xl'>{remainingTickets?.toNumber()}</p>
          </div>
        </div>

        {/* Countdown timer */}
      </div>

      <div className='stats-container space-y-2'>
          <div className="stats-container">
            <div className='flex justify-between items-center text-white pb-2'>
              <h2 className=''>
                Price per ticket
              </h2>
              <p>
              {ticketPrice && ethers.utils.formatEther(
                ticketPrice.toString()
              )}{" "}
              MATIC
              </p>
            </div>

            <div className='flex text-white items-center space-x-2 bg-[#091B18] border-[#04382e] border p-4'>
              <p>Tickets</p>
              <input 
              className='flex w-full bg-transparent text-right outline-none'
              type = 'number'
              min={1}
              max={10} 
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              />
            </div>
            <div className='space-y-2 mt-5'>
              <div className='flex items-center justify-between text-emerald-300 text-s 
              font-extrabold italic'>
                <p>Total cost of tickets</p>
                <p>
                  {ticketPrice && Number(ethers.utils.formatEther(
                    ticketPrice.toString()
                  )) * quantity}{" "}
                  MATIC
                </p>
              </div>

              <div className='flex items-center justify-between text-emerald-300 text-xs italic'>
                <p>Service fees</p>
                <p>
                  {ticketCommission && ethers.utils.formatEther(
                    ticketCommission.toString()
                  )}{" "}
                  MATIC
                </ p>
              </div>
            </div>

            <button className='mt-5 w-full bg-gradient-to-br from-orange-500 to bg-emerald-600
            py-5 rounded-md text-white shadow-xl disabled:from-gray-600 disabled:text-gray-100 disabled:to-gray-100
            ' onClick={handleClick}>Buy Tickets</button>
          </div>
        </div>
    </div>
    </div>
  )
}

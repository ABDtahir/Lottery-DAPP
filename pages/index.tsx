import Header from '@/components/Header'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useAddress , useContractRead , useContract , useContractWrite } from "@thirdweb-dev/react";
import Login from '@/components/Login';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import toast from "react-hot-toast";
import CountdownTimer from '@/components/CountdownTimer';
import AdminControls from '@/components/AdminControls';

export default function Home() {
  const myaddress = useAddress();
  const [userTickets , setUserTickets] = useState(0);
  const [quantity , setQuantity] = useState<number>(1);
  const { contract , isLoading } = useContract("0x343190145eBF5Ad6E10181CcaCf2b2099BfBF617");
  const { data: remainingTickets} = useContractRead(
  contract, "RemainingTickets" );
  const { data: currentWinning} = useContractRead(
  contract, "CurrentWinningReward");
  const { data: ticketPrice} = useContractRead(
  contract, "ticketPrice");
  const { data: ticketCommission} = useContractRead(
  contract, "ticketCommission");
  const { data: tickets} = useContractRead(
  contract, "getTickets");
  const { data: lastWinner} = useContractRead(
  contract, "lastWinner");
  const { data: lastWinnerAmount} = useContractRead(
  contract, "lastWinnerAmount");
  const { data: winnings} = useContractRead(
  contract, "getWinningsForAddress" , [myaddress]);
  const { mutateAsync: WithdrawWinnings } = useContractWrite(contract, "WithdrawWinnings");
  const { data: expiration, isLoading: isLoadingExpiration} = useContractRead(
  contract, "expiration" );
  const { data: lotteryOperator} = useContractRead(
  contract, "lotteryOperator");
  
  
  useEffect(() => {
    if(!tickets) return;
    const totalTickets: string[] = tickets;

    const numofTickets = totalTickets.reduce(
      (total , ticketAddress) => (ticketAddress === myaddress ? total + 1 : total),
      0
    );


    setUserTickets(numofTickets);
  } , [tickets , myaddress]); 

  const handleClick = async () => {
    if(!ticketPrice) return;
    const expirationTime = new Date(expiration * 1000);
    const nowTime = new Date();
    const notification = toast.loading("Buying your tickets...");

    if(expirationTime < nowTime){
      toast.error("Ticket Sales are Closed!", {
        id: notification,
      });
      return;
    }
    
    if(userTickets === 10){
      toast.error("Ticket Limit Reached!", {
        id: notification,
      });
      return;      
    }

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

  const onWithdrawWinnings = async () => {
    const notification = toast.loading("Withdrawing winnings ...");

    try {
      const data = await WithdrawWinnings( {args: []});

      toast.success("Winnings withdrawn successfully!" , {
        id: notification,
      });

    } catch (err) {
      toast.error("Whoops Something went wrong!", {
        id: notification,
      })
    };
  }

  if(!myaddress) return (<Login />);

  return (
    <div className='bg-[#091B1B] min-h-screen flex flex-col'>
    <Head>
      <title>
        Lottery DAPP
      </title>
    </Head> 

    <div className='flex-1'>
      <Header />

      {winnings > 0 && (
        <div className='max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5'>
          <button onClick={onWithdrawWinnings} className='p-5 bg-gradient-to-b from-orange-600 to bg-emerald-700 animate-bounce text-center rounded-xl w-full text-black'>
            <p className='font-bold'>Congratulations You Won The Lottery</p>
            <p>Total Winnings: {ethers.utils.formatEther(
                  winnings.toString()
                )}{" "}
                MATIC
            </p>
            <br />
            <p className='font-semibold'>Click here to withdraw</p>
          </button>
        </div>
      )}

      <div className='bg-[#0A1F1C] p-5  flex justify-between mx-10 text-orange-400 animate-pulse'>
        <h4 className='font-bold'>Previous Winnings:{" "} 
        {lastWinnerAmount && ethers.utils.formatEther(
            lastWinnerAmount.toString()
        )}{" "}
        MATIC
        </h4>
        <h4 className='font-bold'>Last Winner: {lastWinner?.toString()}</h4>
      </div>

      {lotteryOperator == myaddress && (
        <div className='flex justify-center'>
            <AdminControls />
        </div>
      )}


      {/* The next draw box  */}
      <div className='space-y-5 md:space-y-0 m-5 md:flex md:flex-row 
      items-start justify-center md:space-x-5'>
        <div className='stats-container'>
          <h1 className='text-5xl text-white font-semibold text-center mb-5'>The Next Lottery</h1>
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
          <div className='mt-5 mb-3'>
                <CountdownTimer />
          </div>
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

              <button className='mt-5 w-full bg-gradient-to-br font-semibold from-orange-500 to bg-emerald-600
              py-5 rounded-md text-white shadow-xl disabled:from-gray-600 disabled:text-gray-100 disabled:to-gray-100
              ' onClick={handleClick}>Buy Tickets</button>
            </div>
            
            {userTickets > 0 && (
              <div className='stats'>
                <p className='text-lg mb-3'>You have {userTickets} Tickets in this Lottery </p>

                <div className='flex max-w-sm  gap-x-5 gap-y-2'>
                  {Array(userTickets).fill("").map((_, index) => (
                    <p key={index} 
                    className='text-emerald-300 h-20 w-12 bg-emerald-500/30 
                    rounded-lg flex flex-shrink-0 items-center justify-center text-xl italic'> {index + 1} </p>
                  ))}
                </div>
              </div>
            )}
          </div>
      </div>
    </div>

    </div>
  )
}

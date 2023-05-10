import { ArrowPathIcon, ArrowUturnDownIcon, CurrencyDollarIcon, StarIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { useContractRead , useContract ,useContractWrite} from "@thirdweb-dev/react";
import { ethers } from 'ethers';
import toast from "react-hot-toast";

function AdminControls() {
    const { contract , isLoading } = useContract("0x343190145eBF5Ad6E10181CcaCf2b2099BfBF617");
    const { data: Commission} = useContractRead(
    contract, "operatorTotalCommission" );
    const { data: expiration, isLoading: isLoadingExpiration} = useContractRead(
    contract, "expiration" );
    const { mutateAsync: DrawWinnerTicket} = useContractWrite(contract, "DrawWinnerTicket");
    const { mutateAsync: WithdrawCommission } = useContractWrite(contract, "WithdrawCommission");
    const { mutateAsync: restartDraw } = useContractWrite(contract, "restartDraw");
    const { mutateAsync: RefundAll } = useContractWrite(contract, "RefundAll");

    const clickDrawWinner = async () => {
        const notification = toast.loading("Picking a Lucky Winner ...");
    
        try {
          const data = await DrawWinnerTicket( {args: []});
          toast.success("Winner Selected Successfully!" , {
            id: notification,
          });
    
        } catch (err) {
          toast.error("Whoops Something went wrong!", {
            id: notification,
          })
          console.log("Contract Call Failure: ", err);
        };
      }

      const clickWithdrawCommission = async () => {
        const notification = toast.loading("Withdrawing Commission ...");
    
        try {
          const data = await WithdrawCommission( {args: []});
          toast.success("Withdraw Successfully!" , {
            id: notification,
          });
    
        } catch (err) {
          toast.error("Whoops Something went wrong!", {
            id: notification,
          })
          console.log("Contract Call Failure: ", err);
        };
      }

      const clickRestartDraw = async () => {
        const notification = toast.loading("Restart Lottery ...");
    
        try {
          const data = await restartDraw( {args: []});
          toast.success("Lottery Restarted" , {
            id: notification,
          });
    
        } catch (err) {
          toast.error("Whoops Something went wrong!", {
            id: notification,
          })
          console.log("Contract Call Failure: ", err);
        };
      }

      const clickRefundAll = async () => {
        const expirationTime = new Date(expiration * 1000);
        const nowTime = new Date();

        const notification = toast.loading("Refunding Tickets ...");
        if(expirationTime >= nowTime){
        toast.error("Lottery Not Expired Yet!", {
            id: notification,
        });
        return;
        }    
        try {
          const data = await RefundAll( {args: []});
          toast.success("Refund Successfull!" , {
            id: notification,
          });
    
        } catch (err) {
          toast.error("Whoops Something went wrong!", {
            id: notification,
          })
          console.log("Contract Call Failure: ", err);
        };
      }

  return (
    <div className='text-white text-center mt-5 px-5 py-3 rounded-md border-emerald-300/20 border'>
        <h2 className='font-bold'>Admin Controls</h2>
        <p className='mb-5'>Total Commission to be withdrawn: {Commission && ethers.utils.formatEther(
                  Commission.toString()
                )}{" "}
                MATIC</p>
    
        <div className='flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2'>
            <button onClick={clickDrawWinner} className='admin-button'>
                <StarIcon className='h-6 mx-auto mb-2' />
                Draw Winner
            </button>
            <button onClick={clickWithdrawCommission} className='admin-button'>
                <CurrencyDollarIcon className='h-6 mx-auto mb-2' />
                Withdraw Commission
            </button>
            <button onClick={clickRestartDraw} className='admin-button'>
                <ArrowPathIcon className='h-6 mx-auto mb-2' />
                Restart Draw
            </button>
            <button onClick={clickRefundAll} className='admin-button'>
                <ArrowUturnDownIcon className='h-6 mx-auto mb-2' />
                Refund ALL
            </button>
        </div>
    </div>
  )
}

export default AdminControls
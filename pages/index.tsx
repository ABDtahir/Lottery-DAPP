import Header from '@/components/Header'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useAddress } from "@thirdweb-dev/react";
import Login from '@/components/Login';

export default function Home() {
  const myaddress = useAddress();
  console.log("my address:- ", myaddress);

  if(!myaddress) return (<Login />);
  return (
    <div className='bg-[#091B1B] min-h-screen flex flex-col'>
    <Head>
      <title>
        Lottery DAPP
      </title>
    </Head> 
    <Header />

    </div>
  )
}

"use client"
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react';
import { QrReader } from "react-qr-reader";
import { useRouter } from 'next/navigation'

import SuccessIcon from "../assets/success-line.png"
import FailedIcon from "../assets/failed-icon.png"


import axios from 'axios';

type responseAPI = {
  success: boolean,
  message: string,
  no_loker: string
}

export default function Home() {
  const [isCameraActive, setCameraActive] = useState(true);
  const [qrCodeResult, setQrCodeResult] = useState<string|null>(null);
  const [responseStatus, setResponseStatus] = useState(false);        //untuk 
  const [response, setResponse] = useState<responseAPI|null>(null);
  const [activeCard, setAcvtiveCard] = useState<boolean>(false)

const OnValidate = async (numberLoker:String) => {
    const res  =  await axios.post(`https://sprintmasters.up.railway.app/api/from-machine/`,{
      "code_loker": numberLoker
      }).then((result) => {
        return {
          error: false,
          success: result.data.success,
          message:result.data.message,
          no_loker:result.data.no_loker
        }
      }).catch((error:any)=> {
        return {
          error: true,
          success: error.response.data.success,
          message:error.response.data.message,
          no_loker:error.response.data.no_loker
        }
      })

    if(!res?.error){
      setResponse({
        success: res.success,
        message: res.message,
        no_loker: res.no_loker
      });
      setResponseStatus(true)
    } else {
      setResponse({
        success: res.success,
        message: res.message,
        no_loker: res.no_loker
      });
      setResponseStatus(true)
    }

    setAcvtiveCard(true)
  
}

  const failedCard = () => {
    return <div className='w-[400px] bg-white drop-shadow-md flex flex-col rounded-3xl relative'>
        <div className='absolute flex w-full justify-center'>
        <div className='-mt-14 relative z-0'>
              <span className="relative flex h-20 w-20">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full  bg-[#940000] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-20 w-20 bg-[#940000]"></span>
              </span>
              <Image src={FailedIcon} alt='success-icon' className=' relative z-100 h-8 w-8 -mt-14 justify-self-center mx-auto'/>
            </div>        
          </div>
        <div className="bg-[#FC2E20] px-10  py-5 rounded-t-3xl text-center">
          <p className='mt-8 text-xl text-white font-medium'>Failed To Scan</p>
        </div>
        <div className='text-center flex flex-col p-10 gap-4'>
          <p className='py-5'>{response?.message}</p>
          <button className='p-3 bg-[#F9943B] rounded-xl font-medium' onClick={handleRetry}><p>Tap To Retry!</p></button>
        </div>
    </div> 
  }

  const successCard =  () => {
      return <div className='w-[400px] bg-white drop-shadow-md flex flex-col rounded-3xl relative'>
        <div className='absolute flex w-full justify-center'>
        <div className='-mt-14 relative z-0'>
              <span className="relative flex h-20 w-20">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-20 w-20 bg-[#2C7721]"></span>
              </span>
              <Image src={SuccessIcon} alt='success-icon' className=' relative z-100 h-8 w-8 -mt-14 justify-self-center mx-auto'/>
            </div>        </div>
        <div className="bg-[#4EC33D] px-10  py-5 rounded-t-3xl text-center">
          <p className='mt-8 text-xl text-white font-medium'>Success Scan Barcode</p>
        </div>
        <div className='text-center flex flex-col p-10'>
          <p>Your Number Locker</p>
          <p className='text-[150px] font-bold'>1</p>
          <button className='p-3 bg-[#F9943B] rounded-xl font-medium' onClick={handleRetry}><p>Tap To Done</p></button>
        </div>
    </div>
  }

  const handleScan = (result:any) => {
    if (result && isCameraActive) {
      setQrCodeResult(result);
      setCameraActive(false); 
    }
  

  };

  const handleError = (error:any) => {
  };

  const handleRetry = () => {
    setAcvtiveCard(false)
    setResponseStatus(false)
    setResponse(null)
    setQrCodeResult(null);
    setCameraActive(true); 
  };


  return (
    <div className='w-screen min-h-screen flex flex-col justify-center items-center p-10'>
      {isCameraActive && (
        <div className='gap-10 flex flex-col'>
              <p className='text-center text-xl font-bold'> Scan Your QR</p>
              <div className='h-96 w-96 bg-black overflow-hidden rounded-2xl'>
              <QrReader
                scanDelay={100}
                className='scale-[1.5]'
                onResult={handleScan}
                constraints  ={{ facingMode:  "environment"  }}
                />
            </div>
        </div> 
      )}

      {qrCodeResult && !activeCard &&(

          <div className='w-[400px] bg-white drop-shadow-md flex flex-col rounded-3xl relative'>
          <div className='absolute flex w-full justify-center'>
            {/* <Image src={SuccessIcon} alt='success-icon' className='h-24 w-24 -m-16 justify-self-center'/> */}
           <div className='-mt-14 relative z-0'>
              <span className="relative flex h-20 w-20">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-20 w-20 bg-[#2A72C3]"></span>
              </span>
              <Image src={SuccessIcon} alt='success-icon' className=' relative z-100 h-8 w-8 -mt-14 justify-self-center mx-auto'/>
            </div>
          </div>
          <div className="bg-[#65ACF0] px-10  py-5 rounded-t-3xl text-center">
            <p className='mt-8 text-xl text-white font-medium'>Your Code Success to Read</p>
          </div>
          <div className='text-center flex flex-col p-10'>
            <button className='p-3 bg-[#F9943B] rounded-xl font-medium' onClick={() =>{OnValidate(qrCodeResult.text)}}><p>Tap To Open Locker</p></button>
          </div>
          </div>
      )}

      {qrCodeResult && activeCard && (
        <div>
          {response?.success && responseStatus ? successCard():failedCard()}
        </div>
      ) }
    </div>
  );
}



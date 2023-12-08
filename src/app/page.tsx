"use client"
import Image from 'next/image'
import React, { useState } from 'react';
import { QrReader } from "react-qr-reader";
import SuccessIcon from "../assets/success-icon.png"
import axios from 'axios';
import { error } from 'console';

type responseAPI = {
  success: boolean,
  message: string
}
export default function Home() {
  const [isCameraActive, setCameraActive] = useState(true);
  const [qrCodeResult, setQrCodeResult] = useState(null);
  const [responseStatus, setResponseStatus] = useState(false);        //untuk 
  const [response, setResponse] = useState<responseAPI|null>(null);
  const [activeCard, setAcvtiveCard] = useState<boolean>(false)

const OnValidate = async (numberLoker:String) => {
  try {
    const res =  await axios.post("https://sprintmasters.up.railway.app/api/from-machine/",{
      "code_loker": numberLoker
      }).then((result) => {
        return {
          error: false,
          success: result.data.success,
          message:result.data.message
        }
      })

    if(!res?.error){
      setResponseStatus(true)
      setAcvtiveCard(!activeCard);
      setResponse(res);
    } else {
      setResponseStatus(false)
    }
  } catch (error) {
    setResponseStatus(false)
  }
}

  const failedCard = () => {
    return <div className='w-[400px] bg-white drop-shadow-md flex flex-col rounded-3xl relative'>
        <div className='absolute flex w-full justify-center'>
          <Image src={SuccessIcon} alt='success-icon' className='h-24 w-24 -m-16 justify-self-center'/>
        </div>
        <div className="bg-[#FC2E20] px-10  py-5 rounded-t-3xl text-center">
          <p className='mt-8 text-xl text-white font-medium'>Failed To Scan</p>
        </div>
        <div className='text-center flex flex-col p-10 gap-4'>
          <p>Please Scan Correct Qr Code</p>
          <button className='p-3 bg-[#F9943B] rounded-xl font-medium' onClick={handleRetry}><p>Tap To Retry!</p></button>
        </div>
    </div> 
  }

  const responseCard =  () => {
      return <div className='w-[400px] bg-white drop-shadow-md flex flex-col rounded-3xl relative'>
        <div className='absolute flex w-full justify-center'>
          <Image src={SuccessIcon} alt='success-icon' className='h-24 w-24 -m-16 justify-self-center'/>
        </div>
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
    setResponse(null)
    setAcvtiveCard(false)
    setResponse(null)
    setCameraActive(true); 
    setQrCodeResult(null);
  };

  return (
    <div className='w-screen min-h-screen flex flex-col justify-center items-center p-10'>
      {isCameraActive && (
        <div className='gap-10 flex flex-col'>
              <p className='text-center text-xl font-bold'> Scan Your QR</p>
              <div className='h-96 w-96 bg-black overflow-hidden rounded-2xl'>
              <QrReader
                scanDelay={false}
                className='scale-[1.5]'
                onResult={handleScan}
                onError={(error:any) => handleError(error)}
                constraints  ={{ facingMode:  "environment"  }}
                />
            </div>
        </div> 
      )}

      {qrCodeResult && !activeCard &&(
        <div className='p-10 bg-white drop-shadow-md rounded-xl flex flex-col gap-10'>
          <Image src={SuccessIcon} alt='success-icon'/>
          <p>Your Code Success to Read</p>
          <button className='p-3 bg-black text-white' onClick={() =>OnValidate(qrCodeResult.text)}>Open Locker</button>
        </div> 
      )}

      {qrCodeResult && activeCard && (
        <div>
          {response?.success && responseStatus ? responseCard():failedCard()}
        </div>
      ) }
    </div>
  );
}



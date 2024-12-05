"use client"
import React, { useEffect , useState} from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useUser } from '@clerk/nextjs'
import { query } from '../../../convex/_generated/server';
import { api } from '../../../convex/_generated/api';
import { v } from 'convex/values';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';

function page() {

  const{user}=useUser();


const getAllFiles=useQuery(api.Pdfstorage.getUserFiles,{userEmail:user?.primaryEmailAddress?.emailAddress});



//console.log('getAllFiles---->>>>'+getAllFiles);





  return (
    <div>
     <h2 className="font-bold text-3xl ">Workspace</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5">
      {
        getAllFiles!=undefined && getAllFiles.length>0 ?( getAllFiles.map((items,index)=>(
          <Link href={'/workspace/'+items?.fileID} key={index}>
           <div  className="flex p-5 shadow-lg rounded-md flex-col items-center justify-center border hover:scale-105 transition-all cursor-pointer ">
            
             <Image src="/pdf.png" height={70} width={70} alt="pdf-icon"/>
             <h2 className="mt-3 font-medium text-xl ">{items?.fileName}</h2>
           </div>
           </Link>
        )))
        : (
          [1,2,3,4,5].map((items,index)=>(
            <div key={index} className="bg-slate-200 rounded-md h-[150px] animate-pulse">

            </div>
          ))
        )
      }
       
      </div>

    </div>
  )
}

export default page

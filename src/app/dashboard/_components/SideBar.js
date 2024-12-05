"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import UploadPdf from "./Uploadpdf"
import { Layout, Shield } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Progress } from "@/components/ui/progress"
import Link from 'next/link'
import { usePathname } from 'next/navigation'


function SideBar() {

  const{user}=useUser();
  const path=usePathname();


const getAllFiles=useQuery(api.Pdfstorage.getUserFiles,{userEmail:user?.primaryEmailAddress?.emailAddress})


const getuserdetails=useQuery(api.participants.getDetails,{userEmail:user?.primaryEmailAddress?.emailAddress});
console.log(getuserdetails+"----------------");



  return (
    <div className="shadow-2xl h-screen p-2">
      <img src="/icon.png" alt="icon" w={100} h={100}/>
      <div className="mt-10"  >
       
        <UploadPdf ismaxfile={ (getAllFiles?.length>=5 && !getuserdetails?.upgrade)?true:false}>
        <Button className="w-full">+ Upload PDF</Button>
        </UploadPdf>

        <div className={`mt-5 flex items-center gap-2 p-3 hover:bg-slate-200 cursor-pointer rounded-lg ${path=='/dashboard' && 'bg-slate-300'}`}>
            <Layout/>
            <Link  href={"/dashboard"}>
            <h2>Workspace </h2>
            </Link>
        
        </div>
        <div className={`mt-5 flex items-center gap-2 p-3 hover:bg-slate-200 cursor-pointer rounded-lg ${path=='/dashboard/upgrade' && 'bg-slate-300'}`}>
         
            <Shield/>
            <Link href={"/dashboard/upgrade"}>
            <h2>Upgrade</h2>
            </Link>
            
        </div>
      </div>

     {!getuserdetails?.upgrade && <div className="absolute bottom-10 w-[80%]">
        <Progress value={(getAllFiles?.length/5)*100} />
        <p className="text-sm mt-1"> {getAllFiles?.length} out of 5 Pdf uploaded</p>
        <p className="text-sm text-gray-400 mt-2">Upgrade to upload more PDF</p>
      </div>}

      

    </div>
  )
}

export default SideBar

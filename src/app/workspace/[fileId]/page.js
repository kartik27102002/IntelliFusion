"use client"
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import WorkHeader from '../WorkHeader'
import TextEditor from "../TextEditor"
import Pdfview from "../Pdfview"
import { useMutation, useQueries, useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useUser } from '@clerk/nextjs'
function page() {
    const {fileId}=useParams();
    const {user}=useUser();
    const getFileDetails=useQuery(api.Pdfstorage.getFileId, {fileID:fileId});
     

      useEffect(()=>{
       
         console.log("get file details"+getFileDetails);
         //console.log(getFileDetails?.fileName)
         console.log("=============>>>>>>");

      },[getFileDetails])


  return (
    <div>
        <WorkHeader filename={getFileDetails?.fileName} />

        <div className="grid grid-cols-2 gap-5">
            {/* TEXT EDITOR */}
            <div className='col-span-1'>
            <TextEditor/>

            </div>
            {/* PDF VIEWER */}
            <div className="col-span-1">
                 <Pdfview fileUrl={getFileDetails?.fileUrl}/>
            </div>
        </div>
    
    </div>
  )
}

export default page

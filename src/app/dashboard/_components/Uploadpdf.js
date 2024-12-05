
"use client"
import axios from 'axios';
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { useAction, useMutation } from 'convex/react'
  import { Loader, Loader2Icon } from 'lucide-react'
  import { api } from '../../../../convex/_generated/api'
  import { v4 as uuidv4 } from 'uuid';
  import { useUser } from '@clerk/nextjs'
import { ingest } from '../../../../convex/myAction';
import { toast } from 'react-toastify';

  
function Uploadpdf({children, ismaxfile}) {

    const generateUploadUrl=useMutation(api.Pdfstorage.generateUploadUrl);
    const [file,setfile]=useState();
    const [loading, setloading]=useState(false);
    const {user}=useUser();
    const [filename,setfilename]=useState('');
    const [open,setopen]=useState(false);
    const addFileEntry=useMutation(api.Pdfstorage.AddFileEntry);
    const getFileUrl=useMutation(api.Pdfstorage.getFileUrl);
    const embeedDoc=useAction(api.myAction.ingest);
    const addNotesContent=useMutation(api.notes.addNotes);



    const onFileSelect=(event)=>
    {
     // console.log("file selected :"+event.target.files[0]);
       setfile(event.target.files[0]);
    }

    const onUpload=async()=>{
      console.log(" m aclleddddd");
        setloading(true);

         // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();

        // Step 2: POST the file to the URL
        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file?.type },
            body: file,
          });
          const { storageId } = await result.json();
          console.log("i m storgae id"+storageId);
          const fileId=uuidv4();
          const fileUrl=await getFileUrl({storageID:storageId})

           // Step 3: Save the newly allocated storage id to the database
          const answer=await addFileEntry({
            fileID:fileId,
            storageID:storageId,
            fileName:filename??"untitled file",
            createdBy:user?.primaryEmailAddress.emailAddress,
            fileUrl:fileUrl
          })

          const iadded=await addNotesContent({
            fileId:fileId,
            notes:'hello world',
             createdBy:user?.primaryEmailAddress.emailAddress,
          })

         
          
           console.log(answer+"------------------------");
           console.log("uploadedpdfmhere-------"+iadded);

          //API CALL TO FETCH PDF PROCESSDATA
          const Apiresponse=await axios.get('/api/pdf-loader?fileUrl='+fileUrl);
          console.log(Apiresponse.data.result);
          await embeedDoc({
            spliText:Apiresponse.data.result,
            fileId:fileId
          });
         
         setloading(false);
         setopen(false);
         console.log("is max file :"+ismaxfile);
         toast("file added successfully.....");


    }

  return (
    <div>
      <Dialog open={open}>
  <DialogTrigger asChild>
    <Button className="w-full" onClick={()=>setopen(true)} disabled={ismaxfile}>+ upload pdf</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Upload PDF </DialogTitle>
      <DialogDescription asChild>
           <div>
           <h2 className="mt-2">Select a file to upload</h2>
               <div className="flex  mt-2 gap-2 p-3 rounded-md border">
                 
                   <input type="file" accept="application/pdf" onChange={(event)=>onFileSelect(event)}/>
               </div>
                <div className="mt-2">
                    <label className="mb-5">File Name *</label>
                    <Input placeholder="file name" onChange={(e)=>setfilename(e.target.value)}/>
               </div>
              
           </div>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="bg-red-500 text-white" onClick={()=>setopen(false)}>
              Close
            </Button>
          </DialogClose>
          <Button onClick={onUpload}>
            {
                loading?<Loader2Icon className="animate-spin"/> : 'Upload'
            }
           
            
            </Button>
        </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  )
}

export default Uploadpdf

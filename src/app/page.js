"use client"
import Image from "next/image";

import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";
export default function Home() {
  const {user}=useUser();
  const createUser=useMutation(api.participants.createUser);


   useEffect(()=>{
    checkUser();
   },[user])
   
  const checkUser=async()=>{
    const result= await createUser({
      email:user?.primaryEmailAddress?.emailAddress,
      imageUrl: user?.imageUrl,
      userName: user?.fullName
    })

    console.log(result);
  }

  return (
   

   <div className="items-center">
   
    <UserButton/>
   </div>
  );
}

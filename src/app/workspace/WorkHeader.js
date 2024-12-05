import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function WorkHeader({filename}) {
  return (
    <div className="p-4 flex justify-between shadow-lg">
      <Image src='/icon.png' alt="logo" width={140} height={100}/>
      <h1 className="font-extrabold text-2xl text-red-600">{filename}</h1>
      <div className="flex gap-2 items-center"> 
        <Button className="bg-green-700">SAVE</Button>
      
      <UserButton/>
      </div>
    </div>
  )
}

export default WorkHeader

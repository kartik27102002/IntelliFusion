import { useAction, useMutation } from 'convex/react'
import { AlignJustify, Bold, Heading1, Heading2, Heading3, Highlighter, Image, Italic, List, Sparkles, Strikethrough, Underline } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { useParams } from 'next/navigation'
import { ChatSession } from '@google/generative-ai'
import { toast } from "sonner"
import { useUser } from '@clerk/nextjs'
import { query } from '../../../convex/_generated/server'
function EditorExtension({editor}) {
      const{user}=useUser();
      const{fileId}=useParams();
      const {
        GoogleGenerativeAI,
        HarmCategory,
        HarmBlockThreshold,
      } = require("@google/generative-ai");
    const searchResult=useAction(api.myAction.search);

    const addNotes=useMutation(api.notes.addNotes);

   


    const onAIClick=async()=>{
        toast("AI is getting");
        const selectedText=editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            '  '
        )
        console.log(selectedText+"---------------");

        const result=await searchResult({
            query:selectedText,
            fileId:fileId
        })
        console.log(result+"-------------");
        const unformat=JSON.parse(result);
        let answer='';
        unformat && unformat.forEach((item)=>{
            answer=answer+item.pageContent;
        })
        

        const PROMPT="for question"+selectedText+"and with the given content as answer,"+"please give appropiate answer in HTML format. The answer content is : "+answer+"and please dont print question just show ans only";

         
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
   const chatSession = model.startChat({
      generationConfig,
      history: [
      ],
    });
  

    const lol = await chatSession.sendMessage(PROMPT);
    console.log(lol.response.text());

    const finalAns=lol.response.text().replaceAll('```','').replace('html','');

    const AllText=editor.getHTML();
    editor.commands.setContent(AllText+'<p><strong>Answer:</strong>'+finalAns+'</p>');

   console.log(user?.primaryEmailAddress?.emailAddress+"===============");
  await addNotes({
      fileId:fileId,
      notes:editor.getHTML(),
      createdBy:user?.primaryEmailAddress?.emailAddress
     })



   console.log('saved successfully');




































    }



    const addImage = useCallback(() => {
        const url = window.prompt('URL')
    
        if (url) {
          editor.chain().focus().setImage({ src: url }).run()
        }
      }, [editor])
    
      if (!editor) {
        return null
      }
  return (
    <div className="p-5 flex gap-4 items-center ">
       
       <button
  onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
  className={
    editor?.isActive('heading', { level: 1 })
      ? 'text-blue-700 bg-slate-100 p-2 border rounded-lg'
      : ''
  }
>
  <Heading1/>
</button>
<button
  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
  className={
    editor?.isActive('heading', { level: 2 })
      ? 'text-blue-700 bg-slate-100 p-2 border rounded-lg'
      : ''
  }
>
  <Heading2/>
</button>
<button
  onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
  className={
    editor?.isActive('heading', { level: 3 })
      ? 'text-blue-700 bg-slate-100 p-2 border rounded-lg'
      : ''
  }
>
  <Heading3/>
</button>




<div className="control-group">
<div className="button-group">
<button
onClick={() => editor?.chain().focus().toggleBold().run()}
className={editor?.isActive('bold') ? 'text-blue-500 bg-slate-100 p-2 border rounded-lg' : ''}
>
<Bold/>
</button>
</div>
</div>

<button
onClick={() => editor?.chain().focus().toggleItalic().run()}
className={editor?.isActive('italic') ? 'text-blue-700 bg-slate-100 p-2 border rounded-lg' : ''}
        >
        <Italic/>
        </button>

    
        <div className="control-group">
        <div className="button-group">
     
         
    
<button
  onClick={() => editor?.chain().focus().toggleBulletList().run()}
  className={editor?.isActive('bulletList') ? 'text-blue-700 bg-slate-100 p-2 border rounded-lg' : ''}
>
  <AlignJustify/>
</button>

</div></div>



<button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'text-blue-700 bg-slate-100 p-2 border rounded-lg' : ''}
          >
           <Strikethrough/>
          </button>

  <button onClick={addImage}><Image/></button>
     
           <button
            onClick={() => editor.chain().focus().toggleHighlight({ color: '#ffc078' }).run()}
            className={editor.isActive('highlight', { color: '#ffc078' }) ? 'text-blue-700 bg-slate-100 p-2 border rounded-lg' : ''}
          >
           <Highlighter/>
          
            </button>



            <button
            onClick={() => onAIClick()}
            className='hover:text-blue-700 hover:bg-slate-100 p-2 border rounded-lg'
          >
           <Sparkles/>
          
            </button>
      


       
    





           

      

    </div>
  )
}

export default EditorExtension

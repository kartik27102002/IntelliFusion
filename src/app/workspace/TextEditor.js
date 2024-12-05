import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Bold from '@tiptap/extension-bold'
import Heading from '@tiptap/extension-heading'
import EditorExtension from "./EditorExtension"
import BulletList from '@tiptap/extension-bullet-list'
import Document from '@tiptap/extension-document'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Image from '@tiptap/extension-image'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import ListKeymap from '@tiptap/extension-list-keymap'
import Strike from '@tiptap/extension-strike'
import Link from '@tiptap/extension-link'

import { Color } from '@tiptap/extension-color'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useParams } from 'next/navigation'
function TextEditor() {
    const editor = useEditor({
        extensions: [StarterKit,Document, Paragraph, Text, BulletList,
             OrderedList, ListItem,Image,Highlight.configure({ multicolor: true }),Underline,
              ListKeymap,Strike, Color,
            Placeholder.configure({
                // Use a placeholder:
                placeholder: 'Write something …',
                
              }),
              ListItem.configure({
                HTMLAttributes: {
                  class: 'my-custom-class',
                },
              })


        ],
       
        
       
        editorProps:{
            attributes:{
                class:'focus:outline-none h-screen p-5'
            }
        }
      })
          const {fileId}=useParams();
          console.log("fileiD :"+fileId);
     const notes= fileId ? useQuery(api.notes.getNotes, { fileId:fileId }) : null;
     console.log("notes==========="+notes);
    //   used to get notes stored in databases
   

     useEffect(()=>{
        editor && editor.commands.setContent(notes);
     },[notes && editor]);
    

  return (
    <div>
       <EditorExtension editor={editor}></EditorExtension>
      <div className="overflow-scroll h-[88vh]">
      <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default TextEditor

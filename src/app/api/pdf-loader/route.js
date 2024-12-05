import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";


//const pdfurl="https://healthy-nightingale-12.convex.cloud/api/storage/bd9a3a6e-cf01-4abb-882b-4d394196e9a6"
export async function GET(req)
{
    const reqUrl=req.url;
    const {searchParams}=new URL(reqUrl);
    const pdfurl=searchParams.get('fileUrl')
    // ..LOAD THE PDF
    console.log(pdfurl+"-----------------------------------");
    const response=await fetch(pdfurl);
    const data=await response.blob();
    const loader=new WebPDFLoader(data);
    const docs=await loader.load();

    let pdfTextContent="";
    docs.forEach(doc=>{
        pdfTextContent=pdfTextContent+doc.pageContent;
    })



    //TEXT SPLIT IN SMALLER CHUNKS
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20,
      });
      const docOutput = await splitter.createDocuments([pdfTextContent]);
     
      //STOR IN FORM OF LIST
      let list=[];
      docOutput.forEach(doc=>{
        list.push(doc.pageContent);
      })



    return NextResponse.json({result:list});
}
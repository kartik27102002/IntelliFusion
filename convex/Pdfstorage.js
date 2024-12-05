import { convexToJson, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const AddFileEntry=mutation(
    {
        args:{
            fileID: v.string(),
            storageID: v.string(),
            fileName: v.string(),
            fileUrl: v.string(),
            createdBy: v.string()
        },
        handler:async(ctx,args)=>{
          const result=await ctx.db.insert('pdfFiles',{
             fileID:args.fileID,
             fileName:args.fileName,
             storageID:args.storageID,
             fileUrl: args.fileUrl,
             createdBy:args.createdBy
          })
          return "FILE INSERTED"
        }
    }
)


export const getFileUrl=mutation({
    args:{
        storageID:v.string()
        },
        handler:async(ctx,args)=>{
            const url=await ctx.storage.getUrl(args.storageID);
            return url;
        }
})

export const getFileId=query({
    args:{
        fileID:v.string()
    },
    handler:async(ctx,args)=>{
        const result= await ctx.db.query('pdfFiles').filter((q)=>q.eq(q.field('fileID'),args.fileID))
        .collect();
        console.log("m result :",result);
        return result[0];
    }
})


export const getUserFiles=query({
    args:{
        userEmail:v.string()
    },
    handler:async(ctx,args)=>{
        const result= await ctx.db.query('pdfFiles')
        .filter((q)=>q.eq(q.field('createdBy'),args.userEmail)).collect();

        return result;

    }
  
   

})
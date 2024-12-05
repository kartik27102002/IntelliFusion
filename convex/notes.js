import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addNotes=mutation({
    args:{
        fileId:v.string(),
        notes:v.any(),
        createdBy:v.string()
    },
    handler:async(ctx,args)=>{
        const recordId=await ctx.db.query('notes')
        .filter((q)=>q.eq(q.field('fileId'),args.fileId))
        .collect();

        if(recordId?.length==0)
        {
            await ctx.db.insert('notes',{
                
                    fileId:args.fileId,
                    notes:args.notes,
                    createdBy:args.createdBy,
            
            })
            return "record inserted successfully"
        }
        else
        {
            await ctx.db.patch(recordId[0]._id,{notes:args.notes});
            return "updated successfully"
        }
    }
})
export const getNotes=query({
      args:{
        fileId:v.string(),
      },
      handler:async(ctx,args)=>{
        console.log(args.fileId+"---------------------");
        const recordId=await ctx.db.query('notes')
        .filter((q)=>q.eq(q.field('fileId'),args.fileId))
        .collect();
        console.log("m from get Notes "+recordId+"=======");
        
        return recordId[0].notes;
      }
})
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const createUser=mutation({
    args:{
        email: v.optional(v.string()),
        imageUrl: v.string(),
        userName: v.string(),
    },
    handler:async(ctx,args)=>{
        const user= await ctx.db.query('participants')
        .filter((q)=>q.eq(q.field('email'),args.email)).collect();

        if(user?.length==0)
        {
              await ctx.db.insert('participants',
                {
                    email:args.email,
                    userName:args.userName,
                    imageUrl:args.imageUrl,
                    upgrade: false
                }
              );

              return "INSERTED SUCCESSFULLY"
        }

        return "ALREADY EXSISTS!!"
    }
})


export const userPlan=mutation({
    args:{
        userEmail:v.string(),
    },
    handler:async(ctx,args)=>{
       
        const result= await ctx.db.query('participants').filter(q=>q.eq(q.field('email'),args.userEmail)).collect();
        if(result)
        {
            await ctx.db.patch(result[0]._id,{upgrade:true});
            return "SUCCESS";
        }
        return "ERROR";

    }
})


export const getDetails=query({
    args:{
        userEmail:v.optional(v.string()),
    },
    handler:async(ctx,args)=>{
        const result= await ctx.db.query('participants').filter(q=>q.eq(q.field('email'),args.userEmail)).collect();
         return result[0];

    }
})
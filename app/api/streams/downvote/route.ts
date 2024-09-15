import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { use } from "react";
import { z } from "zod";

const upvoteSchema = z.object({
    stremId: z.string(),
})

export async function POST(req: NextRequest){
    const session = await getServerSession();

    const user = await prismaClient.user.findFirst({
        where:{
            email: session?.user?.email ?? ""
        }
    });

    if(!user){
        return NextResponse.json({
            message: "Unauthenticated"
        },{
            status: 403
        })
    }

    try{
        const data = upvoteSchema.parse(await req.json());
        await prismaClient.upvote.delete({
            where:{
                userId_streamId:{
                    userId: user.id,
                    streamId: data.stremId,
                }
            }
        });

        return NextResponse.json({
            message: "Done!"
        })
    } catch(e){
        return NextResponse.json({
            message: "Error while upvoting"
        },{
            status: 403
        }
    )
    }
}
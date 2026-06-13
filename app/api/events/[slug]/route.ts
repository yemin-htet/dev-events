import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event, { IEvent } from "@/database/event.model";


type RouteParams = {
    params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try{
        await connectToDatabase();
        const { slug } = await params;

        if(!slug || typeof slug !== "string" || slug.trim() === "") {
            throw new Error("Invalid slug parameter");
        }
        const sanitizedSlug = slug.trim().toLowerCase();

        const event: IEvent | null = await Event.findOne({ slug: sanitizedSlug }).lean();

        if (!event) {
            throw new Error("Event not found");
        }

        return NextResponse.json({ success: true, 
            event },
            { status: 200 });
    } catch (error: Error | unknown) {
        console.error("Error fetching event:", error);
        return NextResponse.json({ success: false,
             message: error instanceof Error ? error.message : "An unknown error occurred" },
              { status: 500 });
    }
}
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("Cloudinary config:", cloudinary.config());

export async function POST(req: NextRequest) {
    try{
        await connectToDatabase();
        const formData = await req.formData();
        let event: Record<string, unknown>;
        
        event = {
            ...Object.fromEntries(formData.entries()),
            agenda: formData.getAll("agenda") as string[],
            tags: formData.getAll("tags") as string[],
        } as Record<string, unknown>;

        const file = formData.get("image") as File;
        if(!file){
            return NextResponse.json({ error: "File is required" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: "image",folder: "DevEvent" },
                (error, result) => {
                if(error) {
                    console.error("Cloudinary error:", JSON.stringify(error, null, 2));
                    reject(error);
                }
                resolve(result);
            }).end(buffer);
        });

        const imageUrl = (uploadResult as { secure_url: string }).secure_url;
        event.image = imageUrl;

        const newEvent = await Event.create(event);
        return NextResponse.json({
            message: "Event created successfully",
            event: newEvent
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json({ error: "Error creating event" }, { status: 500 });
    }
}

export async function GET() {
    try{
        await connectToDatabase();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({
            message: "Events fetched successfully",
            events
        }, { status: 200 });

    }catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ error: "Error fetching events" }, { status: 500 });
    }
}
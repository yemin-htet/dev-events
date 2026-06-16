'use server';
import { Event } from "@/database";
import { connectToDatabase } from "../mongodb";

export const getAllEvents = async () => {
    try {
        await connectToDatabase();
        const events = await Event.find({}).sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(events));
    } catch {
        return [];
    }
}

export const getEventBySlug = async (slug: string) => {
    try {
        await connectToDatabase();
        const event = await Event.findOne({ slug });
        if (!event) return { success: false, event: null };
        return { success: true, event: JSON.parse(JSON.stringify(event)) };
    } catch {
        return { success: false, event: null };
    }
}

export const getSimilarEventsBySlug = async (slug: string) => {
    try{
        await connectToDatabase();
        const event = await Event.findOne({slug});
        if(!event) throw new Error("Event Not Found!");
        const similarEvents = await Event.find({
            _id:{
                $ne: event._id,
            },
            tags: {$in: event.tags}
        });

        return similarEvents;
    }catch (e){
        return [];
    }
}
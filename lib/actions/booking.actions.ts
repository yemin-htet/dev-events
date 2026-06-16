"use server"
import { connectToDatabase } from "../mongodb"
import { Booking } from "@/database";

export const createBooking = async ({eventId,email}:{
    eventId:string,
    email:string
}) => {
    try{
        await connectToDatabase();

        const existing = await Booking.exists({ eventId, email });
        if (existing) throw new Error("This email has already registered with this event");

        const booking = await Booking.create({eventId, email})
        if(!booking) throw new Error("Booking failed");

        return {
            success: true,
            booking: JSON.parse(JSON.stringify(booking))
        }
    }catch(e){
        return {success: false, error: e instanceof Error ? e.message : "Something went wrong"}
    }
}

export const countBooking = async ({eventId}:{
    eventId: string
}) => {
    try{
        await connectToDatabase();
        const count = await Booking.countDocuments({eventId});

        return { success: true, count }
    }catch(e){
        return {success: false, error: e}
    }
}
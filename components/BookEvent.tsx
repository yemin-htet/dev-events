'use client';
import { createBooking } from '@/lib/actions/booking.actions';
import React, { useState } from 'react'
import { toast } from 'sonner';

export default function BookEvent({eventId}:{
    eventId: string;
}) {
    const [email,setEmail] = useState("")
    const [submitted,setSubmitted] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.promise(createBooking({ eventId, email }), {
            loading: "Booking your spot...",
            success: (data) => {
                if (!data.success) {
                    throw new Error(data.error ?? "Booking failed. Please try again.");
                }
                setSubmitted(true);
                return "You're in! Your spot has been booked.";
            },
            error: (err: Error) => err.message ?? "Something went wrong. Please try again.",
        });
    }
  return (
    <div id='book-event'>
        {submitted ? (
            <p className='text-sm'>
                Thank you for signing up!
            </p>
        ): (
            <form onSubmit={handleSubmit}>
                <div>
                    <label  htmlFor='email'>Email Address</label>
                    <input
                    type='text'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id='email'
                    placeholder='Enter your email address'
                    />
                </div>
                <button type='submit' className='button-submit'>Submit</button>
            </form>
        )
        }
    </div>
  )
}

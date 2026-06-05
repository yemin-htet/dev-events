import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import Event from './event.model';

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// RFC-5322 simplified email regex — stricter than Mongoose's built-in check
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<IBooking>(
  {
    // indexed for fast lookups of all bookings belonging to a given event
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => EMAIL_REGEX.test(v),
        message: 'Invalid email address',
      },
    },
  },
  { timestamps: true }
);

// Reject bookings that reference a non-existent event before they reach the DB
bookingSchema.pre('save', async function () {
  const exists = await Event.exists({ _id: this.eventId });
  if (!exists) {
    throw new Error(`Event "${this.eventId}" does not exist`);
  }
});

bookingSchema.index({ email: 1, eventId: 1 }, { unique: true, name: 'email_event_unique' }); // prevent duplicate bookings for the same email and event
bookingSchema.index({ eventId: 1});// for efficient lookups of bookings by event
bookingSchema.index({ eventId: 1, createdAt: -1 }); // for efficient pagination of bookings by event and recency
bookingSchema.index({ email: 1 }); // for efficient lookups of bookings by email (e.g. for user dashboards)


// Guard against duplicate model registration during Next.js hot reloads
const Booking: Model<IBooking> =
  (mongoose.models.Booking as Model<IBooking>) ??
  mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;

import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Converts a title into a URL-safe slug: lowercase, spaces → hyphens, special chars stripped
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Parses any JS-parseable date string and returns YYYY-MM-DD
function normalizeDate(value: string): string {
  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) throw new Error(`Invalid date: "${value}"`);
  return parsed.toISOString().slice(0, 10);
}

// Accepts "H:MM", "HH:MM", or "H:MM am/pm" and returns zero-padded 24-hour "HH:MM"
function normalizeTime(value: string): string {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
  if (!match) throw new Error(`Invalid time: "${value}"`);

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toLowerCase();

  if (meridiem === 'pm' && hours !== 12) hours += 12;
  if (meridiem === 'am' && hours === 12) hours = 0;

  if (hours > 23 || minutes > 59) throw new Error(`Out-of-range time: "${value}"`);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

const requiredString = { type: String, required: true, trim: true, minlength: 1 } as const;

const eventSchema = new Schema<IEvent>(
  {
    title: requiredString,
    // slug is set by the pre-save hook; unique index enforced below
    slug: { type: String, unique: true, index: true },
    description: requiredString,
    overview: requiredString,
    image: requiredString,
    venue: requiredString,
    location: requiredString,
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: requiredString,
    audience: requiredString,
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'agenda must contain at least one item',
      },
    },
    organizer: requiredString,
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'tags must contain at least one item',
      },
    },
  },
  { timestamps: true }
);

eventSchema.pre('save', async function () {
  // Regenerate slug only when title is new or has changed
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title);
  }

  // Always normalize date and time so the stored format is consistent regardless of input
  this.date = normalizeDate(this.date);
  this.time = normalizeTime(this.time);
});

// Guard against duplicate model registration during Next.js hot reloads
const Event: Model<IEvent> =
  (mongoose.models.Event as Model<IEvent>) ?? mongoose.model<IEvent>('Event', eventSchema);

export default Event;

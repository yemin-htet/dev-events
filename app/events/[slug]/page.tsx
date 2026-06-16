import { Suspense } from 'react';
import BookEvent from '@/components/BookEvent';
import EventCard from '@/components/EventCard';
import { IEvent } from '@/database';
import { countBooking } from '@/lib/actions/booking.actions';
import { getEventBySlug, getSimilarEventsBySlug } from '@/lib/actions/event.actions';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { cacheLife } from 'next/cache';

const EventDetailItem = ({ icon, alt, label }: {
  icon: string; alt: string; label: string;
}) => (
  <div className='flex-row-gap-2 items-center'>
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className='agenda'>
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tagItems }: { tagItems: string[] }) => (
  <div className='flex flex-row gap-1.5 flex-wrap'>
    {tagItems.map((tag) => (
      <div className='pill' key={tag}>{tag}</div>
    ))}
  </div>
);

// ---- Booking count: streams in separately so it never blocks the shell ----
async function BookingCount({ eventId }: { eventId: string }) {
  "use cache"
  cacheLife("minutes")
  const { count: bookings = 0 } = await countBooking({ eventId });
  return bookings > 0 ? (
    <p className='text-sm'>Join {bookings} people have already booked their spot!</p>
  ) : (
    <p className='text-sm'>Be the first to book your spot!</p>
  );
}

// ---- Similar events: independent async section ----
async function SimilarEvents({ slug }: { slug: string }) {
  "use cache"
  cacheLife("minutes")
  const similarEvents = await getSimilarEventsBySlug(slug);
  return (
    <div className='events'>
      {similarEvents.length > 0 && similarEvents.map((e: IEvent) => (
        <EventCard
          key={e.slug}
          slug={e.slug}
          title={e.title}
          image={e.image}
          location={e.location}
          date={e.date}
          time={e.time}
        />
      ))}
    </div>
  );
}

// ---- Main content: awaits params inside Suspense so Page stays synchronous ----
async function EventContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { success, event } = await getEventBySlug(slug);

  if (!success || !event) return notFound();

  return (
    <>
      <h1>{event.title}</h1>
      <p className="mt-2">{event.description}</p>
      <div className="details">
        {/* Left Side - Event Content */}
        <div className="content">
          <Image
            src={event.image}
            alt={event.title}
            width={800} height={800}
            className="banner" />

          <section className='flex-col-gap-2'>
            <h2>Overview</h2>
            <p>{event.overview}</p>
          </section>
          <section className='flex-col-gap-2'>
            <h2>Event Details</h2>
            <EventDetailItem icon='/icons/calendar.svg' alt='calendar' label={event.date} />
            <EventDetailItem icon='/icons/clock.svg' alt='clock' label={event.time} />
            <EventDetailItem icon='/icons/pin.svg' alt='pin' label={event.location} />
            <EventDetailItem icon='/icons/mode.svg' alt='mode' label={event.mode} />
            <EventDetailItem icon='/icons/audience.svg' alt='audience' label={event.audience} />
          </section>
          <EventAgenda agendaItems={event.agenda} />
          <section className='flex-col-gap-2'>
            <h2>About Organizer</h2>
            <p>{event.organizer}</p>
          </section>
          <EventTags tagItems={event.tags} />
        </div>

        {/* Right Side - Booking Form */}
        <aside className='booking'>
          <div className='signup-card'>
            <h2>Book Your Spot</h2>
            <Suspense fallback={<p className='text-sm'>Loading bookings…</p>}>
              <BookingCount eventId={event._id} />
            </Suspense>
            <BookEvent eventId={event._id} />
          </div>
        </aside>
      </div>

      <div className='flex w-full flex-col gap-4 pt-20'>
        <h2>Similar Events</h2>
        <Suspense fallback={<div className='events'>Loading similar events…</div>}>
          <SimilarEvents slug={slug} />
        </Suspense>
      </div>
    </>
  );
}

export default function Page({ params }: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <section id="event">
      <Suspense fallback={<EventDetailSkeleton />}>
        <EventContent params={params} />
      </Suspense>
    </section>
  );
}

function EventDetailSkeleton() {
  return (
    <div className="details animate-pulse">
      <div className="content">
        <div className="banner bg-gray-200 rounded" style={{ height: 400 }} />
        <div className="h-6 bg-gray-200 rounded w-1/3 mt-4" />
        <div className="h-4 bg-gray-200 rounded w-full mt-2" />
      </div>
      <aside className="booking">
        <div className="signup-card">
          <div className="h-6 bg-gray-200 rounded w-2/3" />
        </div>
      </aside>
    </div>
  );
}
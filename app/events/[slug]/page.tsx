import BookEvent from '@/components/BookEvent';
import EventCard from '@/components/EventCard';
import { IEvent } from '@/database';
import { getSimilarEventsBySlug } from '@/lib/actions/event.actions';
import Image from 'next/image';
import { notFound } from 'next/navigation';


const EventDetailItem = (
  {icon,alt,label}:{
    icon: string;
    alt: string;
    label:string;
  }) => (
  <div className='flex-row-gap-2 items-center'>
    <Image src={icon} alt={alt} width={17} height={17}/>
    <p>{label}</p>
  </div>
)

const EventAgenda = ({agendaItems}:{agendaItems: string[]}) => (
  <div className='agenda'>
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item)=>(
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
)

const EventTags = ({tagItems}:{tagItems: string[]}) => (
  <div className='flex flex-row gap-1.5 flex-wrap'>
    {tagItems.map((tag)=> (
      <div className='pill' key={tag}>{tag}</div>
    ))}
  </div>
);

const bookings = 10;
export default async function page({params}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await  params;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }); 
    const { success, event } = await response.json();

    if(!success || !event) return notFound();

    const similarEvents = await getSimilarEventsBySlug(slug);
  return (
    <section id="event">
        <h1>{event.title}</h1>
        <p className="mt-2">{event.description}</p>
        <div className="details">
          {/* Left Side- Event Content */}
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
              <EventDetailItem icon='/icons/calendar.svg' alt='calendar' label={event.date}/>
              <EventDetailItem icon='/icons/clock.svg' alt='clock' label={event.time}/>
              <EventDetailItem icon='/icons/pin.svg' alt='pin' label={event.location}/>
              <EventDetailItem icon='/icons/mode.svg' alt='mode' label={event.mode}/>
              <EventDetailItem icon='/icons/audience.svg' alt='audience' label={event.audience}/>
            </section>
            <EventAgenda agendaItems={event.agenda}/>
            <section className='flex-col-gap-2'>
              <h2>About Organizer</h2>
              <p>{event.organizer}</p>
            </section>
            <EventTags tagItems={event.tags}/> 
            <section className='flex-col-gap-2'>

            </section>
          </div>
          {/* Right Side- Booking Form */}
          <aside className='booking'>
            <div className='signup-card'>
              <h2>Book Your Spot</h2>
              {bookings > 0 ? (
                <p className='text-sm'>
                  Join {bookings} people have already booked their spot!
                </p>
              ): (
                <p className='text-sm'>
                  Be the first to book your spot!
                </p>
              )}
              <BookEvent/>
            </div>

          </aside>
        </div>
        <div className='flex w-full flex-col gap-4 pt-20'>
          <h2>Similar Events</h2>
          <div className='events'>
            {
              similarEvents.length > 0 && similarEvents.map((e: IEvent)=>(
                <EventCard
                key={e.slug}
                slug={e.slug}
                title={e.title}
                image={e.image}
                location={e.location}
                date={e.date}
                time={e.time}
                />
              ))
            }
          </div>
        </div>

    </section>
  )
}


import EventCard from '@/components/EventCard';
import ExploreBtn from '@/components/ExploreBtn';
import { IEvent } from '@/database/event.model';
import { cacheLife } from 'next/cache';

const page = async () => {
  "use cache";
  cacheLife('hours');
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  const { events } = await response.json();

  
  return (
    <section className="mt-5">
      <h1 className='text-center'>The Hub for Every Dev <br/>
       Event You Can't Miss
      </h1>
      <p className='text-center mt-10 text-xl text-white font-extralight'>
        Hackathons, Meetups, and Conferences - All in One Place. 
      </p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className='events'>
          {events.map((event: IEvent, index: number) => (
            <EventCard 
              key={index} 
              slug={event.slug} 
              title={event.title} 
              image={event.image} 
              location={event.location} 
              date={event.date} 
              time={event.time} 
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

export default page;
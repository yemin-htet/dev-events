import EventCard from '@/components/EventCard';
import ExploreBtn from '@/components/ExploreBtn';
import { EVENTS } from '@/constants';

const page = () => {
  
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
          {EVENTS.map((event, index) => (
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
import Link from 'next/link'
import Image from 'next/image'

const EventCard = ({slug, title, image, location, date, time}:{
    slug: string;
    title: string;
    image: string;
    location: string;
    date: string;
    time: string;
}) => {
  return (
    <Link href={`/events/${slug}`} id="event-card" >
        <Image src={image} alt={title} width={300} height={240} className="poster" />
        <div className="flex flex-row gap-2">
            <Image src="/icons/pin.svg" alt="location" width={14} height={14}  />
            <p className="location">{location}</p>
        </div>
        <p className="title">{title}</p>
        <div className="datetime">
            <div className="flex flex-row gap-2">
                <Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
                <p className="location">{date}</p>
            </div>
            <div className="flex flex-row gap-2">
                <Image src="/icons/clock.svg" alt="time" width={14} height={14} />
                <p className="location">{time}</p>
            </div>
        </div>
    </Link>
  )
}

export default EventCard
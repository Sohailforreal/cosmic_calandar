import EventCard from './EventCard';

export default function ExactYearSection({
  events,
  year
}) {
  if (!events.length) {
    return null;
  }

  return (
    <section className="space-y-5">

      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">

        <h2 className="text-xs font-mono uppercase tracking-widest font-bold">
          Your birth year · {year}
        </h2>

        <span className="text-[10px] font-mono text-neutral-400">
          {events.length}
        </span>

      </div>

      <div className="grid grid-cols-1 gap-6">

        {events.map((event, index) => (
          <EventCard
            key={event.id || `${event.title}-${index}`}
            event={event}
            featured
          />
        ))}

      </div>

    </section>
  );
}
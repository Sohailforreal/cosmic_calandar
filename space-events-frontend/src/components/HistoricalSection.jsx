import EventCard from './EventCard';

export default function HistoricalSection({
  events,
  date
}) {
  return (
    <section className="space-y-5">

      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">

        <h2 className="text-xs font-mono uppercase tracking-widest">
          On this day · {date}
        </h2>

        <span className="text-[10px] font-mono text-neutral-400">
          {events.length}
        </span>

      </div>

      {events.length === 0 ? (

        <div className="py-10 text-center text-xs font-mono text-neutral-400 border border-dashed border-neutral-200">
          No events found.
        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {events.map((event, index) => (
            <EventCard
              key={event.id || `${event.title}-${index}`}
              event={event}
            />
          ))}

        </div>

      )}

    </section>
  );
}
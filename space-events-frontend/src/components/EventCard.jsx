import MinimalIllustration from './MinimalIllustration';

export default function EventCard({
  event,
  featured = false
}) {
  const isLaunch = event.category === 'launch';

  const isConjunction =
    event.category === 'conjunction';

  const title =
    event.title ||
    event.name ||
    'Untitled event';

  const year =
    event.year ||
    (
      event.date
        ? new Date(event.date).getUTCFullYear()
        : ''
    );

  const description =
    event.description ||
    event.details ||
    '';

  /*
   * Featured card
   * Used for events from the selected birth year.
   */
  if (featured) {
    return (
      <article className="border border-neutral-300 bg-white grid grid-cols-1 md:grid-cols-12 hover:border-neutral-900 transition">

        {/* Illustration */}
        <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-neutral-200">
          <MinimalIllustration
            category={event.category}
            title={title}
            className="w-full h-56 md:h-full"
          />
        </div>

        {/* Content */}
        <div className="md:col-span-7 p-6 md:p-8">

          {/* Category + Year */}
          <div className="flex items-center justify-between mb-4">

            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
              {event.category}
            </span>

            <span className="text-xs font-mono">
              {year}
            </span>

          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-normal leading-tight">
            {title}
          </h3>

          {/* Launch information */}
          {isLaunch && (
            <div className="mt-5 space-y-2 text-xs font-mono text-neutral-500">

              {event.rocket && (
                <div className="flex gap-3">
                  <span className="text-neutral-400 w-16">
                    Rocket
                  </span>

                  <span className="text-neutral-700">
                    {event.rocket}
                  </span>
                </div>
              )}

              {event.agency && (
                <div className="flex gap-3">
                  <span className="text-neutral-400 w-16">
                    Agency
                  </span>

                  <span className="text-neutral-700">
                    {event.agency}
                  </span>
                </div>
              )}

              {event.status && (
                <div className="flex gap-3">
                  <span className="text-neutral-400 w-16">
                    Status
                  </span>

                  <span className="text-neutral-700">
                    {event.status}
                  </span>
                </div>
              )}

            </div>
          )}

          {/* Conjunction information */}
          {isConjunction && (
            <div className="mt-5 text-xs font-mono text-neutral-500">

              <div className="flex gap-3">

                <span className="text-neutral-400 w-16">
                  Separation
                </span>

                <span className="text-neutral-700">
                  {event.separationDegrees}°
                </span>

              </div>

            </div>
          )}

          {/* Description */}
          {description && (
            <p className="mt-5 text-sm text-neutral-600 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}

        </div>

      </article>
    );
  }

  /*
   * Normal card
   * Used for historical / on-this-day events.
   */
  return (
    <article className="border border-neutral-200 bg-white hover:border-neutral-400 transition">

      {/* Illustration */}
      <MinimalIllustration
        category={event.category}
        title={title}
        className="w-full h-36"
      />

      <div className="p-5">

        {/* Category + Year */}
        <div className="flex items-center justify-between mb-3">

          <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400">
            {event.category}
          </span>

          <span className="text-xs font-mono">
            {year}
          </span>

        </div>

        {/* Title */}
        <h3 className="text-base font-medium leading-snug">
          {title}
        </h3>

        {/* Launch information */}
        {isLaunch && (
          <div className="mt-3 space-y-1.5 text-[11px] font-mono text-neutral-500">

            {event.rocket && (
              <div>
                {event.rocket}
              </div>
            )}

            {event.agency && (
              <div className="truncate">
                {event.agency}
              </div>
            )}

            {event.status && (
              <div>
                {event.status}
              </div>
            )}

          </div>
        )}

        {/* Conjunction information */}
        {isConjunction && (
          <div className="mt-3 text-[11px] font-mono text-neutral-500">
            Separation {event.separationDegrees}°
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-xs text-neutral-600 leading-relaxed mt-2">
            {description}
          </p>
        )}

      </div>

    </article>
  );
}
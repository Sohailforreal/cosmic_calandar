function Stat({
  label,
  value,
  border = true
}) {
  return (
    <div
      className={`px-3 py-1 ${
        border ? 'border-r border-neutral-200' : ''
      }`}
    >
      <span className="block text-[9px] uppercase tracking-wider text-neutral-400 mb-1">
        {label}
      </span>

      <span className="text-sm text-neutral-900">
        {value}
      </span>
    </div>
  );
}

export default function AstronomyStats({
  astronomy
}) {
  if (!astronomy) {
    return null;
  }

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 border-y border-neutral-200 py-5">

      <Stat
        label="Moon"
        value={
          astronomy.moonPhase?.name || 'N/A'
        }
      />

      <Stat
        label="Light"
        value={`${astronomy.moonPhase?.illuminationPercent ?? 'N/A'}%`}
      />

      <Stat
        label="Eclipses"
        value={
          astronomy.eclipses?.length || 0
        }
      />

      <Stat
        label="Conjunctions"
        value={
          astronomy.conjunctions?.length || 0
        }
        border={false}
      />

    </section>
  );
}

export default function Presets({
  presets,
  selectedDate,
  onSelect
}) {
  return (
    <div className="flex flex-wrap gap-2">

      {presets.map((preset) => (
        <button
          key={preset.date}
          type="button"
          onClick={() => onSelect(preset.date)}
          className={`px-2.5 py-1.5 text-[11px] font-mono border transition ${
            selectedDate === preset.date
              ? 'bg-neutral-900 text-white border-neutral-900'
              : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
          }`}
        >
          {preset.label}
        </button>
      ))}

    </div>
  );
}
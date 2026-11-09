import { Calendar, RefreshCw } from 'lucide-react';

export default function DatePicker({
  selectedDate,
  onChange,
  onQuery,
  loading
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">

      <div className="flex items-center gap-3 bg-neutral-100 border border-neutral-200 px-4 py-3">
        
        <Calendar className="w-4 h-4 text-neutral-500" />

        <input
          type="date"
          value={selectedDate}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="bg-transparent text-sm font-mono focus:outline-none text-neutral-900"
        />

      </div>

      <button
        type="button"
        onClick={onQuery}
        disabled={loading}
        className="bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-3 text-xs uppercase tracking-widest font-mono transition flex items-center justify-center gap-2 disabled:opacity-50"
      >

        <RefreshCw
          className={`w-3.5 h-3.5 ${
            loading ? 'animate-spin' : ''
          }`}
        />

        {loading ? 'Loading' : 'Query'}

      </button>

    </div>
  );
}
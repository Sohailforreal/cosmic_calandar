import React, { useEffect, useState } from 'react';

import Header from './components/Header';
import DatePicker from './components/DatePicker';
import Presets from './components/Presets';
import AstronomyStats from './components/AstronomyStats';
import ExactYearSection from './components/ExactYearSection';
import HistoricalSection from './components/HistoricalSection';

export default function App() {
  const [selectedDate, setSelectedDate] =
    useState('1969-07-16');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [data, setData] =
    useState(null);

  const presets = [
    {
      label: 'Apollo 11',
      date: '1969-07-16'
    },
    {
      label: 'Great American Eclipse',
      date: '2017-08-21'
    },
    {
      label: 'Perseid Peak',
      date: '1990-08-12'
    },
    {
      label: 'Sputnik 1',
      date: '1957-10-04'
    }
  ];

  const handleFetch = async (date) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `http://localhost:4000/api/events?date=${date}`,
        {
          signal: AbortSignal.timeout(5000)
        }
      );

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}`
        );
      }

      const result = await response.json();


console.log('API RESPONSE:', result);
console.log('LAUNCHES:', result.launches);
console.log('HISTORICAL:', result.historical);

      setData(result);
    } catch (err) {
      console.error(
        'Failed to fetch space events:',
        err
      );

      setError(
        'Unable to load events. Check that the backend is running.'
      );

      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch(selectedDate);
  }, [selectedDate]);

  /*
    The backend already separates these events using
    isExactYear, so React only needs to filter them.
  */

    const launches = Array.isArray(data?.launches)
  ? data.launches.map((launch) => ({
      ...launch,

      title: launch.name,

      year: launch.date
        ? new Date(launch.date).getUTCFullYear()
        : null,

      category: 'launch',

      description: ''
    }))
  : [];

const historical = Array.isArray(data?.historical)
  ? data.historical.map((event) => ({
      ...event,

      category: 'historical',

      description: ''
    }))
  : [];

/*
  Convert astronomy conjunctions into cards.
  They belong in "On This Day", not "Your Birth Year",
  because they are astronomical events for the selected date.
*/
const conjunctions = Array.isArray(
  data?.astronomy?.conjunctions
)
  ? data.astronomy.conjunctions.map(
      (conjunction, index) => ({
        id: `conjunction-${index}`,

        title: `${conjunction.bodies.join(
          ' · '
        )} Conjunction`,

        year: Number(
          selectedDate.substring(0, 4)
        ),

        date: selectedDate,

        category: 'conjunction',

        separationDegrees:
          conjunction.separationDegrees,

        isExactYear: false
      })
    )
  : [];

/*
  Combine all events that should appear
  in the On This Day section.
*/
const allEvents = [
  ...launches,
  ...historical,
  ...conjunctions
].sort((a, b) => {
  const dateA = a.date
    ? new Date(a.date).getTime()
    : new Date(`${a.year}-01-01`).getTime();

  const dateB = b.date
    ? new Date(b.date).getTime()
    : new Date(`${b.year}-01-01`).getTime();

  return dateB - dateA;
});

const exactYearEvents = allEvents.filter(
  (event) => event.isExactYear
);

const historicalEvents = allEvents.filter(
  (event) => !event.isExactYear
);


  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans antialiased overflow-x-hidden">

      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-10">

        {/* Hero */}
        <section className="max-w-4xl space-y-7">

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight leading-[1.05]">
            Cosmic history on{' '}
            <span className="font-serif italic text-neutral-400">
              your day.
            </span>
          </h1>

          <DatePicker
            selectedDate={selectedDate}
            onChange={setSelectedDate}
            onQuery={() => handleFetch(selectedDate)}
            loading={loading}
          />

          <Presets
            presets={presets}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />

        </section>

        {/* Error */}
        {error && (
          <div className="border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-mono text-neutral-500">
            {error}
          </div>
        )}

        {/* Astronomy */}
        {data?.astronomy && (
          <AstronomyStats
            astronomy={data.astronomy}
          />
        )}

        {/* Exact year */}
        <ExactYearSection
          events={exactYearEvents}
          year={selectedDate.split('-')[0]}
        />

        {/* Historical */}
        <HistoricalSection
          events={historicalEvents}
          date={selectedDate.substring(5)}
        />

      </main>

      <footer className="border-t border-neutral-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between text-[10px] font-mono text-neutral-400">
          <span>Cosmic Index</span>
          <span>Space Events API</span>
        </div>
      </footer>

    </div>
  );
}
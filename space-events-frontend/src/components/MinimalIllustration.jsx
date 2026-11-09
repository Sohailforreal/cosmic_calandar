import React from 'react';

function hashString(value = '') {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

function getVariant(title = '', category = '') {
  return hashString(`${category}-${title}`) % 6;
}

/* -------------------------------------------------------
   LAUNCH PATTERNS
------------------------------------------------------- */

function LaunchPattern({ variant }) {
  const patterns = [

    // 1 — Diagonal trajectories
    <g key="1">
      <path
        d="M-100 220 L220 -20"
        stroke="#d4d4d4"
        strokeWidth="28"
        fill="none"
      />

      <path
        d="M80 300 L380 -20"
        stroke="#e5e5e5"
        strokeWidth="18"
        fill="none"
      />

      <path
        d="M500 300 L800 -20"
        stroke="#d4d4d4"
        strokeWidth="28"
        fill="none"
      />

      <path
        d="M700 300 L1020 20"
        stroke="#e5e5e5"
        strokeWidth="18"
        fill="none"
      />
    </g>,

    // 2 — Rising trajectories
    <g key="2">
      <path
        d="M-50 250 Q180 100 350 200 T750 130 T1050 80"
        stroke="#d8d8d8"
        strokeWidth="32"
        fill="none"
      />

      <path
        d="M-50 290 Q180 140 350 240 T750 170 T1050 120"
        stroke="#eeeeee"
        strokeWidth="18"
        fill="none"
      />
    </g>,

    // 3 — Angular flight paths
    <g key="3">
      <path
        d="M-20 220 L180 80 L350 200 L520 50 L700 180 L880 40 L1030 130"
        stroke="#d5d5d5"
        strokeWidth="30"
        fill="none"
      />

      <path
        d="M-20 150 L150 30 L320 150 L490 10 L660 140 L830 20 L1030 100"
        stroke="#eeeeee"
        strokeWidth="15"
        fill="none"
      />
    </g>,

    // 4 — Launch arcs
    <g key="4">
      <path
        d="M-100 240 C150 0 350 0 500 180"
        stroke="#d6d6d6"
        strokeWidth="35"
        fill="none"
      />

      <path
        d="M350 300 C550 40 750 30 1100 190"
        stroke="#e8e8e8"
        strokeWidth="22"
        fill="none"
      />
    </g>,

    // 5 — Vertical launch paths
    <g key="5">
      <path
        d="M120 300 L350 -20"
        stroke="#e0e0e0"
        strokeWidth="45"
        fill="none"
      />

      <path
        d="M450 300 L650 -20"
        stroke="#d2d2d2"
        strokeWidth="25"
        fill="none"
      />

      <path
        d="M780 300 L980 -20"
        stroke="#e5e5e5"
        strokeWidth="40"
        fill="none"
      />
    </g>,

    // 6 — Layered motion
    <g key="6">
      <path
        d="M-50 80 L250 220 L500 40 L750 210 L1050 60"
        stroke="#d5d5d5"
        strokeWidth="26"
        fill="none"
      />

      <path
        d="M-50 150 L250 290 L500 110 L750 280 L1050 130"
        stroke="#ededed"
        strokeWidth="16"
        fill="none"
      />
    </g>
  ];

  return patterns[variant];
}

/* -------------------------------------------------------
   HISTORICAL PATTERNS
------------------------------------------------------- */

function HistoricalPattern({ variant }) {
  const patterns = [

    // 1 — Soft circles
    <g key="1">
      <circle
        cx="100"
        cy="80"
        r="150"
        fill="#eeeeee"
      />

      <circle
        cx="400"
        cy="180"
        r="190"
        fill="#e2e2e2"
      />

      <circle
        cx="800"
        cy="40"
        r="180"
        fill="#eeeeee"
      />
    </g>,

    // 2 — Layered curves
    <g key="2">
      <path
        d="M-50 60 Q180 180 400 50 T850 70 T1100 30"
        stroke="#e5e5e5"
        strokeWidth="90"
        fill="none"
      />

      <path
        d="M-50 190 Q200 70 400 180 T850 160 T1100 190"
        stroke="#d9d9d9"
        strokeWidth="65"
        fill="none"
      />
    </g>,

    // 3 — Overlapping circles
    <g key="3">
      <circle
        cx="150"
        cy="140"
        r="180"
        fill="#e4e4e4"
      />

      <circle
        cx="430"
        cy="20"
        r="150"
        fill="#eeeeee"
      />

      <circle
        cx="750"
        cy="150"
        r="190"
        fill="#dedede"
      />

      <circle
        cx="980"
        cy="10"
        r="140"
        fill="#ededed"
      />
    </g>,

    // 4 — Wavy bands
    <g key="4">
      <path
        d="M-50 120 C150 0 300 180 500 60 S800 30 1050 130"
        stroke="#dcdcdc"
        strokeWidth="90"
        fill="none"
      />

      <path
        d="M-50 220 C150 100 300 280 500 160 S800 130 1050 230"
        stroke="#eeeeee"
        strokeWidth="50"
        fill="none"
      />
    </g>,

    // 5 — Large soft forms
    <g key="5">
      <circle
        cx="180"
        cy="100"
        r="190"
        fill="#e5e5e5"
      />

      <circle
        cx="560"
        cy="30"
        r="160"
        fill="#eeeeee"
      />

      <circle
        cx="900"
        cy="150"
        r="200"
        fill="#dddddd"
      />
    </g>,

    // 6 — Crossing waves
    <g key="6">
      <path
        d="M-40 40 C180 160 300 -20 500 70 S800 150 1050 30"
        stroke="#e4e4e4"
        strokeWidth="95"
        fill="none"
      />

      <path
        d="M-40 180 C180 60 300 220 500 110 S800 50 1050 180"
        stroke="#ededed"
        strokeWidth="60"
        fill="none"
      />
    </g>
  ];

  return patterns[variant];
}

/* -------------------------------------------------------
   METEOR SHOWER PATTERNS
------------------------------------------------------- */

function MeteorPattern({ variant }) {
  const patterns = [

    // 1 — Meteor diagonals
    <g key="1">
      <path
        d="M-50 40 L300 250"
        stroke="#d8d8d8"
        strokeWidth="35"
      />

      <path
        d="M180 -20 L550 240"
        stroke="#e8e8e8"
        strokeWidth="22"
      />

      <path
        d="M550 -20 L1000 270"
        stroke="#d2d2d2"
        strokeWidth="30"
      />
    </g>,

    // 2 — Falling lines
    <g key="2">
      <path
        d="M100 -20 L-30 180"
        stroke="#dddddd"
        strokeWidth="28"
      />

      <path
        d="M350 -20 L200 220"
        stroke="#eeeeee"
        strokeWidth="18"
      />

      <path
        d="M650 -20 L500 230"
        stroke="#d6d6d6"
        strokeWidth="32"
      />

      <path
        d="M950 -20 L800 230"
        stroke="#ededed"
        strokeWidth="18"
      />
    </g>,

    // 3 — Radiating paths
    <g key="3">
      <path
        d="M500 140 L0 0"
        stroke="#dddddd"
        strokeWidth="28"
      />

      <path
        d="M500 140 L250 0"
        stroke="#eeeeee"
        strokeWidth="18"
      />

      <path
        d="M500 140 L750 0"
        stroke="#dddddd"
        strokeWidth="28"
      />

      <path
        d="M500 140 L1000 0"
        stroke="#eeeeee"
        strokeWidth="18"
      />
    </g>,

    // 4 — Long streaks
    <g key="4">
      <path
        d="M-50 240 L350 -20"
        stroke="#d7d7d7"
        strokeWidth="45"
      />

      <path
        d="M250 280 L700 -20"
        stroke="#e8e8e8"
        strokeWidth="25"
      />

      <path
        d="M600 280 L1050 0"
        stroke="#d5d5d5"
        strokeWidth="40"
      />
    </g>,

    // 5 — Scattered streaks
    <g key="5">
      <path
        d="M40 40 L220 120"
        stroke="#d6d6d6"
        strokeWidth="22"
      />

      <path
        d="M300 10 L470 100"
        stroke="#eeeeee"
        strokeWidth="15"
      />

      <path
        d="M600 60 L820 170"
        stroke="#d5d5d5"
        strokeWidth="25"
      />

      <path
        d="M760 0 L1000 130"
        stroke="#e9e9e9"
        strokeWidth="16"
      />
    </g>,

    // 6 — Directional waves
    <g key="6">
      <path
        d="M-50 70 Q200 200 400 50 T850 80 T1100 30"
        stroke="#dcdcdc"
        strokeWidth="35"
        fill="none"
      />

      <path
        d="M-50 130 Q200 260 400 110 T850 140 T1100 90"
        stroke="#ededed"
        strokeWidth="18"
        fill="none"
      />
    </g>
  ];

  return patterns[variant];
}

/* -------------------------------------------------------
   CONJUNCTION PATTERNS
------------------------------------------------------- */

function ConjunctionPattern({ variant }) {
  const patterns = [

    // 1 — Orbit rings
    <g key="1">
      <ellipse
        cx="500"
        cy="140"
        rx="420"
        ry="100"
        fill="none"
        stroke="#d9d9d9"
        strokeWidth="35"
      />

      <ellipse
        cx="500"
        cy="140"
        rx="300"
        ry="70"
        fill="none"
        stroke="#eeeeee"
        strokeWidth="20"
      />
    </g>,

    // 2 — Intersecting orbits
    <g key="2">
      <ellipse
        cx="420"
        cy="140"
        rx="350"
        ry="90"
        fill="none"
        stroke="#dddddd"
        strokeWidth="30"
      />

      <ellipse
        cx="600"
        cy="140"
        rx="350"
        ry="90"
        fill="none"
        stroke="#eeeeee"
        strokeWidth="22"
      />
    </g>,

    // 3 — Circular field
    <g key="3">
      <circle
        cx="500"
        cy="140"
        r="190"
        fill="none"
        stroke="#dddddd"
        strokeWidth="40"
      />

      <circle
        cx="500"
        cy="140"
        r="120"
        fill="none"
        stroke="#eeeeee"
        strokeWidth="25"
      />
    </g>,

    // 4 — Crossing orbital paths
    <g key="4">
      <ellipse
        cx="500"
        cy="140"
        rx="450"
        ry="60"
        fill="none"
        stroke="#d7d7d7"
        strokeWidth="30"
        transform="rotate(25 500 140)"
      />

      <ellipse
        cx="500"
        cy="140"
        rx="450"
        ry="60"
        fill="none"
        stroke="#eeeeee"
        strokeWidth="20"
        transform="rotate(-25 500 140)"
      />
    </g>,

    // 5 — Concentric arcs
    <g key="5">
      <path
        d="M-50 140 A550 180 0 0 1 1050 140"
        fill="none"
        stroke="#dddddd"
        strokeWidth="35"
      />

      <path
        d="M50 140 A450 140 0 0 1 950 140"
        fill="none"
        stroke="#eeeeee"
        strokeWidth="20"
      />
    </g>,

    // 6 — Multiple orbital lines
    <g key="6">
      <ellipse
        cx="500"
        cy="140"
        rx="470"
        ry="120"
        fill="none"
        stroke="#dedede"
        strokeWidth="24"
      />

      <ellipse
        cx="500"
        cy="140"
        rx="360"
        ry="90"
        fill="none"
        stroke="#eeeeee"
        strokeWidth="18"
      />

      <ellipse
        cx="500"
        cy="140"
        rx="250"
        ry="60"
        fill="none"
        stroke="#d5d5d5"
        strokeWidth="15"
      />
    </g>
  ];

  return patterns[variant];
}

/* -------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------- */

export default function MinimalIllustration({
  category = 'historical',
  title = '',
  className = ''
}) {
  const normalizedCategory =
    category?.toLowerCase() || 'historical';

  const variant = getVariant(
    title,
    normalizedCategory
  );

  let pattern;

  switch (normalizedCategory) {
    case 'launch':
      pattern = (
        <LaunchPattern variant={variant} />
      );
      break;

    case 'meteorshower':
    case 'meteor-shower':
      pattern = (
        <MeteorPattern variant={variant} />
      );
      break;

    case 'conjunction':
      pattern = (
        <ConjunctionPattern
          variant={variant}
        />
      );
      break;

    default:
      pattern = (
        <HistoricalPattern
          variant={variant}
        />
      );
  }

  return (
    <div
      className={`overflow-hidden bg-[#f5f5f5] ${className}`}
    >
      <svg
        viewBox="0 0 1000 280"
        className="w-full h-full block"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Base */}
        <rect
          width="1000"
          height="280"
          fill="#f5f5f5"
        />

        {/* Pattern */}
        {pattern}
      </svg>
    </div>
  );
}
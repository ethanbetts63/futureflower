import 'flag-icons/css/flag-icons.min.css';

const countries = [
  { name: 'United Kingdom', code: 'gb' },
  { name: 'France', code: 'fr' },
  { name: 'Germany', code: 'de' },
  { name: 'Italy', code: 'it' },
  { name: 'Spain', code: 'es' },
  { name: 'Portugal', code: 'pt' },
  { name: 'Netherlands', code: 'nl' },
  { name: 'Belgium', code: 'be' },
  { name: 'Austria', code: 'at' },
  { name: 'Switzerland', code: 'ch' },
  { name: 'Ireland', code: 'ie' },
  { name: 'Sweden', code: 'se' },
  { name: 'Norway', code: 'no' },
  { name: 'Denmark', code: 'dk' },
  { name: 'Finland', code: 'fi' },
  { name: 'Poland', code: 'pl' },
  { name: 'Czech Republic', code: 'cz' },
  { name: 'Greece', code: 'gr' },
  { name: 'Romania', code: 'ro' },
  { name: 'Hungary', code: 'hu' },
  { name: 'Croatia', code: 'hr' },
  { name: 'Slovakia', code: 'sk' },
  { name: 'Slovenia', code: 'si' },
  { name: 'Bulgaria', code: 'bg' },
  { name: 'Estonia', code: 'ee' },
  { name: 'Latvia', code: 'lv' },
  { name: 'Lithuania', code: 'lt' },
  { name: 'Luxembourg', code: 'lu' },
  { name: 'Malta', code: 'mt' },
  { name: 'Cyprus', code: 'cy' },
  { name: 'Iceland', code: 'is' },
  { name: 'USA', code: 'us' },
  { name: 'Canada', code: 'ca' },
  { name: 'Australia', code: 'au' },
  { name: 'New Zealand', code: 'nz' },
];

const CountryPill = ({ name, code }: { name: string; code: string }) => (
  <span className="inline-flex items-center gap-1.5 bg-[var(--background-white)] rounded-full px-3 py-1 shadow-md text-xs font-medium text-black whitespace-nowrap flex-shrink-0">
    <span className={`fi fi-${code}`} style={{ fontSize: '0.9em' }} />
    {name}
  </span>
);

const AnnouncementBar = () => {
  return (
    <div className="bg-[var(--color3)] overflow-hidden pt-2 pb-1">
      <div className="ticker-track flex gap-3">
        {countries.map((c) => (
          <CountryPill key={c.code} name={c.name} code={c.code} />
        ))}
        {/* Duplicate for seamless loop */}
        {countries.map((c) => (
          <CountryPill key={`dup-${c.code}`} name={c.name} code={c.code} />
        ))}
      </div>

      <style>{`
        .ticker-track {
          animation: ticker-scroll 180s linear infinite;
          width: max-content;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default AnnouncementBar;

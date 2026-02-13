import 'flag-icons/css/flag-icons.min.css';

const AnnouncementBar = () => {
  return (
    <div className="bg-[var(--color3)]">
      <p className="text-center text-black/70 text-xs sm:text-sm pt-1 px-4 tracking-wide font-medium">
        <span>Flower Delivery to </span>
        <span className="inline-flex items-center gap-1">Europe <span className="fi fi-eu" style={{ fontSize: '0.85em' }} /></span>
        <span className="mx-1 sm:mx-1.5 text-black/25">{'\u00B7'}</span>
        <span className="inline-flex items-center gap-1">UK <span className="fi fi-gb" style={{ fontSize: '0.85em' }} /></span>
        <span className="mx-1 sm:mx-1.5 text-black/25">{'\u00B7'}</span>
        <span className="inline-flex items-center gap-1">USA <span className="fi fi-us" style={{ fontSize: '0.85em' }} /></span>
        <span className="mx-1 sm:mx-1.5 text-black/25">{'\u00B7'}</span>
        <span className="inline-flex items-center gap-1">Canada <span className="fi fi-ca" style={{ fontSize: '0.85em' }} /></span>
        <span className="mx-1 sm:mx-1.5 text-black/25">{'\u00B7'}</span>
        <span className="inline-flex items-center gap-1">Australia <span className="fi fi-au" style={{ fontSize: '0.85em' }} /></span>
        <span className="mx-1 sm:mx-1.5 text-black/25">{'\u00B7'}</span>
        <span className="inline-flex items-center gap-1">New Zealand <span className="fi fi-nz" style={{ fontSize: '0.85em' }} /></span>
      </p>
    </div>
  );
};

export default AnnouncementBar;

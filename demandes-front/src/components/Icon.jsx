const paths = {
  shield: 'M12 3 20 6v6c0 5-5 8-8 10-3-2-8-5-8-10V6z M8 12l3 3 5-6',
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  ticket: 'M5 3h14v18l-4-2-3 2-3-2-4 2z M8 8h8 M8 12h6',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M16 3a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  user: 'M20 21v-2a7 7 0 0 0-14 0v2 M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  plus: 'M12 5v14 M5 12h14',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  check: 'm5 12 4 4L19 6',
  x: 'M18 6 6 18 M6 6l12 12',
  clock: 'M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  alert: 'm12 3 10 18H2z M12 9v5 M12 17v.1',
  logout: 'M9 5H4v14h5 M9 12h12 M17 8l4 4-4 4',
  search: 'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  activity: 'M2 12h4l3-8 6 16 3-8h4',
  lock: 'M5 10h14v11H5z M8 10V6a4 4 0 0 1 8 0v4',
  chevron: 'm9 5 7 7-7 7'
};

export default function Icon({ name, size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d={paths[name] || paths.ticket} />
    </svg>
  );
}

import { StarIcon } from './Icons';
export default function Stars({ value = 5 }) {
  const n = Math.round(Number(value) || 0);
  return (
    <span className="stars" role="img" aria-label={`${n} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} style={{ opacity: i <= n ? 1 : 0.25 }} />)}
    </span>
  );
}

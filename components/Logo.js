// Simple Digi Art’s Store wordmark. Replace with <img src="/logo.svg" alt="Digi Art’s Store"> when you have your own logo file.
export default function Logo({ className }) {
  return (
    <img src="../images/digi-arts-brand-logo.png" alt="Digiart" className={`img-fluid w-50 ${className}`} />
  );
}

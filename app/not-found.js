import Link from "next/link";
export const metadata = { title: "Page not found" };
export default function NotFound() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center" }}>
        <h1>404</h1>
        <p style={{ margin: "1rem 0 2rem" }}>We couldn’t find that page.</p>
        <Link href="/" className="btn">
          Back to home
        </Link>
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <section className="collection">
      <div className="container">
        <h1 className="collection__title">&nbsp;</h1>
        <div className="toolbar"><div className="toolbar__strip" /><div className="toolbar__bar" /></div>
        <div className="grid" aria-busy="true" aria-label="Loading products">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}><div className="pcard__media skeleton" /><div className="skeleton" style={{ height: 16, margin: '16px 0 8px', width: '80%' }} /><div className="skeleton" style={{ height: 14, width: '30%' }} /></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function MapPage() {
  return (
    <div className="space-y-4">
      <section className="card">
        <h1 className="section-title">Pegadapalli Map</h1>
        <p className="mt-2 text-sm">Coordinates: 18.8240N, 79.5849E</p>
      </section>

      <section className="card p-2">
        <iframe
          title="Pegadapalli Village Map"
          className="h-[70vh] min-h-80 w-full rounded-xl border"
          loading="lazy"
          src="https://www.google.com/maps?q=18.8240,79.5849&z=14&output=embed"
        />
      </section>
    </div>
  );
}

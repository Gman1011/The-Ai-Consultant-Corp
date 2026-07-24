interface Section {
  heading: string;
  body: string[];
}

export default function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: Section[];
}) {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <h1 className="mt-10 font-display text-4xl font-bold text-grape">{title}</h1>
      <p className="mt-2 text-sm text-grape/60">Last updated: {updated}</p>
      <div className="card mt-8 space-y-8 p-8">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-xl font-bold text-lavender-600">{s.heading}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3 text-sm leading-relaxed text-grape/80">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

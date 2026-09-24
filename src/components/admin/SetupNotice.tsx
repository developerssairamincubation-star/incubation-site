export function DatabaseRequired() {
  return (
    <div className="rounded-2xl border border-gold/40 bg-white p-8">
      <h1 className="text-[20px] font-bold">Connect a database to start editing</h1>
      <p className="mt-2 max-w-[620px] text-[15px] leading-relaxed text-ink-soft">
        Content edits are stored in a Neon Postgres database. In Vercel, open this project →
        Storage → Create Database → Neon, then redeploy. The site keeps showing its current
        content until then.
      </p>
    </div>
  );
}

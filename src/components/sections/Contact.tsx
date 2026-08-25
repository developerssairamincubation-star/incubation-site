"use client";

import { useState } from "react";
import { SITE } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";

const inputClasses =
  "w-full rounded-[4px] border border-line/60 bg-cream-soft/60 px-5 py-4 text-[16px] text-ink placeholder:text-ink-soft/70 outline-none transition-colors focus:border-gold";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // No backend yet — hand the message to the visitor's mail client,
  // addressed to the incubation inbox.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Incubation enquiry from ${form.name || "the website"}`,
    );
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}${form.email ? ` (${form.email})` : ""}`,
    );
    window.location.href = `mailto:${SITE.emails[0]}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="border-t border-line/40">
      <div className="grid lg:grid-cols-2">
        <div className="bg-cream px-6 py-20 lg:px-16 lg:py-24">
          <Reveal>
            <p className="text-[13px] font-medium tracking-[0.22em] text-ink-soft uppercase">
              Get in touch
            </p>
            <h2 className="mt-4 font-serif text-[clamp(32px,3vw,48px)]">
              Come talk to us
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 space-y-2 text-[17px]">
              <p>
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-rust">
                  {SITE.phone}
                </a>
              </p>
              {SITE.emails.map((email) => (
                <p key={email}>
                  <a href={`mailto:${email}`} className="text-rust underline-offset-4 hover:underline">
                    {email}
                  </a>
                </p>
              ))}
              <p className="text-ink-soft">{SITE.instagram}</p>
            </div>
            <address className="mt-8 text-[17px] leading-relaxed not-italic">
              {SITE.name}
              <br />
              {SITE.address}
            </address>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-10 overflow-hidden rounded-[8px] border border-line/50">
              <iframe
                title={`Map — ${SITE.name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`}
                className="h-[240px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>

        <div className="border-t border-line/40 bg-paper px-6 py-20 lg:border-t-0 lg:border-l lg:px-16 lg:py-24">
          <Reveal>
            <p className="text-[13px] font-medium tracking-[0.22em] text-ink-soft uppercase">
              Send a message
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <input
                type="text"
                required
                placeholder="Name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClasses}
              />
              <input
                type="email"
                required
                placeholder="Email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClasses}
              />
              <textarea
                required
                rows={6}
                placeholder="Tell us a little about what you're building"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${inputClasses} resize-y`}
              />
              <button
                type="submit"
                className="rounded-[4px] bg-ink px-8 py-4 text-[16px] font-semibold text-white transition-transform duration-300 hover:scale-[1.03]"
              >
                Send message
              </button>
            </form>
          </Reveal>
        </div>
      </div>

      <footer className="border-t border-line/40 bg-cream px-6 py-6 text-center text-[13px] text-ink-soft">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </footer>
    </section>
  );
}

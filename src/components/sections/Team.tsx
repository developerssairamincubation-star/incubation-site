import Image from "next/image";
import type { TeamMember } from "@/lib/content/schema";
import { Reveal } from "@/components/ui/Reveal";

export function Team({ members }: { members: TeamMember[] }) {
  // Managed in /admin — the section only appears once someone is added.
  if (members.length === 0) return null;

  return (
    <section
      id="team"
      className="border-t border-line/40 bg-cream px-6 py-24 lg:px-16 lg:py-32"
    >
      <div className="mx-auto max-w-[1728px] text-center">
        <Reveal>
          <p className="text-[13px] font-medium tracking-[0.22em] text-ink-soft uppercase">
            Our team
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mx-auto mt-5 max-w-[760px] font-serif text-[clamp(26px,2.4vw,38px)] leading-[1.15]">
            The people behind the foundation
          </h2>
        </Reveal>

        <ul className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-14">
          {members.map((member, i) => (
            <li key={member.id} className="w-[240px]">
              <Reveal delay={Math.min(i, 6) * 0.06}>
                <article>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-cream-soft shadow-[0px_10px_28px_rgba(0,0,0,0.08)]">
                    <Image
                      src={member.photo}
                      alt={`Photo of ${member.name}`}
                      fill
                      sizes="240px"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-6 text-[20px] font-bold leading-tight text-ink md:text-[22px]">
                    {member.name}
                  </h3>
                  {member.role && (
                    <p className="mt-1.5 text-[13px] font-semibold tracking-[0.14em] text-gold uppercase">
                      {member.role}
                    </p>
                  )}
                  <p className="mt-4 text-[15px] leading-[1.75] whitespace-pre-line text-ink-soft md:text-[16px]">
                    {member.bio}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

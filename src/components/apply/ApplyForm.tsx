"use client";

import { useId, useRef, useState } from "react";
import clsx from "clsx";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { SITE } from "@/lib/data";

type ApplicationMode = "student" | "startup" | "partner";
type StudentTrack = "startup" | "research";
type StartupType = "private-limited" | "msme";

const THRUST_AREAS = [
  "Select thrust area...",
  "Defence & Aerospace",
  "Drones & UAV",
  "Robotics",
  "Healthcare",
  "Agriculture",
  "Solid waste management",
  "Additive manufacturing",
];

const STAGES = [
  "Select stage...",
  "Idea",
  "Prototype",
  "Pilot",
  "Revenue",
  "Growth",
];

const NATURES = [
  "Select nature...",
  "Private limited",
  "Public limited",
  "LLP",
  "MSME",
  "Other",
];

const DOMAINS = [
  "Select domain...",
  "R&D collaboration",
  "Mentorship",
  "Pilot project",
  "Lab access",
  "Joint venture",
];

const ENGAGEMENTS = [
  "Select engagement...",
  "Mentor partnership",
  "Pilot project",
  "Sponsorship / CSR",
  "Research collaboration",
  "Incubation support",
];

const inputClasses =
  "w-full rounded-[4px] border border-line/60 bg-cream-soft/60 px-5 py-4 text-[16px] text-ink placeholder:text-ink-soft/70 outline-none transition-colors focus:border-gold";

// Keep in step with the limit enforced by /api/apply.
const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const ORG_TYPES = ["Company / MSME", "Startup", "OPC", "Institution", "Others"];

const FIELD_LABELS: Record<string, string> = {
  applicationType: "Application type",
  fullName: "Full name",
  roleDesignation: "Role / designation",
  email: "Email",
  phone: "Phone",
  companyName: "Company name",
  startupName: "Startup name",
  institutionName: "Institution / college",
  organizationType: "Applying as",
  organizationName: "Name",
  cityState: "City / state",
  natureOfCompany: "Nature of company",
  domain: "Domain",
  engagement: "How would you like to engage",
  memberName: "Member name",
  memberRole: "Member role",
  memberLinkedin: "Member LinkedIn",
  memberInstagram: "Member Instagram",
  memberOther: "Member other profile",
  memberBio: "Member short bio",
  projectTitle: "Project title",
  thrustArea: "Thrust area",
  thrustAreaOther: "Thrust area (other)",
  currentStage: "Current stage",
  teamSize: "Team size",
  projectDescription: "Project description",
  partnershipVision: "Partnership vision",
  workLink: "Work link",
  track: "Track",
  startupType: "Company type",
};

function getFieldLabel(key: string) {
  return FIELD_LABELS[key] ?? key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (value) => value.toUpperCase());
}

function CardField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-3">
      <span className="block text-[13px] font-medium tracking-[0.2em] text-ink-soft uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput({
  name,
  label,
  placeholder,
  type = "text",
  required = true,
  autoComplete,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <CardField label={label}>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputClasses}
      />
    </CardField>
  );
}

function SelectInput({
  name,
  label,
  options,
  required = true,
  onChange,
}: {
  name: string;
  label: string;
  options: string[];
  required?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <CardField label={label}>
      <select
        name={name}
        required={required}
        defaultValue=""
        onChange={onChange ? (e) => onChange(e.target.value) : undefined} className={`${inputClasses} pr-12`}
      >
        <option value="" disabled>
          {options[0]}
        </option>
        {options.slice(1).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </CardField>
  );
}

function TextAreaInput({
  name,
  label,
  placeholder,
  rows = 6,
  required = true,
}: {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <CardField label={label}>
      <textarea
        name={name}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className={`${inputClasses} resize-y`}
      />
    </CardField>
  );
}

function SectionTitle({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <p className="text-[13px] font-medium tracking-[0.22em] text-gold uppercase">
        {step}
      </p>
      <h2 className="font-bold text-[clamp(26px,2vw,34px)] text-ink">
        {title}
      </h2>
      {description ? (
        <p className="w-full max-w-[560px] text-[15px] leading-relaxed text-ink-soft md:text-[17px]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function ModeCard({
  active,
  title,
  subtitle,
  buttonLabel,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  buttonLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex h-full flex-col border border-line/45 bg-paper p-6 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0px_14px_32px_rgba(0,0,0,0.08)]",
        active && "border-ink/30 shadow-[0px_14px_32px_rgba(0,0,0,0.08)]",
      )}
    >
      <p className="text-[12px] tracking-[0.2em] text-ink-soft uppercase">Apply</p>
      <h3 className="mt-4 font-bold text-[clamp(22px,2vw,28px)] text-ink">
        {title}
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft md:text-[16px]">
        {subtitle}
      </p>
      <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-ink">
        {buttonLabel}
        <ArrowIcon className="text-[11px]" />
      </span>
    </button>
  );
}

function TrackToggle({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "rounded-full border px-4 py-2 text-[14px] font-medium transition-all duration-300",
        active
          ? "border-ink bg-ink text-white"
          : "border-line/50 bg-cream text-ink hover:border-gold hover:text-gold",
      )}
      aria-pressed={active}
      value={value}
    >
      {label}
    </button>
  );
}

export function ApplyForm({
  hideModeCards = false,
  researchOnly = false,
}: {
  hideModeCards?: boolean;
  researchOnly?: boolean;
}) {
  const [mode, setMode] = useState<ApplicationMode>("student");
  const [studentTrack, setStudentTrack] = useState<StudentTrack>(researchOnly ? "research" : "startup");
  const [startupType, setStartupType] = useState<StartupType>("private-limited");
  const [status, setStatus] = useState<
    { state: "idle" | "sending" | "sent" } | { state: "error"; message: string }
  >({ state: "idle" });
  const [orgType, setOrgType] = useState("");
  const [thrustArea, setThrustArea] = useState("");
  const attachmentsId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attached, setAttached] = useState<File[]>([]);
  const stepNo = (standard: string, research: string) => (researchOnly ? research : standard);
  const isStudent = mode === "student";
  const isStartup = mode === "startup";
  const isPartner = mode === "partner";

  const applicantFieldTitle = isPartner
    ? "Applicant details"
    : "Applicant details";
  const memberTitle = isPartner ? "Founders & owners" : isStartup ? "Founders & owners" : "Team profiles";
  const memberLabel = isPartner ? "FOUNDER 01" : isStartup ? "FOUNDER 01" : "MEMBER 01";
  const memberButton = isPartner ? "+ ADD ANOTHER FOUNDER" : isStartup ? "+ ADD ANOTHER FOUNDER" : "+ ADD ANOTHER MEMBER";
  const stepFourTitle = isPartner
    ? "Tell us more"
    : isStudent && studentTrack === "research"
      ? "Your research"
      : isStudent
        ? "Your idea"
        : "Your venture";
  const stepFourLabel = isPartner
    ? "WHAT WOULD A SUCCESSFUL PARTNERSHIP LOOK LIKE FOR YOU? *"
    : isStudent && studentTrack === "research"
      ? "RESEARCH PROJECT TITLE *"
      : isStudent
        ? "IDEA TITLE *"
        : "PRODUCT / VENTURE NAME *";
  const stepFourDescriptionLabel = isPartner
    ? undefined
    : isStudent && studentTrack === "research"
      ? "DESCRIBE YOUR RESEARCH — PROBLEM, SOLUTION, WHAT YOU NEED FROM US *"
      : isStudent
        ? "DESCRIBE YOUR IDEA — PROBLEM, SOLUTION, WHAT YOU NEED FROM US *"
        : "DESCRIBE YOUR VENTURE — PROBLEM, SOLUTION, WHAT YOU NEED FROM US *";
  const submitLabel = isPartner ? "Submit partnership request" : "Submit application";

  // Mirror the chosen files into state so they can be listed and removed;
  // the input itself stays the source of truth for the submitted FormData.
  const syncFiles = (files: File[]) => {
    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));
    if (fileInputRef.current) fileInputRef.current.files = transfer.files;
    setAttached(files);
    const total = files.reduce((sum, file) => sum + file.size, 0);
    setStatus(
      total > MAX_ATTACHMENT_BYTES
        ? {
            state: "error",
            message: `Attachments total ${formatSize(total)} — the limit is 3 MB. Remove some, or share larger files through the link field.`,
          }
        : { state: "idle" },
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.state === "sending") return;
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const files = formData
      .getAll("attachments")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (files.reduce((sum, file) => sum + file.size, 0) > MAX_ATTACHMENT_BYTES) {
      setStatus({
        state: "error",
        message: "Attachments are over 3 MB in total. Remove some, or share larger files through the link field.",
      });
      return;
    }

    const selectedTrack = isStudent
      ? studentTrack
      : isStartup
        ? startupType
        : "partnership";

    const lines = [
      `Application type: ${mode}`,
      `Track: ${selectedTrack}`,
      "",
      ...Array.from(formData.entries())
        .filter(([key, value]) => key !== "attachments" && String(value).trim().length > 0)
        .map(([key, value]) => `${getFieldLabel(key)}: ${String(value)}`),
      ...(files.length > 0 ? ["", `Attachments: ${files.map((file) => file.name).join(", ")}`] : []),
    ];

    const subject = researchOnly
      ? "Application from the website - R&D Services / research track"
      : `Application from the website - ${mode}${isStudent ? ` / ${studentTrack}` : isStartup ? ` / ${startupType}` : ""}`;

    const payload = new FormData();
    payload.set("subject", subject);
    payload.set("body", lines.join("\n"));
    payload.set("replyTo", String(formData.get("email") ?? ""));
    files.forEach((file) => payload.append("attachments", file));

    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/apply", { method: "POST", body: payload });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      formEl.reset();
      setOrgType("");
      setThrustArea("");
      setAttached([]);
      setStatus({ state: "sent" });
    } catch (error) {
      setStatus({
        state: "error",
        message: error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-[1728px] px-6 pb-16 lg:px-10 lg:pb-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-10">
          {hideModeCards ? null : (
          <div className="grid gap-5 lg:grid-cols-3">
            <ModeCard
              active={isStudent}
              title="Student"
              subtitle="Current student or faculty of any institution with an idea or research project."
              buttonLabel="Apply as student"
              onClick={() => setMode("student")}
            />
            <ModeCard
              active={isStartup}
              title="Startup"
              subtitle="Registered venture seeking incubation, labs and funding pathways."
              buttonLabel="Apply as startup"
              onClick={() => setMode("startup")}
            />
            <ModeCard
              active={isPartner}
              title="Company"
              subtitle="Established company looking to partner, mentor or run R&D with us."
              buttonLabel="Partner with us"
              onClick={() => setMode("partner")}
            />
          </div>
          )}

          {mode !== "partner" && !researchOnly ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="mr-2 text-[13px] tracking-[0.2em] text-ink-soft uppercase">
                {isStudent ? "Track" : "Company type"}
              </p>
              {isStudent ? (
                <>
                  {researchOnly ? null : (
                    <TrackToggle
                      label="Startup track"
                      value="startup"
                      active={studentTrack === "startup"}
                      onClick={() => setStudentTrack("startup")}
                    />
                  )}
                  <TrackToggle
                    label="Research track"
                    value="research"
                    active={studentTrack === "research"}
                    onClick={() => setStudentTrack("research")}
                  />
                </>
              ) : (
                <>
                  <TrackToggle
                    label="Private limited"
                    value="private-limited"
                    active={startupType === "private-limited"}
                    onClick={() => setStartupType("private-limited")}
                  />
                  <TrackToggle
                    label="MSME"
                    value="msme"
                    active={startupType === "msme"}
                    onClick={() => setStartupType("msme")}
                  />
                </>
              )}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-8">
            {isPartner ? (
              <section className="space-y-6 border border-line/45 bg-paper p-6 lg:p-8">
                <SectionTitle
                  step="STEP 02"
                  title="Nature & domain"
                  description="Tell us what kind of company you are and how you want to engage."
                />
                <div className="grid gap-5 md:grid-cols-3">
                  <SelectInput name="natureOfCompany" label="NATURE OF COMPANY *" options={NATURES} />
                  <SelectInput name="domain" label="DOMAIN *" options={DOMAINS} />
                  <SelectInput name="engagement" label="HOW WOULD YOU LIKE TO ENGAGE? *" options={ENGAGEMENTS} />
                </div>
              </section>
            ) : null}

            <section className="space-y-6 border border-line/45 bg-paper p-6 lg:p-8">
              <SectionTitle
                step={stepNo("STEP 03", "STEP 01")}
                title={applicantFieldTitle}
                description={
                  isPartner
                    ? "Use the fields below for the person coordinating the partnership."
                    : "Use the fields below for the person leading the application."
                }
              />
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput name="fullName" label="FULL NAME *" placeholder="Full name" autoComplete="name" />
                <TextInput
                  name="roleDesignation"
                  label="ROLE / DESIGNATION *"
                  placeholder="e.g. Founder, CTO, Final-year student"
                />
                <TextInput name="email" label="EMAIL *" type="email" placeholder="Email address" autoComplete="email" />
                <TextInput name="phone" label="PHONE *" placeholder="Phone number" autoComplete="tel" />
                {isPartner ? (
                  <TextInput
                    name="companyName"
                    label="COMPANY NAME *"
                    placeholder="Company name"
                    autoComplete="organization"
                  />
                ) : isStartup ? (
                  <TextInput
                    name="startupName"
                    label="STARTUP NAME *"
                    placeholder="Startup name"
                    autoComplete="organization"
                  />
                ) : researchOnly ? (
                  <>
                    <CardField label="APPLYING AS *">
                      <select
                        name="organizationType"
                        required
                        value={orgType}
                        onChange={(e) => setOrgType(e.target.value)}
                        className={`${inputClasses} pr-12`}
                      >
                        <option value="" disabled>
                          Select one
                        </option>
                        {ORG_TYPES.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </CardField>
                    {orgType ? (
                      <TextInput
                        name="organizationName"
                        label={`${orgType.toUpperCase()} NAME *`}
                        placeholder={`${orgType} name`}
                        autoComplete="organization"
                      />
                    ) : null}
                  </>
                ) : (
                  <TextInput
                    name="institutionName"
                    label="INSTITUTION / COLLEGE *"
                    placeholder="Institution / college name"
                    autoComplete="organization"
                  />
                )}
                <TextInput name="cityState" label="CITY / STATE *" placeholder="e.g. Chennai, Tamil Nadu" />
              </div>
            </section>

            {researchOnly ? null : (
            <section className="space-y-6 border border-line/45 bg-paper p-6 lg:p-8">
              <SectionTitle
                step={stepNo("STEP 03.B", "STEP 02")}
                title={memberTitle}
                description="Profiles help the panel know your team."
              />
              <div className="space-y-6">
                <div className="rounded-[4px] border border-line/45 bg-cream-soft/35 p-5 md:p-6">
                  <p className="text-[13px] font-medium tracking-[0.22em] text-gold uppercase">
                    {memberLabel}
                  </p>
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <TextInput name="memberName" label="NAME *" placeholder="Name" autoComplete="name" />
                    <TextInput name="memberRole" label="ROLE *" placeholder="e.g. Co-founder & CEO" />
                    <TextInput name="memberLinkedin" label="LINKEDIN" placeholder="linkedin.com/in/..." required={false} />
                    <TextInput name="memberInstagram" label="INSTAGRAM" placeholder="@handle" required={false} />
                    <TextInput
                      name="memberOther"
                      label="OTHER — X / GITHUB / PORTFOLIO / SCHOLAR"
                      placeholder="https://..."
                      required={false}
                    />
                    <TextAreaInput
                      name="memberBio"
                      label="SHORT BIO — EXPERIENCE, SKILLS"
                      placeholder="e.g. 3 yrs embedded systems, 2 patents"
                      rows={4}
                      required={false}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-[14px] font-semibold text-gold transition-colors hover:text-ink"
                >
                  {memberButton}
                  <ArrowIcon className="text-[11px]" />
                </button>
              </div>
            </section>
            )}

            <section className="space-y-6 border border-line/45 bg-paper p-6 lg:p-8">
              <SectionTitle
                step={stepNo("STEP 04", "STEP 02")}
                title={stepFourTitle}
                description={
                  isPartner
                    ? "Tell us what a successful partnership should look like."
                    : "Share the essentials so the panel can understand the opportunity quickly."
                }
              />
              {isPartner ? (
                <div className="grid gap-5">
                  <TextAreaInput
                    name="partnershipVision"
                    label={stepFourLabel}
                    placeholder="Describe the kind of partnership, support or collaboration you want to build."
                    rows={8}
                  />
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  <TextInput
                    name="projectTitle"
                    label={stepFourLabel}
                    placeholder={isStudent ? "Idea title" : "Venture name"}
                  />
                  <SelectInput
                    name="thrustArea"
                    label="THRUST AREA *"
                    options={researchOnly ? [...THRUST_AREAS, "Others"] : THRUST_AREAS}
                    onChange={setThrustArea}
                  />
                  {researchOnly && thrustArea === "Others" ? (
                    <TextInput
                      name="thrustAreaOther"
                      label="PLEASE SPECIFY THRUST AREA *"
                      placeholder="Enter your thrust area"
                    />
                  ) : null}
                  <SelectInput name="currentStage" label="CURRENT STAGE *" options={STAGES} />
                  <TextInput name="teamSize" label="TEAM SIZE" placeholder="e.g. 3" required={false} />
                  <TextAreaInput
                    name="projectDescription"
                    label={stepFourDescriptionLabel ?? ""}
                    placeholder={
                      isStudent && studentTrack === "research"
                        ? "Describe the problem, your approach and what you need from us."
                        : isStudent
                          ? "Describe the problem, solution and what support you need from us."
                          : "Describe the problem, solution and what support you need from us."
                    }
                    rows={7}
                  />
                </div>
              )}
            </section>

            <section className="space-y-6 border border-line/45 bg-paper p-6 lg:p-8">
              <SectionTitle
                step={stepNo("STEP 05", "STEP 03")}
                title="Attachments"
                description="Optional, but recommended. Upload a pitch deck, demo video or supporting documents."
              />
              <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_260px]">
                <div className="space-y-4 rounded-[4px] border border-line/40 bg-cream-soft/50 p-5">
                  <p className="text-[15px] font-medium text-ink">PDF, DOC/DOCX, PPT/PPTX, MP4/MOV — up to 3 MB in total</p>
                  <p className="text-[15px] leading-relaxed text-ink-soft">
                    Add your strongest evidence, like a deck or short writeup. For larger files such as videos, share a link below.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <label
                    htmlFor={attachmentsId}
                    className="inline-flex cursor-pointer items-center justify-center rounded-[4px] border border-line/50 bg-cream px-5 py-4 text-[15px] font-semibold text-ink transition-colors hover:border-gold hover:text-gold"
                  >
                    Browse files
                  </label>
                  <input
                    id={attachmentsId}
                    name="attachments"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mov"
                    className="sr-only"
                    ref={fileInputRef}
                    onChange={(e) => {
                      // A new pick replaces the browser's selection, so merge
                      // with what was already attached (same name = replaced).
                      const picked = Array.from(e.target.files ?? []);
                      const kept = attached.filter((f) => !picked.some((p) => p.name === f.name));
                      syncFiles([...kept, ...picked]);
                    }}
                  />
                  {attached.length > 0 ? (
                    <ul className="space-y-2 text-[14px] text-ink">
                      {attached.map((file) => (
                        <li
                          key={file.name}
                          className="flex items-center justify-between gap-3 rounded-[4px] border border-line/40 bg-cream-soft/50 px-3 py-2"
                        >
                          <span className="min-w-0 truncate">
                            {file.name} <span className="text-ink-soft">({formatSize(file.size)})</span>
                          </span>
                          <button
                            type="button"
                            aria-label={`Remove ${file.name}`}
                            onClick={() => syncFiles(attached.filter((f) => f !== file))}
                            className="shrink-0 text-[13px] font-semibold text-gold hover:text-ink"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <TextInput
                    name="workLink"
                    label="LINK TO YOUR WORK — WEBSITE, VIDEO, DRIVE OR LINKEDIN"
                    placeholder="https://..."
                    type="url"
                    required={false}
                  />
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={status.state === "sending"}
              className="inline-flex items-center gap-3 rounded-[4px] bg-ink px-8 py-4 text-[16px] font-semibold text-white transition-transform duration-300 hover:scale-[1.03] disabled:cursor-wait disabled:opacity-60 disabled:hover:scale-100"
            >
              {status.state === "sending" ? "Sending…" : submitLabel}
              <ArrowIcon className="text-[11px]" />
            </button>
            <div aria-live="polite">
              {status.state === "sent" ? (
                <p className="text-[16px] font-medium text-ink">
                  Thank you — your submission has been sent. We&apos;ll be in touch soon.
                </p>
              ) : null}
              {status.state === "error" ? (
                <p role="alert" className="text-[16px] font-medium text-rust">
                  {status.message}
                </p>
              ) : null}
            </div>
          </form>
        </div>

        <aside className="lg:sticky lg:top-[92px] lg:h-[calc(100vh-120px)]">
          <div className="space-y-8 border border-line/45 bg-paper p-6 lg:h-full lg:overflow-auto lg:p-7">
            <div>
              <p className="text-[13px] tracking-[0.22em] text-ink-soft uppercase">
                How it works
              </p>
              <div className="mt-6 space-y-5">
                {[
                  ["01", "Apply online", "This form — 10 minutes."],
                  ["02", "Screening", "Shortlist within 10 working days."],
                  ["03", "Panel pitch", "Present to the incubation panel."],
                  ["04", "Onboarding", "Lab access, mentor match, funding plan."],
                ].map(([number, title, text]) => (
                  <div key={number} className="border-b border-line/30 pb-4 last:border-b-0 last:pb-0">
                    <p className="text-[13px] font-medium tracking-[0.22em] text-gold uppercase">
                      {number}
                    </p>
                    <p className="mt-2 font-semibold text-[17px] text-ink">{title}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-line/30 pt-6">
              <p className="text-[13px] tracking-[0.22em] text-ink-soft uppercase">Questions?</p>
              <p className="text-[17px] leading-relaxed text-ink-soft">
                Call {SITE.phone} or write to {SITE.emails[0]}.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

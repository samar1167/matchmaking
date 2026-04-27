"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";

const reportMetrics = [
  { label: "Understanding", value: 82, rating: "Very Good" },
  { label: "Durability", value: 95, rating: "Excellent" },
  { label: "Chemistry", value: 67, rating: "Good" },
  { label: "Sizzle", value: 40, rating: "Average" },
  { label: "Destiny", value: 70, rating: "Good" },
];

const trustItems = [
  {
    icon: "✓",
    title: "Science-backed approach",
    copy: "Compatibility based on real relationship dynamics.",
  },
  {
    icon: "◎",
    title: "Long-term focused",
    copy: "Built for relationship longevity, not just attraction.",
  },
  {
    icon: "▥",
    title: "Actionable insights",
    copy: "Clear, practical insights you can act on.",
  },
  {
    icon: "⊘",
    title: "No vague predictions",
    copy: "No astrology. No guesswork. Just real compatibility.",
  },
];

const testimonials = [
  {
    initials: "MR",
    name: "Maya R.",
    location: "Austin, TX",
    quote:
      "Luster helped me separate chemistry from actual long-term fit. The report was direct without feeling clinical.",
  },
  {
    initials: "DN",
    name: "Daniel N.",
    location: "Chicago, IL",
    quote:
      "The communication and conflict sections gave us language for conversations we kept avoiding.",
  },
  {
    initials: "SK",
    name: "Sofia K.",
    location: "San Diego, CA",
    quote:
      "I used it before committing more time, and the key insights were more useful than another vague quiz.",
  },
];

function LandingIcon({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#EABFB9] bg-[#fafafa] text-xl font-semibold text-[#961116]">
      {children}
    </span>
  );
}

function LandingButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`${
        variant === "primary"
          ? "inline-flex min-h-12 items-center justify-center rounded-[0.4rem] bg-[#901214] px-6 text-sm font-bold text-white shadow-[0_14px_28px_rgba(144,18,20,0.16)] transition hover:bg-[#961116]"
          : "inline-flex min-h-12 items-center justify-center rounded-[0.4rem] border border-[#C07771] bg-[#fafafa] px-6 text-sm font-bold text-[#901214] transition hover:border-[#901214]"
      } ${className}`}
    >
      {children}
    </Link>
  );
}

function CompatibilityReportCard() {
  return (
    <div className="rounded-2xl border border-[#EABFB9] bg-[#fafafa] p-6 shadow-[0_18px_42px_rgba(144,18,20,0.12)]">
      <h2 className="text-center text-xl font-bold tracking-tight text-[#2d1718]">
        Your Compatibility Snapshot
      </h2>

      <div className="mt-5 flex items-center justify-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#C07771] bg-[#EABFB9] text-xl font-bold text-[#901214]">
          Y
        </div>
        <div className="flex min-w-40 flex-col items-center">
          <div className="flex w-full items-center gap-3">
            <span className="h-px flex-1 border-t border-dashed border-[#C07771]" />
            <span className="text-xl text-[#901214]">♥</span>
            <span className="h-px flex-1 border-t border-dashed border-[#C07771]" />
          </div>
          <p className="mt-2 text-sm font-bold text-[#2d1718]">You & X</p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#C07771] bg-[#EABFB9] text-xl font-bold text-[#901214]">
          X
        </div>
      </div>

      <div className="mt-6 space-y-3.5">
        {reportMetrics.map((metric) => (
          <div key={metric.label} className="grid grid-cols-[1fr_1.25fr_auto] items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EABFB9] text-xs text-[#901214]">
                ♥
              </span>
              <span className="text-xs font-semibold text-[#2d1718]">{metric.label}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#EABFB9]">
              <div
                className="h-full rounded-full bg-[#A22E34]"
                style={{ width: `${metric.value}%` }}
              />
            </div>
            <span className="min-w-24 text-right text-xs font-bold text-[#2d1718]">
              {metric.rating}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-[#EABFB9] bg-[#fdf1f0] p-4">
        <p className="text-sm font-bold text-[#901214]">Key Insight</p>
        <p className="mt-1 text-sm leading-6 text-[#2d1718]">
          You share strong values and long-term goals. Work on communication style under stress.
        </p>
      </div>
    </div>
  );
}

function StepCard({
  icon,
  title,
  copy,
}: {
  icon: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="relative rounded-xl border border-[#EABFB9] bg-[#fafafa] p-5 shadow-[0_10px_24px_rgba(144,18,20,0.05)]">
      <div className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-[#901214] text-sm font-bold text-white">
        {icon}
      </div>
      <div className="flex gap-4 pt-3">
        <LandingIcon>{icon === "1" ? "♙" : icon === "2" ? "▤" : "♡"}</LandingIcon>
        <div>
          <h3 className="text-sm font-bold text-[#2d1718]">{title}</h3>
          <p className="mt-2 text-xs leading-5 text-[#2d1718]/75">{copy}</p>
        </div>
      </div>
    </div>
  );
}

function PersonCluster() {
  return (
    <div className="relative flex h-full min-h-44 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_72%_28%,rgba(255,255,255,0.58),transparent_26%),linear-gradient(180deg,#fdf1f0_0%,#f7e2de_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(192,119,113,0.12),transparent_30%)]" />
      <img
        src="/generated/find-compatible-network.png"
        alt="A network of compatible people"
        className="absolute inset-0 z-10 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-y-0 left-0 z-20 w-18 bg-[linear-gradient(90deg,#fdf1f0_0%,rgba(253,241,240,0.76)_42%,rgba(253,241,240,0)_100%)]" />
    </div>
  );
}

function UseCaseIllustration({ variant }: { variant: "known" | "discover" }) {
  if (variant === "discover") {
    return <PersonCluster />;
  }

  return (
    <div className="relative flex h-full min-h-44 items-end justify-center overflow-hidden bg-[radial-gradient(circle_at_34%_18%,rgba(255,255,255,0.72),transparent_30%),linear-gradient(180deg,#fdf1f0_0%,#f6deda_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(192,119,113,0.12),transparent_28%)]" />
      <img
        src="/generated/home-known-couple.png"
        alt="A smiling couple"
        className="absolute bottom-0 right-[-8%] z-10 h-[112%] w-[128%] max-w-none object-cover object-[58%_bottom]"
      />
      <div className="absolute inset-y-0 left-0 z-20 w-16 bg-[linear-gradient(90deg,#fdf1f0_0%,rgba(253,241,240,0.72)_45%,rgba(253,241,240,0)_100%)]" />
    </div>
  );
}

function TestimonialCard({
  initials,
  quote,
  name,
  location,
}: {
  initials: string;
  quote: string;
  name: string;
  location: string;
}) {
  return (
    <div className="rounded-xl border border-[#EABFB9] bg-[#fafafa] p-5 shadow-[0_10px_24px_rgba(144,18,20,0.05)]">
      <p className="font-display text-4xl leading-none text-[#C07771]">“</p>
      <p className="mt-1 min-h-14 text-sm leading-6 text-[#2d1718]">{quote}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EABFB9] text-sm font-bold text-[#901214]">
            {initials}
          </div>
          <div>
            <p className="text-sm font-bold text-[#2d1718]">- {name}</p>
            <p className="text-xs text-[#2d1718]/65">{location}</p>
          </div>
        </div>
        <p className="text-xs tracking-[0.18em] text-[#901214]">★★★★★</p>
      </div>
    </div>
  );
}

function ComparisonRow({
  other,
  luster,
}: {
  other: string;
  luster: string;
}) {
  return (
    <div className="grid grid-cols-2 border-t border-[#EABFB9] text-sm">
      <div className="flex items-center gap-3 border-r border-[#EABFB9] px-6 py-3 text-[#2d1718]">
        <span className="text-[#A22E34]">⊗</span>
        {other}
      </div>
      <div className="flex items-center gap-3 px-6 py-3 text-[#2d1718]">
        <span className="text-[#7F533E]">✓</span>
        {luster}
      </div>
    </div>
  );
}

export function PublicLandingPage() {
  const heroWords = ["sex", "love", "friendship", "time"] as const;
  const [heroWordIndex, setHeroWordIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeroWordIndex((currentIndex) => (currentIndex + 1) % heroWords.length);
    }, 1800);

    return () => window.clearInterval(intervalId);
  }, [heroWords.length]);

  return (
    <main className="min-h-screen bg-[#fffafa] text-[#2d1718]">
      <section className="bg-[linear-gradient(180deg,#fffafa_0%,#fdf1f0_100%)] px-8 py-12">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-[#EABFB9] px-4 py-2 text-sm font-bold text-[#901214]">
              real compatibility. real relationships.
            </p>
            <h1 className="mt-6 max-w-3xl font-display text-6xl font-bold leading-[1.08] tracking-tight text-[#2d1718]">
              For the best{" "}
              <span className="inline-flex min-w-[8ch] items-baseline justify-center text-[#901214]">
                <span key={heroWords[heroWordIndex]} className="hero-rotating-word inline-block italic">
                  {heroWords[heroWordIndex]}
                </span>
              </span>{" "}
              <br />
              of your life.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#2d1718]/75">
              We analyze what truly matters: emotional alignment, physical attraction,
              communication, and long-term potential.
            </p>
            <div className="mt-8 flex flex-wrap gap-5">
              <LandingButton href="/private-persons" className="!text-white">
                Check Compatibility →
              </LandingButton>
              <LandingButton href="#how-it-works" variant="secondary">
                See How It Works ▶
              </LandingButton>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["A", "R", "K", "M"].map((initial) => (
                  <span
                    key={initial}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#fafafa] bg-[#EABFB9] text-xs font-bold text-[#901214]"
                  >
                    {initial}
                  </span>
                ))}
              </div>
              <p className="text-sm text-[#2d1718]/70">
                Join 50,000+ people making smarter relationship decisions
              </p>
            </div>
          </div>
          <CompatibilityReportCard />
        </div>
      </section>

      <section className="border-y border-[#EABFB9] bg-[#fafafa] px-8 py-5">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 border-[#EABFB9] md:border-r md:pr-6 md:last:border-r-0"
            >
              <LandingIcon>{item.icon}</LandingIcon>
              <div>
                <p className="text-sm font-bold text-[#2d1718]">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-[#2d1718]/72">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="px-8 py-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-display text-3xl font-bold text-[#2d1718]">How It Works</h2>
          <p className="mt-1 text-sm text-[#2d1718]/70">Simple. Fast. Actually useful.</p>
          <div className="mt-7 grid items-center gap-5 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <StepCard icon="1" title="Enter Details" copy="Add basic information about you and the other person." />
            <span className="hidden text-3xl text-[#A22E34] md:block">→</span>
            <StepCard icon="2" title="Get Compatibility Breakdown" copy="We analyze across multiple dimensions that truly matter." />
            <span className="hidden text-3xl text-[#A22E34] md:block">→</span>
            <StepCard icon="3" title="Decide with Clarity" copy="Understand what will work, what won’t, and why." />
          </div>
        </div>
      </section>

      <section id="find-matches" className="px-8 pb-4">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          <div className="grid min-h-44 grid-cols-[1fr_1.15fr] overflow-hidden rounded-xl border border-[#EABFB9] bg-[#fdf1f0]">
            <div className="p-7">
              <h3 className="font-display text-3xl font-bold leading-tight text-[#2d1718]">
                Check Someone You Already Know
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#2d1718]/75">
                Analyze your compatibility privately and get honest insights.
              </p>
              <div className="mt-4">
                <LandingButton href="/private-persons" className="!text-white">
                  Analyze a Relationship →
                </LandingButton>
              </div>
            </div>
            <UseCaseIllustration variant="known" />
          </div>

          <div className="grid min-h-44 grid-cols-[1fr_1fr] overflow-hidden rounded-xl border border-[#EABFB9] bg-[#fdf1f0]">
            <div className="p-7">
              <h3 className="font-display text-3xl font-bold leading-tight text-[#2d1718]">
                Find Compatible People
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#2d1718]/75">
                Discover people who match your relationship profile and values.
              </p>
              <div className="mt-4">
                <LandingButton href="/connections" className="!text-white">
                  Find Matches →
                </LandingButton>
              </div>
            </div>
            <PersonCluster />
          </div>
        </div>
      </section>

      <section id="compatibility-check" className="px-8 py-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-3xl font-bold text-[#2d1718]">
            Why Luster Works Better
          </h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-[#EABFB9] bg-[#fafafa]">
            <div className="grid grid-cols-[1fr_auto_1fr] bg-[#A22E34] text-sm font-bold text-white">
              <div className="px-6 py-3 text-center">Others</div>
              <div className="flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-[#901214] text-xs">
                VS
              </div>
              <div className="px-6 py-3 text-center">Luster</div>
            </div>
            <ComparisonRow other="Astrology and vague predictions" luster="Real compatibility factors" />
            <ComparisonRow other="Guess-based matching" luster="Structured compatibility analysis" />
            <ComparisonRow other="Vague and generic insights" luster="Detailed, actionable breakdown" />
            <ComparisonRow other="Entertainment value" luster="Built for real relationship decisions" />
          </div>
        </div>
      </section>

      <section id="about-us" className="px-8 py-5">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-3xl font-bold text-[#2d1718]">
            Loved by People Making Smarter Choices
          </h2>
          <div className="mt-4 grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#901214]" />
            <span className="h-3 w-3 rounded-full border border-[#EABFB9]" />
            <span className="h-3 w-3 rounded-full border border-[#EABFB9]" />
          </div>
        </div>
      </section>

      <section className="px-8 py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 overflow-hidden rounded-xl bg-[#901214] px-8 py-5 text-white md:flex-row">
          <div>
            <h2 className="font-display text-3xl font-bold">Don’t guess something this important.</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-white/90">
              Check compatibility before you invest your time, energy, and emotions.
            </p>
          </div>
          <div className="text-center">
            <Link
              href="/private-persons"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#fafafa] px-12 text-sm font-bold !text-black transition hover:bg-[#eabfb9]"
            >
              Check Compatibility Now →
            </Link>
            <p className="mt-3 text-sm text-white/90">🔒 It’s free to get started</p>
          </div>
          <div className="hidden text-8xl leading-none text-[#C07771]/45 lg:block">♡</div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

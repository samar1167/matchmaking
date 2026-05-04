"use client";

import Link from "next/link";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Input, SelectInput } from "@/components/ui/input";
import { AlertMessage, BodyText, HeroSection, designSystem } from "@/components/ui/design-system";
import { cn } from "@/lib/cn";

const inquiryOptions = [
  { label: "General support", value: "general-support" },
  { label: "Billing and subscriptions", value: "billing" },
  { label: "Account access", value: "account-access" },
  { label: "Safety report", value: "safety-report" },
  { label: "Partnership or media", value: "partnerships" },
];

type FormState = {
  name: string;
  email: string;
  inquiryType: string;
  subject: string;
  message: string;
};

const initialFormState: FormState = {
  name: "",
  email: "",
  inquiryType: "",
  subject: "",
  message: "",
};

function ContactDetailCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={cn(designSystem.surface, "h-full")}>
      <p className={designSystem.eyebrow}>{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-[#2d1718]">
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-sm leading-6 text-[#2d1718]/72">{children}</div>
    </section>
  );
}

export function ContactUsManager() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.inquiryType || !form.subject || !form.message) {
      setError("Please complete every field so your message includes the right context.");
      setStatus(null);
      return;
    }

    const selectedLabel =
      inquiryOptions.find((option) => option.value === form.inquiryType)?.label ?? form.inquiryType;

    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Inquiry type: ${selectedLabel}`,
      "",
      form.message,
    ].join("\n");

    const mailtoHref = `mailto:support@luster.app?subject=${encodeURIComponent(
      form.subject,
    )}&body=${encodeURIComponent(body)}`;

    setError(null);
    setStatus("Opening your default email app with your message pre-filled.");
    window.location.href = mailtoHref;
  };

  return (
    <>
      <main className="min-h-screen bg-[#fffafa] text-[#2d1718]">
        <section className="px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <HeroSection className="px-7 py-8 sm:px-10 sm:py-10">
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#f5d5c8]">
                    Contact Luster
                  </p>
                  <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-[1.02] sm:text-6xl">
                    Let us help you
                  </h1>
                </div>

                <div className="rounded-[1.8rem] border border-white/16 bg-white/10 p-6 backdrop-blur-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#f5d5c8]">
                    Support snapshot
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.35rem] border border-white/14 bg-white/12 p-4">
                      <p className="text-sm font-semibold text-white/88">Primary support</p>
                      <p className="mt-2 text-sm leading-6 text-white/76">
                        support@luster.app
                      </p>
                    </div>
                    <div className="rounded-[1.35rem] border border-white/14 bg-white/12 p-4">
                      <p className="text-sm font-semibold text-white/88">Response goal</p>
                      <p className="mt-2 text-sm leading-6 text-white/76">
                        Within 1 to 2 business days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </HeroSection>
          </div>
        </section>

        <section className="px-6 pb-6">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-6">
              <ContactDetailCard eyebrow="Office" title="Business contact details">
                <div>
                  <p className="font-semibold text-[#2d1718]">Luster Technologies, Inc.</p>
                  <p>123 Match Lane</p>
                  <p>Suite 400</p>
                  <p>San Francisco, CA 94105</p>
                  <p>United States</p>
                </div>
                <p className="rounded-xl border border-dashed border-[#C07771] bg-[#fffafa] px-4 py-3 text-xs uppercase tracking-[0.16em] text-[#901214]">
                  Placeholder office address. Replace with your legal business address before
                  launch.
                </p>
              </ContactDetailCard>

              <ContactDetailCard eyebrow="Support channels" title="Fastest ways to reach us">
                <p>
                  Email:{" "}
                  <Link href="mailto:support@luster.app" className="font-semibold text-[#901214]">
                    support@luster.app
                  </Link>
                </p>
                <p>
                  Billing:{" "}
                  <Link href="mailto:billing@luster.app" className="font-semibold text-[#901214]">
                    billing@luster.app
                  </Link>
                </p>
                <p>
                  Safety:{" "}
                  <Link href="mailto:safety@luster.app" className="font-semibold text-[#901214]">
                    safety@luster.app
                  </Link>
                </p>
                <p>
                  Phone:{" "}
                  <Link href="tel:+10000000000" className="font-semibold text-[#901214]">
                    +1 (000) 000-0000
                  </Link>
                </p>
              </ContactDetailCard>

              <ContactDetailCard eyebrow="Hours" title="When users can expect help">
                <p>Monday to Friday: 9:00 AM to 6:00 PM</p>
                <p>Saturday: Limited billing and urgent safety coverage</p>
                <p>Sunday and public holidays: Closed except for critical trust and safety issues</p>
              </ContactDetailCard>
            </div>

            <section className={cn(designSystem.surface, "p-6 sm:p-7")}>
              <p className={designSystem.eyebrow}>Send a message</p>
              <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-[#2d1718]">
                Start a conversation with the support team
              </h2>
              <BodyText className="mt-3 max-w-2xl">
                This form opens a pre-filled support email in the user&apos;s default mail app, so
                it provides a real contact path even before a backend ticketing endpoint is added.
              </BodyText>

              <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    label="Full name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                  />
                  <Input
                    label="Email address"
                    placeholder="you@example.com"
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
                  <SelectInput
                    label="Inquiry type"
                    options={inquiryOptions}
                    placeholder="Choose a reason"
                    value={form.inquiryType}
                    onChange={(event) => updateField("inquiryType", event.target.value)}
                  />
                  <Input
                    label="Subject"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={(event) => updateField("subject", event.target.value)}
                  />
                </div>

                <label className="block">
                  <span className={cn("mb-2 block", designSystem.label)}>Message</span>
                  <textarea
                    className="min-h-40 w-full rounded-[1.35rem] border border-[rgba(144,18,20,0.12)] bg-[#fafafa]/90 px-4 py-3.5 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition duration-200 placeholder:text-foreground/35 focus:-translate-y-px focus:border-accent focus:bg-[#fafafa] focus:shadow-[0_14px_34px_rgba(12,13,10,0.08)]"
                    placeholder="Share the details we should know so we can help faster."
                    value={form.message}
                    onChange={(event) => updateField("message", event.target.value)}
                  />
                </label>

                {error ? <AlertMessage>{error}</AlertMessage> : null}
                {status ? (
                  <AlertMessage className="border-[#c8d8bb] bg-[#eef6e6] text-[#355126]">
                    {status}
                  </AlertMessage>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-6 text-[#2d1718]/65">
                    For urgent safety matters, email{" "}
                    <Link href="mailto:safety@luster.app" className="font-semibold text-[#901214]">
                      safety@luster.app
                    </Link>{" "}
                    directly.
                  </p>
                  <Button className="min-w-44" type="submit">
                    Send Message
                  </Button>
                </div>
              </form>
            </section>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

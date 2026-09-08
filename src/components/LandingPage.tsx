'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleDot,
  Command,
  Database,
  Globe2,
  LayoutDashboard,
  MessageSquareText,
  Network,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/modules/auth/AuthContext';

const intelligenceItems = [
  {
    icon: Target,
    eyebrow: 'FIT',
    title: 'ICP Intelligence',
    description:
      'Understand which prospects deserve attention before spending time on outreach.',
    size: 'large',
  },
  {
    icon: Globe2,
    eyebrow: 'DIGITAL',
    title: 'Website Intelligence',
    description:
      'Turn a company website into useful business and opportunity signals.',
    size: 'small',
  },
  {
    icon: MessageSquareText,
    eyebrow: 'RELATIONSHIP',
    title: 'Conversation Intelligence',
    description:
      'Keep requirements, objections, buying signals, and context connected.',
    size: 'small',
  },
  {
    icon: BrainCircuit,
    eyebrow: 'ACTION',
    title: 'Next Best Action',
    description:
      'Know what should happen next instead of staring at an empty CRM.',
    size: 'large',
  },
];

const workflow = [
  {
    number: '01',
    title: 'Capture',
    description: 'Bring in prospect information from the sources you already use.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Understand',
    description: 'Build a structured view of the person, business, and digital presence.',
    icon: BrainCircuit,
  },
  {
    number: '03',
    title: 'Prioritize',
    description: 'Use ICP fit and opportunity signals to focus on the right prospects.',
    icon: Target,
  },
  {
    number: '04',
    title: 'Engage',
    description: 'Create relevant outreach using the context already inside the CRM.',
    icon: MessageSquareText,
  },
  {
    number: '05',
    title: 'Move forward',
    description: 'Track conversations, follow-ups, pipeline movement, and next actions.',
    icon: TrendingUp,
  },
];

const signals = [
  'Business context',
  'ICP fit',
  'Digital presence',
  'Opportunity signals',
  'Conversation history',
  'Next best action',
];

export default function LandingPage() {
  const { user } = useAuth();

  const primaryHref = user ? '/' : '/login';

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8fa] text-slate-950">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-15%] h-[520px] w-[520px] rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute right-[-10%] top-[25%] h-[420px] w-[420px] rounded-full bg-violet-500/8 blur-[120px]" />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-[#f7f8fa]/85 backdrop-blur-2xl">
        <div className="mx-auto flex h-[72px] max-w-[1380px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-slate-950 text-sm font-bold text-white shadow-sm transition-transform group-hover:scale-105">
              C
            </span>

            <div className="leading-none">
              <div className="text-[14px] font-bold tracking-[-0.02em] text-slate-950">
                CodeCraftor
              </div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                Client AI
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <Link
              href="#product"
              className="text-[13px] font-medium text-slate-500 transition hover:text-slate-950"
            >
              Product
            </Link>
            <Link
              href="#intelligence"
              className="text-[13px] font-medium text-slate-500 transition hover:text-slate-950"
            >
              Intelligence
            </Link>
            <Link
              href="#workflow"
              className="text-[13px] font-medium text-slate-500 transition hover:text-slate-950"
            >
              Workflow
            </Link>
            <Link
              href="#why"
              className="text-[13px] font-medium text-slate-500 transition hover:text-slate-950"
            >
              Why Client AI
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {!user && (
              <Link
                href="/login"
                className="hidden rounded-lg px-3.5 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950 sm:inline-flex"
              >
                Sign in
              </Link>
            )}

            <Link
              href={primaryHref}
              className="group inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              {user ? 'Open CRM' : 'Get started'}
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section id="product" className="relative">
          <div className="mx-auto max-w-[1380px] px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:px-10 lg:pb-28 lg:pt-24">
            <div className="grid items-center gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
              <div className="max-w-[620px]">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                    <Sparkles size={12} />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Prospect intelligence for CodeCraftor
                  </span>
                </div>

                <h1 className="text-[46px] font-semibold leading-[1.03] tracking-[-0.055em] text-slate-950 sm:text-[58px] lg:text-[72px]">
                  Know who to pursue.
                  <span className="block text-brand-600">Know what to do next.</span>
                </h1>

                <p className="mt-7 max-w-[570px] text-[16px] leading-7 text-slate-500 sm:text-[18px] sm:leading-8">
                  CodeCraftor Client AI turns raw prospect information into
                  business intelligence, opportunity signals, personalized
                  outreach, and clear next actions.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={primaryHref}
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-[14px] font-semibold text-white shadow-[0_14px_32px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    {user ? 'Open CRM' : 'Open Client AI'}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    href="#workflow"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-[14px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Explore the workflow
                    <ChevronRight size={15} />
                  </Link>
                </div>

                <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
                  {[
                    'AI-assisted research',
                    'Evidence-based insights',
                    'Human-controlled outreach',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-[12px] font-medium text-slate-500"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                        <Check size={10} strokeWidth={3} />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* PRODUCT PREVIEW */}
              <div className="relative">
                <div className="absolute -inset-8 rounded-[40px] bg-brand-500/8 blur-3xl" />

                <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.13)]">
                  {/* fake browser bar */}
                  <div className="flex h-11 items-center justify-between border-b border-slate-200 bg-slate-50/90 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    </div>

                    <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-medium text-slate-400">
                        client-ai / prospect
                      </span>
                    </div>

                    <div className="w-10" />
                  </div>

                  <div className="grid min-h-[500px] grid-cols-[54px_1fr] sm:grid-cols-[68px_1fr]">
                    {/* mini sidebar */}
                    <div className="border-r border-slate-200 bg-slate-950 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-950">
                        C
                      </div>

                      <div className="mt-8 space-y-3">
                        {[LayoutDashboard, Users, Target, MessageSquareText, Network].map(
                          (Icon, index) => (
                            <div
                              key={index}
                              className={`flex h-8 w-8 items-center justify-center rounded-lg ${index === 2
                                  ? 'bg-white/12 text-white'
                                  : 'text-slate-500'
                                }`}
                            >
                              <Icon size={15} />
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    {/* dashboard */}
                    <div className="bg-[#f8fafc] p-4 sm:p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Prospect workspace
                          </p>
                          <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                            Prospect intelligence
                          </h3>
                        </div>

                        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 sm:flex">
                          <Search size={12} className="text-slate-400" />
                          <span className="text-[9px] text-slate-400">
                            Search prospects
                          </span>
                        </div>
                      </div>

                      {/* profile header */}
                      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                              AM
                            </div>

                            <div>
                              <div className="text-[13px] font-semibold text-slate-950">
                                Prospect profile
                              </div>
                              <div className="mt-0.5 text-[10px] text-slate-400">
                                Business context · Digital presence · Intent
                              </div>
                            </div>
                          </div>

                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold text-emerald-700">
                            Qualified
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-2">
                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">
                              ICP
                            </p>
                            <div className="mt-1 text-lg font-semibold text-slate-950">
                              8.6
                            </div>
                            <div className="mt-1 text-[8px] font-medium text-brand-600">
                              Strong fit
                            </div>
                          </div>

                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">
                              Signals
                            </p>
                            <div className="mt-1 text-lg font-semibold text-slate-950">
                              06
                            </div>
                            <div className="mt-1 text-[8px] font-medium text-slate-400">
                              Detected
                            </div>
                          </div>

                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">
                              Action
                            </p>
                            <div className="mt-1 text-[11px] font-semibold text-slate-950">
                              Follow up
                            </div>
                            <div className="mt-1 text-[8px] font-medium text-slate-400">
                              Today
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
                        {/* AI intelligence */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                                <BrainCircuit size={13} />
                              </span>
                              <span className="text-[10px] font-semibold text-slate-800">
                                AI intelligence
                              </span>
                            </div>

                            <span className="text-[8px] font-medium text-slate-400">
                              Context aware
                            </span>
                          </div>

                          <div className="mt-4 space-y-3">
                            {[
                              ['Buying signal', 'Growth / expansion'],
                              ['Opportunity', 'Lead generation'],
                              ['Next action', 'Discovery call'],
                            ].map(([label, value]) => (
                              <div
                                key={label}
                                className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0"
                              >
                                <span className="text-[9px] text-slate-400">
                                  {label}
                                </span>
                                <span className="text-[9px] font-semibold text-slate-800">
                                  {value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* signal panel */}
                        <div className="rounded-xl border border-slate-200 bg-slate-950 p-4 text-white">
                          <div className="flex items-center gap-2">
                            <CircleDot size={13} className="text-brand-400" />
                            <span className="text-[10px] font-semibold">
                              Opportunity map
                            </span>
                          </div>

                          <div className="mt-5 space-y-3">
                            {['Website', 'Automation', 'Dashboard'].map(
                              (item, index) => (
                                <div key={item}>
                                  <div className="mb-1.5 flex justify-between">
                                    <span className="text-[8px] text-slate-400">
                                      {item}
                                    </span>
                                    <span className="text-[8px] text-slate-300">
                                      {index === 0 ? 'High' : index === 1 ? 'Med' : 'High'}
                                    </span>
                                  </div>
                                  <div className="h-1 overflow-hidden rounded-full bg-white/10">
                                    <div
                                      className="h-full rounded-full bg-brand-400"
                                      style={{
                                        width: index === 0 ? '88%' : index === 1 ? '62%' : '78%',
                                      }}
                                    />
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>

                      {/* bottom activity */}
                      <div className="mt-3 flex items-center justify-between rounded-xl border border-dashed border-slate-200 bg-white px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100">
                            <Zap size={12} className="text-slate-600" />
                          </span>
                          <div>
                            <p className="text-[9px] font-semibold text-slate-800">
                              Next best action
                            </p>
                            <p className="text-[8px] text-slate-400">
                              Send a contextual follow-up
                            </p>
                          </div>
                        </div>

                        <ArrowRight size={13} className="text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* floating AI card */}
                <div className="absolute -bottom-7 -left-5 hidden w-[210px] rounded-xl border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.12)] sm:block">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <Sparkles size={13} />
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold text-slate-900">
                        Intelligence ready
                      </p>
                      <p className="text-[8px] text-slate-400">
                        6 useful signals detected
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT STATEMENT */}
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-[1380px] px-5 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white">
                  <Command size={15} />
                </span>
                <p className="text-[13px] font-medium text-slate-600">
                  One workspace for prospect research, intelligence, outreach,
                  and follow-through.
                </p>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {signals.map((signal) => (
                  <span
                    key={signal}
                    className="text-[11px] font-medium text-slate-400"
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* INTELLIGENCE */}
        <section id="intelligence" className="mx-auto max-w-[1380px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="max-w-[700px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-600">
              Intelligence layer
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              A CRM that helps you understand the opportunity.
            </h2>

            <p className="mt-5 max-w-[600px] text-[15px] leading-7 text-slate-500">
              Instead of treating every prospect as another row in a table,
              Client AI connects business context, digital signals, conversations,
              and actions into one working picture.
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-12">
            {intelligenceItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`group relative overflow-hidden rounded-[20px] border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.07)] ${item.size === 'large'
                      ? 'lg:col-span-7'
                      : 'lg:col-span-5'
                    }`}
                >
                  <div className="absolute right-[-30px] top-[-30px] h-32 w-32 rounded-full bg-brand-50 opacity-0 blur-2xl transition group-hover:opacity-100" />

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                        <Icon size={18} />
                      </span>

                      <span className="text-[9px] font-bold tracking-[0.18em] text-slate-300">
                        {item.eyebrow}
                      </span>
                    </div>

                    <h3 className="mt-12 text-xl font-semibold tracking-[-0.025em] text-slate-950">
                      {item.title}
                    </h3>

                    <p className="mt-2 max-w-[460px] text-[13px] leading-6 text-slate-500">
                      {item.description}
                    </p>

                    <div className="mt-7 flex items-center gap-2 text-[11px] font-semibold text-slate-700">
                      Explore intelligence
                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 360 SECTION */}
        <section id="why" className="border-y border-slate-200 bg-slate-950 text-white">
          <div className="mx-auto max-w-[1380px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
            <div className="grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-400">
                  Prospect 360
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  Everything you know about a prospect.
                  <span className="block text-slate-500">
                    In the same context.
                  </span>
                </h2>

                <p className="mt-6 max-w-[520px] text-[15px] leading-7 text-slate-400">
                  Stop jumping between notes, websites, messages, spreadsheets,
                  and separate research tabs. Build one relationship record that
                  keeps the important context connected.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    'Business intelligence',
                    'ICP evidence',
                    'Digital presence',
                    'Opportunities',
                    'Conversation history',
                    'Follow-up planning',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-[12px] text-slate-300"
                    >
                      <Check size={14} className="text-brand-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* 360 visual */}
              <div className="relative">
                <div className="absolute inset-0 rounded-[30px] bg-brand-500/10 blur-3xl" />

                <div className="relative rounded-[24px] border border-white/10 bg-white/[0.04] p-3">
                  <div className="rounded-[18px] border border-white/10 bg-[#0c111a] p-5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                          P
                        </div>

                        <div>
                          <p className="text-[12px] font-semibold">
                            Prospect 360
                          </p>
                          <p className="mt-0.5 text-[9px] text-slate-500">
                            Full relationship context
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[8px] font-semibold text-emerald-400">
                        ACTIVE
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase tracking-wider text-slate-500">
                            ICP fit
                          </span>
                          <Target size={13} className="text-brand-400" />
                        </div>

                        <div className="mt-3 flex items-end gap-2">
                          <span className="text-3xl font-semibold tracking-tight">
                            8.6
                          </span>
                          <span className="mb-1 text-[9px] text-brand-400">
                            / 10
                          </span>
                        </div>

                        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full w-[86%] rounded-full bg-brand-400" />
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase tracking-wider text-slate-500">
                            AI relevance
                          </span>
                          <Sparkles size={13} className="text-brand-400" />
                        </div>

                        <p className="mt-3 text-lg font-semibold">
                          High
                        </p>

                        <p className="mt-1 text-[9px] text-slate-500">
                          Based on available evidence
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-wider text-slate-500">
                          Relationship intelligence
                        </span>
                        <Network size={13} className="text-slate-500" />
                      </div>

                      <div className="mt-4 space-y-3">
                        {[
                          ['Business', 'Growing company'],
                          ['Opportunity', 'Digital transformation'],
                          ['Conversation', 'Interested'],
                          ['Next action', 'Schedule discovery'],
                        ].map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0"
                          >
                            <span className="text-[9px] text-slate-500">
                              {key}
                            </span>
                            <span className="text-[9px] font-medium text-slate-200">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between rounded-xl border border-brand-400/20 bg-brand-400/[0.06] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-400/10 text-brand-400">
                          <Zap size={14} />
                        </div>
                        <div>
                          <p className="text-[9px] font-semibold">
                            Next best action
                          </p>
                          <p className="mt-1 text-[8px] text-slate-500">
                            Follow up with relevant context
                          </p>
                        </div>
                      </div>

                      <ArrowRight size={14} className="text-brand-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKFLOW */}
        <section id="workflow" className="mx-auto max-w-[1380px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-600">
                The workflow
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                From raw prospect to clear next action.
              </h2>

              <p className="mt-5 max-w-[500px] text-[15px] leading-7 text-slate-500">
                The system is designed around the way prospecting actually
                happens—not around forcing everything into a traditional CRM
                workflow.
              </p>

              <Link
                href={primaryHref}
                className="mt-8 inline-flex items-center gap-2 text-[13px] font-semibold text-slate-950 transition hover:text-brand-600"
              >
                Open the workspace
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {workflow.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.number}
                    className="group flex gap-5 py-6 sm:gap-8"
                  >
                    <div className="flex w-12 shrink-0 flex-col items-center">
                      <span className="text-[10px] font-bold tracking-[0.12em] text-slate-300">
                        {item.number}
                      </span>

                      <div className="mt-4 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition group-hover:border-brand-200 group-hover:bg-brand-50 group-hover:text-brand-600">
                        <Icon size={16} />
                      </div>
                    </div>

                    <div className="pt-0.5">
                      <h3 className="text-[16px] font-semibold tracking-[-0.015em] text-slate-950">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 max-w-[560px] text-[13px] leading-6 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* INPUT → INTELLIGENCE */}
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-[1380px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-600">
                One system
              </p>

              <h2 className="mx-auto mt-4 max-w-[760px] text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                Less manual research. More useful context.
              </h2>

              <p className="mx-auto mt-5 max-w-[620px] text-[15px] leading-7 text-slate-500">
                Capture the information you already have and let the system
                structure it into something your sales workflow can actually use.
              </p>
            </div>

            <div className="mx-auto mt-14 max-w-[1100px]">
              <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
                {/* Capture */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                    <Search size={17} />
                  </div>

                  <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Input
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-slate-950">
                    Capture
                  </h3>

                  <div className="mt-4 space-y-2">
                    {['Screenshot', 'URL', 'Paste', 'Manual entry'].map(
                      (item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-medium text-slate-600"
                        >
                          <CircleDot size={10} className="text-slate-300" />
                          {item}
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="hidden items-center justify-center md:flex">
                  <ArrowRight size={17} className="text-slate-300" />
                </div>

                {/* Understand */}
                <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
                    <BrainCircuit size={17} />
                  </div>

                  <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-brand-500">
                    Intelligence
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-slate-950">
                    Understand
                  </h3>

                  <div className="mt-4 space-y-2">
                    {[
                      'Business context',
                      'ICP evidence',
                      'Digital signals',
                      'Opportunities',
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-lg border border-brand-100 bg-white px-3 py-2 text-[11px] font-medium text-slate-600"
                      >
                        <Check size={11} className="text-brand-600" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hidden items-center justify-center md:flex">
                  <ArrowRight size={17} className="text-slate-300" />
                </div>

                {/* Action */}
                <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-brand-400">
                    <Zap size={17} />
                  </div>

                  <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-brand-400">
                    Outcome
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">
                    Take action
                  </h3>

                  <div className="mt-4 space-y-2">
                    {[
                      'Personalized outreach',
                      'Next best action',
                      'Follow-up',
                      'Pipeline movement',
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-medium text-slate-300"
                      >
                        <Check size={11} className="text-brand-400" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative overflow-hidden bg-slate-950">
          <div className="absolute left-1/2 top-0 h-[350px] w-[650px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[100px]" />

          <div className="relative mx-auto max-w-[900px] px-5 py-24 text-center sm:px-8 lg:py-32">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-brand-400">
              <Sparkles size={18} />
            </div>

            <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-400">
              CodeCraftor Client AI
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
              Spend less time researching.
              <span className="block text-slate-500">
                Spend more time selling.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-[600px] text-[15px] leading-7 text-slate-400">
              Put prospect intelligence, opportunity detection, outreach,
              conversations, and follow-up in one focused workspace.
            </p>

            <div className="mt-9 flex justify-center">
              <Link
                href={primaryHref}
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-[13px] font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                {user ? 'Open CRM' : 'Get started'}
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-5 px-5 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-950">
              C
            </span>
            <div>
              <p className="text-[12px] font-semibold text-white">
                CodeCraftor Client AI
              </p>
              <p className="mt-0.5 text-[9px] text-slate-600">
                Prospect intelligence workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="#product"
              className="text-[11px] font-medium text-slate-500 transition hover:text-white"
            >
              Product
            </Link>

            <Link
              href="#intelligence"
              className="text-[11px] font-medium text-slate-500 transition hover:text-white"
            >
              Intelligence
            </Link>

            <Link
              href="#workflow"
              className="text-[11px] font-medium text-slate-500 transition hover:text-white"
            >
              Workflow
            </Link>

            <Link
              href={primaryHref}
              className="text-[11px] font-medium text-slate-500 transition hover:text-white"
            >
              {user ? 'Open CRM' : 'Sign in'}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


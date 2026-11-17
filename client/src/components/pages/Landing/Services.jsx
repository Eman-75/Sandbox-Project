import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';
import { CountUp, Faq, G, Head, IMG, PageHero, ParallaxImg, Reveal, Words, Wrap } from './shared';
import WorkProcess from './WorkProcess';

const sectors = [['Agriculture', 42], ['Health', 58], ['EdTech', 36], ['FinTech', 64], ['Clean energy', 47]];
const stages = [['Idea', 0.6], ['Prototype', 1], ['Early revenue', 1.4]];
function Matcher() {
  const [s, setS] = useState(0), [g, setG] = useState(1), [amt, setAmt] = useState(5);
  const n = Math.max(3, Math.round(sectors[s][1] * stages[g][1] * (1.3 - amt / 40)));
  const chip = (on) => `rounded-full border px-5 py-2.5 text-sm font-medium transition ${on ? 'border-[#e39622] bg-[#e39622] text-black' : 'border-white/20 text-white/70 hover:border-white/50'}`;
  return (
    <section className="bg-black py-28 text-white"><Wrap className="grid items-center gap-14 lg:grid-cols-2">
      <div>
        <h2 className="text-4xl font-bold tracking-tight md:text-6xl"><Words text="See who could back you." /></h2>
        <p className="mt-5 max-w-lg text-lg text-white/60">Try the investor matcher: pick your sector, stage and funding goal.</p>
        <p className="mt-8 text-sm text-white/50">Sector</p><div className="mt-3 flex flex-wrap gap-3">{sectors.map(([x], i) => <button key={x} onClick={() => setS(i)} className={chip(s === i)}>{x}</button>)}</div>
        <p className="mt-6 text-sm text-white/50">Stage</p><div className="mt-3 flex flex-wrap gap-3">{stages.map(([x], i) => <button key={x} onClick={() => setG(i)} className={chip(g === i)}>{x}</button>)}</div>
        <p className="mt-6 text-sm text-white/50">Funding goal: Rs {amt}M</p><input type="range" min="1" max="20" value={amt} onChange={(e) => setAmt(+e.target.value)} className="mt-3 w-full max-w-md accent-[#e39622]" />
      </div>
      <div className="rounded-[2rem] border border-white/15 bg-white/[0.04] p-10 text-center">
        <div className="text-8xl font-bold" style={{ color: G }}><CountUp key={n} to={n} /></div><p className="mt-3 text-xl">investors match your profile</p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">{Array.from({ length: Math.min(n, 40) }).map((_, i) => <motion.span key={`${s}${g}${amt}${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.02 }} className="h-4 w-4 rounded-full" style={{ background: G, opacity: 0.4 + (i % 3) * 0.3 }} />)}</div>
        <p className="mt-8 text-xs text-white/40">Demo estimate, not live data.</p>
      </div>
    </Wrap></section>
  );
}

const roles = [
  ['Students', IMG.students, 'Move from academic theory to real-world impact.', ['Publish your project profile', 'Get matched with startup teams', 'Receive mentor and investor feedback']],
  ['Startups', IMG.s4, 'Replace scattered tools with one guided workspace.', ['Build structured proposals', 'Sign NDAs inside the platform', 'Track every investor conversation']],
  ['Investors', IMG.office, 'See vetted ventures and move from interest to funding.', ['Browse curated proposals', 'Shortlist and chat with founders', 'Follow progress after funding']],
];
const rows = [['Public profile', [1, 1, 1]], ['Submit proposals', [1, 1, 0]], ['Browse proposals', [0, 0, 1]], ['Innovation Vault', [1, 1, 1]], ['Learning Hub and resources', [1, 1, 0]], ['In-app messaging', [1, 1, 1]], ['Digital NDAs', [0, 1, 1]], ['Funding tracker', [0, 1, 1]]];

export default function Services() {
  const go = useNavigate();
  return (
    <>
      <PageHero page="Who We Serve" title="Built for the people who build." copy="Students, startups and investors each get a workspace shaped around what they need to move from idea to investment." />
      

      <section className="bg-white text-black">{roles.map(([t, img, d, pts], n) => (
        <div key={t} className={n % 2 ? 'bg-[#f8f6f1]' : ''}><Wrap className={`grid items-center gap-14 py-24 lg:grid-cols-2 ${n % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
          <ParallaxImg src={img} alt={t} className="h-[460px] rounded-[2rem]" />
          <div><h2 className="text-4xl font-bold tracking-tight md:text-5xl"><Words text={`For ${t.toLowerCase()}`} /></h2><Reveal><p className="mt-5 text-lg leading-8 text-slate-700">{d}</p>
            <ul className="mt-8 space-y-4">{pts.map((p) => <li key={p} className="flex items-center gap-3 text-lg"><span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: G }}><Check className="h-4 w-4" /></span>{p}</li>)}</ul>
            <button onClick={() => go('/signup')} className="mt-10 rounded-full bg-black px-8 py-4 font-semibold text-white transition hover:bg-[#e39622] hover:text-black">Join as {t.slice(0, -1).toLowerCase()}</button></Reveal></div>
        </Wrap></div>))}</section>
      <Matcher />

      <section className="bg-[#f8f6f1] py-28 text-black"><Wrap>
        <Head title="What each account includes" sub="Every account is free to create. Features unlock by role." />
        <div className="overflow-x-auto rounded-[2rem] bg-white p-4 md:p-8"><div className="min-w-[560px]">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-black/10 pb-4 text-sm font-semibold text-slate-500"><span /><span className="text-center">Students</span><span className="text-center">Startups</span><span className="text-center">Investors</span></div>
          {rows.map(([f, v], i) => (<motion.div key={f} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center border-b border-black/5 py-4 text-lg">
            <span>{f}</span>{v.map((x, k) => <span key={k} className="flex justify-center">{x ? <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: G }}><Check className="h-4 w-4" /></span> : <Minus className="h-4 w-4 text-slate-300" />}</span>)}</motion.div>))}
        </div></div>
      </Wrap></section>

      <WorkProcess />
      <Faq />
    </>
  );
}
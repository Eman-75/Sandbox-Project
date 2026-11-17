import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, animate, motion, useAnimationFrame, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { ArrowUpRight, Check, Plus } from 'lucide-react';

export const G = '#e39622';
const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
export const IMG = {
  s1: u('1600880292203-757bb62b4baf', 1920), s2: u('1531482615713-2afd69097998', 1920), s3: u('1556761175-b413da4baf72', 1920), s4: u('1542744173-8e7e53415bb0', 1920),
  meet: u('1521737711867-e3b97375f902'), office: u('1553877522-43269d4ea984'), students: u('1523240795612-9a054b0db644'),
  agri: u('1530836369250-ef72a3f5cda8'), health: u('1576091160399-112ba8d25d1d'), lab: u('1581090464777-f3220bbe1b8b'), city: u('1519389950473-47ba0277781c', 1920),
};

export const Img = ({ src, alt = '', className = '' }) => {
  const [bad, setBad] = useState(false);
  return bad ? <div className={`${className} bg-gradient-to-br from-[#e39622]/50 to-black`} /> : <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} className={className} />;
};
export const Wrap = ({ children, className = '' }) => <div className={`mx-auto max-w-[1400px] px-6 ${className}`}>{children}</div>;
export const Reveal = ({ children, delay = 0, y = 40, className = '' }) => (
  <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
);
// Words rise out of a mask when they scroll into view
export const Words = ({ text, className = '' }) => (
  <motion.span className={className} initial="h" whileInView="s" viewport={{ once: true, margin: '-60px' }} variants={{ h: {}, s: { transition: { staggerChildren: 0.05 } } }}>
    {text.split(' ').map((w, i) => (
      <span key={i} className="inline-block overflow-hidden align-bottom"><motion.span className="inline-block pb-[0.12em]" variants={{ h: { y: '110%' }, s: { y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } } }}>{w}&nbsp;</motion.span></span>))}
  </motion.span>
);
export const SplitText = ({ text, className = '', delay = 0 }) => (
  <span className={className}>{text.split(' ').map((w, i) => (
    <span key={i} className="inline-block overflow-hidden pb-1 align-bottom"><motion.span className="inline-block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}>{w}&nbsp;</motion.span></span>))}</span>
);
export function CountUp({ to, prefix = '', suffix = '' }) {
  const ref = useRef(null); const inView = useInView(ref, { once: true }); const [v, setV] = useState(0);
  useEffect(() => { if (!inView) return; const c = animate(0, to, { duration: 2.2, ease: 'easeOut', onUpdate: (x) => setV(Math.round(x)) }); return () => c.stop(); }, [inView, to]);
  return <span ref={ref}>{prefix}{v}{suffix}</span>;
}
export const Head = ({ title, sub, dark }) => (
  <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
    <h2 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl"><Words text={title} /></h2>
    {sub && <Reveal><p className={`max-w-md text-lg leading-8 ${dark ? 'text-white/60' : 'text-slate-600'}`}>{sub}</p></Reveal>}
  </div>
);

export function Magnetic({ children, strength = 0.3 }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 }), sy = useSpring(y, { stiffness: 200, damping: 15 });
  return <motion.div style={{ x: sx, y: sy, display: 'inline-block' }}
    onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * strength); y.set((e.clientY - r.top - r.height / 2) * strength); }}
    onMouseLeave={() => { x.set(0); y.set(0); }}>{children}</motion.div>;
}
export const GoldBtn = ({ children, onClick }) => (
  <Magnetic><button onClick={onClick} className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-black transition hover:brightness-110" style={{ background: G }}>{children} <ArrowUpRight className="h-5 w-5" /></button></Magnetic>
);
export function Tilt({ children, className = '' }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [9, -9]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-9, 9]), { stiffness: 200, damping: 18 });
  return <motion.div className={className} style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
    onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left) / r.width - 0.5); y.set((e.clientY - r.top) / r.height - 0.5); }}
    onMouseLeave={() => { x.set(0); y.set(0); }}>{children}</motion.div>;
}
// Card with a gold spotlight that follows the mouse
export const Spot = ({ children, className = '' }) => (
  <div className={`group relative overflow-hidden ${className}`} onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`); }}>
    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(420px circle at var(--mx) var(--my),rgba(227,150,34,.28),transparent 60%)' }} />
    <div className="relative">{children}</div>
  </div>
);
// Marquee that speeds up with scroll velocity
export function VelocityMarquee({ items }) {
  const base = useMotionValue(0);
  const vel = useSpring(useVelocity(useScroll().scrollY), { damping: 50, stiffness: 400 });
  const f = useTransform(vel, [-1500, 0, 1500], [3, 0, 3]);
  useAnimationFrame((t, d) => base.set((base.get() - 2 * (d / 1000) * (1 + f.get())) % 50));
  const x = useTransform(base, (v) => `${v}%`);
  return <div className="overflow-hidden border-y border-white/10 bg-black py-6 text-white"><motion.div style={{ x }} className="flex w-max gap-14 whitespace-nowrap text-2xl font-bold text-white/25 md:text-2xl">
    {[0, 1, 2, 3].flatMap((k) => items.map((w) => <span key={w + k} className="inline-flex items-center gap-10">{w}<span className="inline-block" style={{ color: G }}>✦</span></span>))}</motion.div></div>;
}
export function ParallaxImg({ src, alt, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  return <motion.div ref={ref} initial={{ clipPath: 'inset(100% 0 0 0)' }} whileInView={{ clipPath: 'inset(0% 0 0 0)' }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} className={`overflow-hidden ${className}`}>
    <motion.div style={{ y, scale: 1.25 }} className="h-full w-full"><Img src={src} alt={alt} className="h-full w-full object-cover" /></motion.div></motion.div>;
}

const grid = { backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)', backgroundSize: '64px 64px', maskImage: 'radial-gradient(ellipse at center,black 30%,transparent 75%)' };
export const Glow = () => (<>
  <motion.div animate={{ x: [0, 80, 0], y: [0, 40, 0] }} transition={{ repeat: Infinity, duration: 14 }} className="absolute -left-20 top-10 h-96 w-96 rounded-full blur-[120px]" style={{ background: `${G}44` }} />
  <motion.div animate={{ x: [0, -60, 0] }} transition={{ repeat: Infinity, duration: 18 }} className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-[130px]" />
  <div className="absolute inset-0" style={grid} />
</>);
export const PageHero = ({ page, title, copy }) => (
  <section className="relative overflow-hidden bg-black pb-24 pt-44 text-white"><Glow />
    <Wrap className="relative">
      <p className="mb-6 text-white/60"><Link to="/" className="hover:text-white">Home</Link> / <span style={{ color: G }}>{page}</span></p>
      <h1 className="max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl"><SplitText text={title} /></h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-8 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">{copy}</motion.p>
    </Wrap></section>
);

export const CTA = ({ go, title, text }) => (
  <section className="bg-[#f8f6f1] py-24"><Wrap>
    <div className="grid overflow-hidden rounded-[2.5rem] bg-black text-white lg:grid-cols-2">
      <div className="p-10 md:p-16">
        <h2 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl"><Words text={title} /></h2>
        <Reveal>
          <p className="mt-5 max-w-lg text-lg leading-8 text-white/65">{text}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <button onClick={() => go('/signup')} className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-black transition hover:brightness-110" style={{ background: G }}>Create free account <ArrowUpRight className="h-5 w-5" /></button>
            <button onClick={() => go('/contact')} className="rounded-full border border-white/25 px-8 py-4 font-medium transition hover:bg-white/10">Talk to our team</button>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/60">{['Free to join', 'Verified members', 'NDAs built in'].map((t) => <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4" style={{ color: G }} />{t}</li>)}</ul>
        </Reveal>
      </div>
      <div className="relative min-h-[340px]">
        <Img src={IMG.meet} alt="Team reviewing a proposal" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent" />
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }} className="absolute bottom-8 right-8 flex items-center gap-4 rounded-2xl bg-white px-6 py-4 text-black shadow-2xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: G }}><Check className="h-5 w-5" /></span>
          <div><p className="font-semibold">Proposal funded</p><p className="text-sm text-slate-500">Smart Irrigation System · Rs 4.2M</p></div>
        </motion.div>
      </div>
    </div>
  </Wrap></section>
);

export const faqs = [['Who can join SandBox?', 'Students with research or final-year projects, startups seeking funding, and investors looking for vetted opportunities.'], ['Is my idea safe?', 'Ideas stay in your Innovation Vault and NDAs are signed before sensitive details are shared.'], ['How do investors find proposals?', 'They browse the Explore feed, shortlist proposals and message founders directly.'], ['Does it cost anything to join?', 'Creating an account is free. Funding payments are handled securely through the platform.']];
export function Faq() {
  const [o, setO] = useState(0);
  return (
    <section className="bg-black py-28 text-white"><Wrap className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
      <h2 className="text-4xl font-bold tracking-tight md:text-5xl"><Words text="Questions, answered" /></h2>
      <div className="divide-y divide-white/10 border-y border-white/10">{faqs.map(([q, a], n) => (<div key={q}>
        <button onClick={() => setO(o === n ? -1 : n)} className="flex w-full items-center justify-between py-6 text-left text-xl">{q}<motion.span animate={{ rotate: o === n ? 45 : 0 }}><Plus style={{ color: G }} /></motion.span></button>
        <AnimatePresence initial={false}>{o === n && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-6 leading-8 text-white/65">{a}</motion.p>}</AnimatePresence>
      </div>))}</div>
    </Wrap></section>
  );
}
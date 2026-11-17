import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle, GraduationCap, Landmark, Mail, MapPin, Phone, Rocket } from 'lucide-react';
import { G, Head, PageHero, Reveal, Spot, Tilt, Wrap } from './shared';

const info = [[Mail, 'Email us', 'contact@sandbox.com'], [Phone, 'Call us', '+92 313 2820530'], [MapPin, 'Visit us', 'Barani Institute of Sciences, Burewala']];
const topics = ['Book a demo', 'Partnership', 'Investor query', 'Support'];
const start = [[GraduationCap, 'I am a student', 'Showcase your project and find a team.'], [Rocket, 'I run a startup', 'Pitch to investors who fit your stage.'], [Landmark, 'I am an investor', 'Discover vetted early-stage ventures.']];
const f = 'w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 outline-none transition focus:border-[#e39622] focus:ring-2 focus:ring-[#e39622]/40';

export default function Contact() {
  const go = useNavigate();
  const [t, setT] = useState(0), [sent, setSent] = useState(false), [d, setD] = useState({ name: '', email: '', message: '' });
  const set = (k) => (e) => setD({ ...d, [k]: e.target.value });
  return (
    <>
      <PageHero page="Contact" title="Let’s build something together." copy="Book a demo, ask about partnerships or get help with your account. We reply within one working day." />
      <section className="bg-white py-20 text-black"><Wrap className="grid gap-6 md:grid-cols-3">{info.map(([I, l, v], n) => (
        <Reveal key={l} delay={n * 0.1}><Tilt><div className="flex items-center gap-5 rounded-[2rem] bg-black p-8 text-white"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-black" style={{ background: G }}><I /></span><div><p className="text-sm text-white/50">{l}</p><p className="text-lg">{v}</p></div></div></Tilt></Reveal>))}</Wrap></section>

      <section className="bg-[#f8f6f1] pb-28 pt-12 text-black"><Wrap className="grid gap-8 lg:grid-cols-2">
        <Reveal><div className="rounded-[2rem] bg-white p-8 md:p-12"><AnimatePresence mode="wait">{sent ? (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-24 text-center"><CheckCircle className="mx-auto h-16 w-16" style={{ color: G }} /><h3 className="mt-6 text-3xl font-bold">Message sent</h3><p className="mt-2 text-slate-600">We will reply to {d.email} about “{topics[t]}”.</p></motion.div>
        ) : (
          <motion.form key="f" onSubmit={(e) => { e.preventDefault(); /* TODO: api.post('/contact', { topic: topics[t], ...d }) */ setSent(true); }} className="space-y-5">
            <h2 className="text-3xl font-bold">What can we help with?</h2>
            <div className="flex flex-wrap gap-3">{topics.map((x, i) => <button type="button" key={x} onClick={() => setT(i)} className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${t === i ? 'border-black bg-black text-white' : 'border-black/15'}`}>{x}</button>)}</div>
            <div className="grid gap-5 sm:grid-cols-2"><input required className={f} placeholder="Your name" value={d.name} onChange={set('name')} /><input required type="email" className={f} placeholder="Your email" value={d.email} onChange={set('email')} /></div>
            <textarea required rows={6} className={f} placeholder="Your message" value={d.message} onChange={set('message')} />
            <motion.button whileHover={{ scale: 1.02 }} type="submit" className="w-full rounded-xl py-4 font-semibold text-black" style={{ background: G }}>Send message</motion.button>
          </motion.form>)}</AnimatePresence></div></Reveal>
        <Reveal delay={0.15} className="h-full"><iframe title="Office map" loading="lazy" src="https://maps.google.com/maps?q=Burewala%20Pakistan&output=embed" className="h-full min-h-[420px] w-full rounded-[2rem] border-0" /></Reveal>
      </Wrap></section>

      <section className="bg-black py-28 text-white"><Wrap>
        <Head dark title="Not sure where to start?" sub="Pick the description that fits you and create your free account." />
        <div className="grid gap-6 md:grid-cols-3">{start.map(([I, t2, d2], n) => (
          <Reveal key={t2} delay={n * 0.1} className="h-full"><Spot className="h-full cursor-pointer rounded-[2rem] border border-white/10 bg-white/[0.04] p-8"><div onClick={() => go('/signup')}>
            <I className="h-10 w-10" style={{ color: G }} /><h3 className="mt-6 flex items-center justify-between text-2xl font-semibold">{t2}<ArrowUpRight className="transition group-hover:rotate-12" style={{ color: G }} /></h3><p className="mt-2 text-white/60">{d2}</p></div></Spot></Reveal>))}</div>
      </Wrap></section>
    </>
  );
}
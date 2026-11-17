import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, FileText, GraduationCap, Landmark, Lock, MessageSquare, Play, Rocket, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { CTA, CountUp, G, GoldBtn, Head, IMG, Img, ParallaxImg, Reveal, Spot, Tilt, VelocityMarquee, Words, Wrap } from './shared';

const words = ['Innovation', 'Startups', 'Funding', 'Ideas'];
const slides = [IMG.s1, IMG.s2, IMG.s3, IMG.s4];

function Hero({ go }) {
  const ref = useRef(null);
  const [i, setI] = useState(0), [w, setW] = useState(0), [vid, setVid] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const zoom = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  useEffect(() => {
    const a = setInterval(() => setI((c) => (c + 1) % slides.length), 6000);
    const b = setInterval(() => setW((c) => (c + 1) % words.length), 2200);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);
  return (
    <section ref={ref} id="home" className="relative overflow-hidden bg-black text-white">
      <motion.div style={{ scale: zoom }} className="absolute inset-0">
        <AnimatePresence>
          <motion.img key={i} src={slides[i]} alt="" initial={{ opacity: 0, scale: 1 }} animate={{ opacity: 1, scale: 1.14 }} exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.6 }, scale: { duration: 8, ease: 'linear' } }} className="absolute inset-0 h-full w-full object-cover" />
        </AnimatePresence>
        {/* Optional video: public/videos/hero.mp4. It fades in over the slider once it loads. */}
        <video autoPlay muted loop playsInline onCanPlay={() => setVid(true)} onError={(e) => (e.currentTarget.style.display = 'none')}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${vid ? 'opacity-100' : 'opacity-0'}`}><source src="/videos/hero.mp4" type="video/mp4" /></video>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
      <motion.div style={{ y, opacity: fade }} className="relative mx-auto flex min-h-screen max-w-[1400px] flex-col items-center justify-center px-6 pb-24 pt-36 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 inline-flex mt-10 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.38em] text-white/80 backdrop-blur">Welcome To SandBox</motion.div>
        <h1 className="max-w-5xl text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl lg:text-[5.7rem]" style={{ perspective: 800 }}>
          Build with{' '}
          <span className="inline-block min-w-[1.2em]" style={{ color: G }}>
            <AnimatePresence mode="wait"><motion.span key={words[w]} className="inline-block" style={{ transformOrigin: 'center bottom' }} initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} exit={{ rotateX: 90, opacity: 0 }} transition={{ duration: 0.5 }}>{words[w]}</motion.span></AnimatePresence>
          </span><br />that gets backed.
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 max-w-3xl text-base leading-8 text-white/75 md:text-xl">
          SandBox brings students, startups, and investors into one sharp ecosystem where ideas get refined, proposals get noticed, and funding moves faster.</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <button onClick={() => go('/signup')} className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-bold text-black transition hover:bg-[#e39622] hover:text-white">Get Started <ArrowRight className="h-5 w-5" /></button>
          <button onClick={() => go('/about')} className="inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/5 px-8 py-4 font-semibold backdrop-blur transition hover:border-[#e39622] hover:bg-[#e39622]/15">Explore Platform <Play className="h-4 w-4" /></button>
        </motion.div>
        <div className="mt-16 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          {[['Students', 'Turn final-year projects into launch-ready ventures'], ['Startups', 'Present stronger proposals and attract real backers'], ['Investors', 'Discover curated opportunities with cleaner workflows']].map(([t, c], n) => (
            <motion.div key={t} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + n * 0.15, duration: 0.8 }}>
              <Tilt className="h-full rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 text-left backdrop-blur-md"><p className="text-sm font-bold uppercase tracking-[0.22em]" style={{ color: G }}>{t}</p><p className="mt-3 text-sm leading-7 text-white/75">{c}</p></Tilt>
            </motion.div>))}
        </div>
        <div className="absolute bottom-8 flex gap-2">{slides.map((_, k) => <button key={k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className="h-1.5 rounded-full transition-all duration-500" style={{ width: k === i ? 40 : 12, background: k === i ? G : '#ffffff55' }} />)}</div>
      </motion.div>
    </section>
  );
}

const services = [[FileText, 'Proposal Builder', 'Turn a rough idea into a structured proposal investors can read in minutes.'], [Users, 'Investor Matching', 'Get discovered by investors whose interests fit your sector and stage.'], [ShieldCheck, 'Secure NDAs', 'Sign agreements inside the platform before sensitive details are shared.'], [Landmark, 'Investor Portfolio', 'Organize opportunities and keep your investment activity in one workspace.']];
const ventures = [['Smart Irrigation System', 'Agritech', IMG.agri], ['Low-cost Diagnostic Kit', 'Healthtech', IMG.health], ['Peer Tutoring App', 'EdTech', IMG.students], ['Solar Cold Storage', 'Clean energy', IMG.lab]];
const steps = [[Users, 'Create your profile', 'Sign up as a student, startup or investor and get verified by our admins.'], [FileText, 'Share your proposal', 'Build a clear proposal and keep supporting research safe in your vault.'], [ShieldCheck, 'Match and sign', 'Connect with the right people, chat, and sign an NDA before going deeper.'], [Rocket, 'Get funded', 'Receive investment, track milestones and keep building.']];
const panels = [['Students', 'Turn final-year projects into launch-ready ventures.', IMG.students, 'student', GraduationCap], ['Startups', 'Present stronger proposals and attract real backers.', IMG.s4, 'startup', Rocket], ['Investors', 'Discover vetted early-stage opportunities in one place.', IMG.office, 'investor', Landmark]];
const bento = [[FileText, 'Structured proposals', 'One format for every idea, so investors compare on merit.', 'md:col-span-2'], [MessageSquare, 'Direct messaging', 'Talk to founders and investors without leaving the platform.', ''], [Lock, 'Innovation Vault', 'A private space for ideas and research.', ''], [ShieldCheck, 'Admin vetting', 'Every research idea and member is reviewed.', ''], [Landmark, 'Investment workspace', 'Explore opportunities and manage your investment activity in one place.', 'md:col-span-2'], [GraduationCap, 'Learning Hub', 'Guides and resources that get students pitch-ready.', '']];
const quotes = [['Sarah Johnson', 'Student', 'SandBox makes it effortless to turn academic skills into real-world projects. Connecting with startup founders and getting noticed by investors used to feel impossible—now it’s all in one clean, collaborative space.'], ['TechStart Innovation', 'Startup', 'As an early-stage founder, finding the right talent and backing is tough. SandBox cuts through the noise, helping us connect with skilled student developers and aligned investors within days.'], ['Capital Ventures', 'Investor', 'SandBox streamlines how I discover raw talent and early-stage ventures. It brings emerging student projects and ambitious founders together in one unified hub, making it easy to spot high-potential ideas early.']];

function Ventures() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const x = useTransform(scrollYProgress, [0, 1], ['4%', '-52%']);
  const go = useNavigate();
  return (
    <section ref={ref} className="relative h-[300vh] bg-black text-white">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <Wrap className="w-full pt-16"><Head dark title="Ventures taking off on Sandbox" sub="Explore active projects currently being built on Sandbox showcasing the real-world ideas, student-led innovations, and early-stage ventures attracting backers across our community." /></Wrap>
        <motion.div style={{ x }} className="flex gap-6 pl-6">
          {ventures.map(([t, c, img]) => (
            <button key={t} type="button" onClick={() => go('/signup')} aria-label={`Sign up to explore ${t}`} className="group relative h-[340px] w-[80vw] shrink-0 overflow-hidden rounded-[2rem] text-left md:w-[520px]">
              <Img src={img} alt={t} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-7"><div><p className="text-sm" style={{ color: G }}>{c}</p><h3 className="mt-1 text-2xl font-semibold">{t}</h3></div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full text-black" style={{ background: G }}><ArrowUpRight /></span></div>
            </button>))}
        </motion.div>
        <motion.div style={{ scaleX: scrollYProgress }} className="absolute bottom-10 left-6 right-6 h-0.5 origin-left" ><div className="h-full" style={{ background: G }} /></motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const go = useNavigate();
  const [a, setA] = useState(0), [q, setQ] = useState(0);
  useEffect(() => { const t = setInterval(() => setQ((c) => (c + 1) % quotes.length), 5000); return () => clearInterval(t); }, []);
  return (
    <>
      <Hero go={go} />
      <VelocityMarquee items={['Final-year projects', 'Seed proposals', 'Verified investors', 'Signed NDAs', 'Funded ventures']} />

      {/* 2 Services */}
      <section className="bg-[#f8f6f1] py-28 text-black"><Wrap>
        <Head title="Everything you need to get funded" sub="Four tools that replace scattered emails, spreadsheets, and unsigned promises. Pitch, collaborate, and manage opportunities." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{services.map(([I, t, d], n) => (
          <Reveal key={t} delay={n * 0.1} className="h-full"><Tilt className="h-full"><Spot className="h-full rounded-[2rem] bg-white p-8"><span className="flex h-16 w-16 items-center justify-center rounded-2xl text-black" style={{ background: G }}><I className="h-7 w-7" /></span>
            <h3 className="mt-8 text-2xl font-semibold">{t}</h3><p className="mt-3 leading-7 text-slate-600">{d}</p></Spot></Tilt></Reveal>))}</div>
      </Wrap></section>

      {/* 3 Intro */}
      <section className="bg-white py-28 text-black"><Wrap className="grid items-center gap-16 lg:grid-cols-2">
        <ParallaxImg src={IMG.meet} alt="Team collaborating" className="h-[760px] rounded-[2.5rem]" />
        <div>
          <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl"><Words text="Where ambition meets opportunity" /></h2>
          <Reveal><p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">SandBox replaces fragmented tools with one workspace built for the innovation lifecycle, so promising ideas stop stalling between a classroom and a boardroom. Students showcase real technical talent, founders assemble dedicated teams, and investors evaluate verified progress without sifting through endless email threads or disconnected spreadsheets. From initial concept validation and milestone tracking to formal commitments, every stage happens in one transparent environment.</p></Reveal>
          <div className="mt-10 grid grid-cols-3 gap-6 border-y border-black/10 py-8">{[[50, '+', 'Startups'], [35, '+', 'Investors'], [620, '+', 'Students']].map(([n, s, l]) => <div key={l}><div className="text-4xl font-bold md:text-5xl" style={{ color: '#b9740f' }}><CountUp to={n} suffix={s} /></div><p className="mt-1 text-slate-600">{l}</p></div>)}</div>
          <div className="mt-10"><GoldBtn onClick={() => go('/about')}>About SandBox</GoldBtn></div>
        </div>
      </Wrap></section>

      <Ventures />{/* 4 */}

      {/* 5 Process */}
      <section className="bg-white py-28 text-black"><Wrap>
        <Head title="Four steps from idea to investment" sub="Discover the step-by-step journey every project follows on SandBox from connecting with the right talent to securing investor backing." />
        {steps.map(([I, t, d], i) => (<div key={t} className="sticky" style={{ top: 110 + i * 26 }}>
          <div className={`mb-6 grid gap-6 rounded-[2rem] p-10 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-12 ${i % 2 ? 'text-black' : 'bg-black text-white'}`} style={i % 2 ? { background: '#FFF1D7', border: '1px solid rgba(227,150,34,0.35)' } : {}}>
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-black"><I className="h-9 w-9" /></span>
            <div><h3 className="text-3xl font-semibold">{t}</h3><p className="mt-2 max-w-2xl text-lg leading-8 opacity-75">{d}</p></div>
            <span className="text-7xl font-bold opacity-30">0{i + 1}</span></div></div>))}
      </Wrap></section>

      {/* 6 Panels */}
      <section className="bg-black py-28 text-white"><Wrap>
        <Head dark title="Built for every side of the table" sub="Hover a panel to unlock how SandBox connects you with the right people and opportunities." />
        <div className="flex flex-col gap-4 md:h-[560px] md:flex-row">{panels.map(([t, d, img, k, I], n) => (
          <motion.div key={t} onHoverStart={() => setA(n)} onClick={() => setA(n)} animate={{ flexGrow: a === n ? 3 : 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative h-72 flex-1 basis-0 cursor-pointer overflow-hidden rounded-[2rem] md:h-auto">
            <motion.div animate={{ scale: a === n ? 1.08 : 1 }} transition={{ duration: 1.2 }} className="absolute inset-0"><Img src={img} alt={t} className="h-full w-full object-cover" /></motion.div>
            <div className={`absolute inset-0 transition-colors duration-500 ${a === n ? 'bg-gradient-to-t from-black/90 via-black/30 to-transparent' : 'bg-black/60'}`} />
            <div className="absolute inset-x-0 bottom-0 p-8"><span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full text-black" style={{ background: G }}><I /></span><h3 className="text-3xl font-semibold">{t}</h3>
              <AnimatePresence>{a === n && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3"><p className="max-w-sm text-white/80">{d}</p><button onClick={() => go('/signup')} className="mt-5 inline-flex items-center gap-2 font-semibold" style={{ color: G }}>Join as {k} <ArrowUpRight className="h-4 w-4" /></button></motion.div>}</AnimatePresence></div>
          </motion.div>))}</div>
      </Wrap></section>

      {/* 7 Bento */}
      <section className="bg-[#f8f6f1] py-28 text-black"><Wrap>
        <Head title="Everything a deal needs, in one place" />
        <div className="grid gap-5 md:grid-cols-4">{bento.map(([I, t, d, span], n) => (
          <Reveal key={t} delay={(n % 3) * 0.1} className={span}><Spot className="h-full rounded-[2rem] bg-white p-8"><I className="h-9 w-9" style={{ color: G }} /><h3 className="mt-6 text-2xl font-semibold">{t}</h3><p className="mt-2 leading-7 text-slate-600">{d}</p>
            {n === 4 && <div className="mt-6 flex h-24 items-end gap-2">{[30, 45, 40, 60, 75, 95].map((h, k) => <motion.div key={k} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ delay: k * 0.1, duration: 0.9 }} className="flex-1 rounded-t" style={{ background: G }} />)}</div>}</Spot></Reveal>))}</div>
      </Wrap></section>

      {/* 8 Testimonials */}
      <section className="bg-black py-24 text-white"><Wrap className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl"><Words text="Real Stories from Our Community" /></h2>
          <div className="mt-8 flex gap-3">{quotes.map((_, k) => <button key={k} aria-label={`Quote ${k + 1}`} onClick={() => setQ(k)} className="h-2 rounded-full transition-all" style={{ width: k === q ? 48 : 16, background: k === q ? G : '#ffffff44' }} />)}</div>
        </div>
        <div className="min-h-[230px] rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 md:p-10">
          <AnimatePresence mode="wait"><motion.div key={q} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.45 }}>
            <p className="text-xl leading-9 md:text-2xl md:leading-10">“{quotes[q][2]}”</p>
            <div className="mt-8 flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-full font-bold text-black" style={{ background: G }}>{quotes[q][0][0]}</span><div><p className="font-semibold">{quotes[q][0]}</p><p className="text-sm text-white/55">{quotes[q][1]}</p></div></div>
          </motion.div></AnimatePresence>
        </div>
      </Wrap></section>

      <CTA go={go} title="Your next big idea starts here." text="Create a free account and join the students, startups and investors already building on SandBox." />
    </>
  );
}
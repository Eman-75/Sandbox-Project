import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { CTA, CountUp, G, IMG, PageHero, ParallaxImg, Reveal, Words, Wrap } from './shared';

const Word = ({ w, p, a, b }) => { const o = useTransform(p, [a, b], [0.15, 1]); return <motion.span style={{ opacity: o }} className="mr-[0.25em] inline-block">{w}</motion.span>; };
function Scrub({ text }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const ws = text.split(' ');
  return <p ref={ref} className="text-3xl font-bold leading-[1.25] tracking-tight md:text-6xl">{ws.map((w, i) => <Word key={i} w={w} p={scrollYProgress} a={i / ws.length} b={(i + 1.5) / ws.length} />)}</p>;
}

const journey = [['The spark', 'A student notices a problem during a final-year project and writes the first version of the idea.'], ['The proposal', 'The idea becomes a structured proposal, reviewed by admins so investors can trust it.'], ['The match', 'Startups and investors discover it, shortlist it and open a conversation.'], ['The agreement', 'Both sides sign an NDA on the platform and share the details that matter.'], ['The funding', 'Investment is made and tracked while founders keep building with real backing.']];
const values = [['Clarity', 'One standardized proposal format so ideas are compared on merit, not on slide design. Instead of getting lost in flashy pitch decks or vague summaries, every project presents clear problem statements, roadmaps, and deliverables helping builders communicate sharply and investors evaluate faster.'], ['Trust', 'Verified profiles, documented milestones, and transparent agreements so commitments are backed by proof, not empty promises. Whether you are bringing on a student developer or closing an early backer, every step is recorded in one shared space so everyone builds with confidence.'], ['Momentum', 'Built-in workflows that keep teams shipping and investors updated, so great ideas never stall between the classroom and the boardroom. By replacing scattered emails and static spreadsheets with live progress tracking, ventures move smoothly from initial prototype to market ready launch.'], ['Access', 'Direct connections between emerging talent, ambitious founders, and serious capital no gatekeepers or warm introductions required. SandBox levels the playing field so any dedicated builder with a strong idea can find the right teammates and backers to bring it to life.']];

export default function About() {
  const go = useNavigate();
  const [v, setV] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.6', 'end 0.7'] });
  const line = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  return (
    <>
      <PageHero page="About" title="We exist so good ideas get backed." copy="SandBox is a workspace built for the journey from a student’s first spark to a funded venture." />

      <section className="bg-[#f8f6f1] py-32 text-black"><Wrap>
        <Scrub text="Too many promising ideas stall between a classroom and a boardroom. We replaced scattered emails, unsigned promises and guesswork with one workspace where students, startups and investors meet on equal terms." />
      </Wrap></section>

      <section className="bg-black py-28 text-white"><Wrap>
        <h2 className="text-4xl font-bold tracking-tight md:text-6xl"><Words text="The journey of an idea" /></h2>
        <div ref={ref} className="relative mt-20">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-white/15 md:left-1/2" />
          <motion.div style={{ height: line }} className="absolute left-4 top-0 w-px md:left-1/2" ><div className="h-full w-full" style={{ background: G }} /></motion.div>
          {journey.map(([t, d], n) => (
            <Reveal key={t} className={`relative mb-16 pl-14 md:w-1/2 md:pl-0 ${n % 2 ? 'md:ml-auto md:pl-16' : 'md:pr-16 md:text-right'}`}>
              <span className={`absolute left-[10px] top-2 h-3 w-3 rounded-full ring-8 ring-[#e39622]/20 ${n % 2 ? 'md:-left-[6px]' : 'md:left-auto md:-right-[6px]'}`} style={{ background: G }} />
              <h3 className="text-3xl font-semibold" style={{ color: G }}>{t}</h3><p className="mt-3 max-w-lg text-lg leading-8 text-white/65 md:inline-block">{d}</p>
            </Reveal>))}
        </div>
      </Wrap></section>

      <section className="bg-white py-28 text-black"><Wrap>
        <h2 className="mb-12 text-4xl font-bold tracking-tight md:text-6xl"><Words text="What we stand for" /></h2>
        <div className="divide-y divide-black/10 border-y border-black/10">
          {values.map(([t, d], n) => (
            <div key={t} onMouseEnter={() => setV(n)} onClick={() => setV(n)} className="cursor-pointer py-8">
              <div className="flex items-center justify-between gap-6"><h3 className="text-5xl font-bold tracking-tight transition-colors duration-300 md:text-7xl" style={{ color: v === n ? '#b9740f' : '#00000033' }}>{t}</h3>
                <motion.span animate={{ rotate: v === n ? 90 : 0 }} className="text-4xl" style={{ color: G }}>→</motion.span></div>
              <AnimatePresence initial={false}>{v === n && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="max-w-2xl overflow-hidden pt-4 text-xl leading-8 text-slate-600">{d}</motion.p>}</AnimatePresence>
            </div>))}
        </div>
      </Wrap></section>
      <CTA go={go} title="Be part of the story." text="Whether you have an idea, a startup or capital to deploy, there is a place for you on SandBox." btn="Join now" />
    </>
  );
}
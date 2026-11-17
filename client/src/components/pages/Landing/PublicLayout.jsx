import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight, Facebook, Instagram, Linkedin, Mail, MapPin, Menu, Phone, Twitter, X } from 'lucide-react';
import Logo from '../../../assets/SandBox logo.png';
import API from '../../../api/axios';

const links = [['/', 'Home'], ['/about', 'About'], ['/services', 'Who We Serve'], ['/contact', 'Contact']];

function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 }), sy = useSpring(y, { stiffness: 500, damping: 40 });
  const [big, setBig] = useState(false);
  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    const m = (e) => { x.set(e.clientX); y.set(e.clientY); setBig(!!e.target.closest?.('a,button,input,textarea,[role=button]')); };
    window.addEventListener('mousemove', m);
    return () => window.removeEventListener('mousemove', m);
  }, [x, y]);
  return (
    <motion.div style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-[80] hidden lg:block">
      <motion.div animate={{ width: big ? 64 : 26, height: big ? 64 : 26, backgroundColor: big ? 'rgba(227,150,34,0.25)' : 'rgba(227,150,34,0)' }} className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e39622]" />
    </motion.div>
  );
}

export default function PublicLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => { window.scrollTo(0, 0); setOpen(false); }, [pathname]);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f(); window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <style>{`@keyframes marquee{to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}`}</style>
      <motion.div style={{ scaleX: bar }} className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left bg-[#e39622]" />
      <Cursor />
      <motion.div key={pathname} initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }} style={{ originY: 0 }} className="pointer-events-none fixed inset-0 z-[70] border-b-4 border-[#e39622] bg-black" />

      <motion.header initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
        <div className={`mx-auto flex max-w-[1400px] items-center justify-between rounded-full px-5 py-3 transition-all duration-500 md:px-8 ${
          scrolled ? 'bg-white/90 text-black shadow-2xl backdrop-blur-xl' : 'bg-white/10 text-white backdrop-blur-md'}`}>
          <Link to="/" className="flex items-center gap-3">
            <img src={Logo} alt="" className="h-10 w-10 object-contain" />
            <span className="text-xl font-semibold tracking-tight">SandBox</span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end className="relative px-4 py-2 text-[15px] font-medium">
                {({ isActive }) => (<>
                  {label}
                  {isActive && <motion.span layoutId="nav-pill" className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded bg-[#e39622]" />}
                </>)}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <button onClick={() => navigate('/login')} className="rounded-full border border-current/20 px-5 py-2.5 text-sm font-semibold hover:text-[#e39622]">Login</button>
            <button onClick={() => navigate('/signup')} className="rounded-full bg-[#e39622] px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-110">Sign Up</button>
          </div>
          <button className="lg:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="mx-auto mt-2 max-w-[1400px] rounded-3xl bg-white p-6 text-black shadow-2xl lg:hidden">
              {links.map(([to, label]) => <Link key={to} to={to} className="block py-3 text-xl font-semibold">{label}</Link>)}
              <div className="mt-4 flex gap-3">
                <button onClick={() => navigate('/login')} className="flex-1 rounded-full border border-black/15 py-3 font-semibold">Login</button>
                <button onClick={() => navigate('/signup')} className="flex-1 rounded-full bg-black py-3 font-semibold text-white">Sign Up</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <motion.main key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Outlet />
      </motion.main>

      <footer className="bg-black text-white">
        <div className="h-px bg-gradient-to-r from-transparent via-[#e39622] to-transparent" />
        <div className="mx-auto max-w-[1400px] px-6 pt-20">
          <div className="grid gap-12 pb-16 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="flex items-center gap-3"><img src={Logo} alt="" className="h-11 w-11 object-contain" /><span className="text-xl font-semibold">SandBox</span></div>
              <p className="mt-5 max-w-md leading-7 text-white/60">A collaborative platform where students, startups and investors share proposals, sign NDAs and track funding in one place.</p>
              <div className="mt-7 flex gap-3">{[Facebook, Twitter, Linkedin, Instagram].map((I, k) => <a key={k} href="#" aria-label="Social link" className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.07] transition hover:bg-[#e39622] hover:text-black"><I className="h-4 w-4" /></a>)}</div>
            </div>
            <div className="rounded-3xl bg-white/[0.05] p-8">
              <h3 className="text-xl font-semibold">Get platform updates</h3>
              <p className="mt-2 text-white/60">New features and funding opportunities, sent occasionally.</p>
              {subscribed ? <p className="mt-6 font-medium text-[#e39622]" role="status">{newsletterMessage}</p> : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const email = new FormData(form).get('email');
                    setNewsletterLoading(true);
                    setNewsletterMessage('');
                    try {
                      const response = await API.post('/newsletter/subscribe', { email });
                      setNewsletterMessage(response.data.message || 'Thank you. You are subscribed.');
                      setSubscribed(true);
                    } catch (error) {
                      setNewsletterMessage(error.response?.data?.message || 'Could not subscribe. Please try again.');
                    } finally {
                      setNewsletterLoading(false);
                    }
                  }}
                  className="mt-6 flex flex-col gap-3 sm:flex-row"
                >
                  <input name="email" required type="email" placeholder="Your email address" className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black px-4 py-3.5 text-white placeholder-white/40 outline-none focus:border-[#e39622]" />
                  <button disabled={newsletterLoading} className="rounded-xl bg-[#e39622] px-7 py-3.5 font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
                    {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>)}
              {!subscribed && newsletterMessage && <p className="mt-3 text-sm text-red-300" role="alert">{newsletterMessage}</p>}
            </div>
          </div>
          <div className="grid gap-10 border-t border-white/10 py-14 sm:grid-cols-2 lg:grid-cols-4">
            <div><h3 className="mb-5 font-semibold">Company</h3><nav className="flex flex-col gap-3 text-white/60">{links.map(([to, t]) => <Link key={to} to={to} className="transition hover:text-[#e39622]">{t}</Link>)}</nav></div>
            <div><h3 className="mb-5 font-semibold">Join as</h3><nav className="flex flex-col gap-3 text-white/60">{['Student', 'Startup', 'Investor'].map((r) => <Link key={r} to="/signup" className="transition hover:text-[#e39622]">{r}</Link>)}</nav></div>
            <div><h3 className="mb-5 font-semibold">Legal</h3><nav className="flex flex-col gap-3 text-white/60">{['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((r) => <a key={r} href="#" className="transition hover:text-[#e39622]">{r}</a>)}</nav></div>
            <div><h3 className="mb-5 font-semibold">Contact</h3><ul className="space-y-3 text-white/60">
              <li className="flex gap-3"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#e39622]" />contact@sandbox.com</li>
              <li className="flex gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#e39622]" />+92 313 2820530</li>
              <li className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#e39622]" />Barani Institute of Sciences, Chichawatni Road, Burewala</li></ul></div>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-7 text-sm text-white/45 sm:flex-row"><p>© {new Date().getFullYear()} SandBox. All rights reserved.</p><p>Connecting innovation with investment.</p></div>
        </div>
      </footer>
    </div>
  );
}
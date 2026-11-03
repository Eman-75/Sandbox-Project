import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle, Mail, MapPin, Phone, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../assets/SandBox logo.png';
import WorkProcess from './WorkProcess';

function Landing() {
  const navigate = useNavigate();
  const heroWords = ['Innovation', 'Startups', 'Funding', 'Ideas'];
  const [activeHeroWord, setActiveHeroWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroWord((current) => (current + 1) % heroWords.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [heroWords.length]);

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="landing-page min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black px-4 pt-6 text-white md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full bg-white px-5 py-3 text-black shadow-[0_20px_80px_rgba(0,0,0,0.28)] md:px-8">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="SandBox Logo" className="h-11 w-11 object-contain" />
            <h1 className="text-2xl font-black tracking-tight">SandBox</h1>
          </div>
          <nav className="hidden items-center gap-8 text-[15px] font-medium lg:flex">
            <a href="#home" className="transition-colors hover:text-[#e39622]">Home</a>
            <a href="#services" className="transition-colors hover:text-[#e39622]">Services</a>
            <a href="#about" className="transition-colors hover:text-[#e39622]">About</a>
            <a href="#contact" className="transition-colors hover:text-[#e39622]">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:border-[#e39622] hover:text-[#e39622]"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#e39622]"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-80">
          <div className="absolute left-[-10%] top-24 h-72 w-72 rounded-full bg-[#e39622]/15 blur-3xl" />
          <div className="absolute right-[-6%] top-40 h-80 w-80 rounded-full bg-white/8 blur-3xl" />
          <div className="absolute bottom-10 left-1/2 h-52 w-[36rem] -translate-x-1/2 rounded-full bg-[#e39622]/10 blur-3xl" />
        </div>
        <div className="relative mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl flex-col items-center justify-center px-6 pb-20 pt-24 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.38em] text-white/80">
            Welcome To SandBox
          </div>
          <h1 className="max-w-5xl text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl lg:text-[5.7rem]">
            Build with{' '}
            <span
              key={heroWords[activeHeroWord]}
              className="inline-block min-w-[1.2em] animate-[flipIn_0.6s_ease] text-[#e39622] [transform-origin:center_bottom]"
            >
              {heroWords[activeHeroWord]}
            </span>
            <br />
            that gets backed.
          </h1>
          <p className="mt-8 max-w-3xl text-base leading-8 text-white/72 md:text-xl">
            SandBox brings students, startups, and investors into one sharp ecosystem where ideas get refined,
            proposals get noticed, and funding moves faster.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-bold text-black transition-all hover:bg-[#e39622] hover:text-white"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:border-[#e39622] hover:bg-[#e39622]/12"
            >
              Explore Platform
              <Play className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-16 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              ['Students', 'Turn final-year projects into launch-ready ventures'],
              ['Startups', 'Present stronger proposals and attract real backers'],
              ['Investors', 'Discover curated opportunities with cleaner workflows'],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 text-left backdrop-blur-sm">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#e39622]">{title}</p>
                <p className="mt-3 text-sm leading-7 text-white/70">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About SandBox Section */}
      <section id="about" className="bg-[#f8f6f1] py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-2">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.12fr_0.88fr] lg:gap-24">
            <div className="max-w-4xl">
              <h4 className="text-[#e39622] uppercase tracking-widest text-sm font-bold mb-4">About Us</h4>
              <div className='flex flex-col justify-space-between'>
                <h2 className="text-5xl md:text-6xl font-bold text-black tracking-tight mb-4 leading-tight">
                  Where Ambition Meets
                  <span className="text-[#e39622]"> Opportunity </span>
                </h2>

                <div className="mt-10 max-w-3xl space-y-6 text-lg leading-7 text-slate-700">
                  <p>
                    SandBox is the dedicated workspace where high-potential ideas are transformed into backed ventures. We bridge the gap between the initial spark and institutional readiness by replacing fragmented tools with a unified ecosystem designed for the specific needs of the innovation lifecycle.
                    SandBox helps students, founders, and investors move from scattered conversations to real momentum.
                  </p>
                  <p>
                    The result is a cleaner path to build, connect, and invest with confidence, without the usual friction that slows promising ideas down.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-10 h-48 w-48 rounded-full bg-[#e39622]/12 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] bg-[#efe8dc] p-3 shadow-[0_30px_90px_rgba(15,23,42,0.12)]">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600%22"
                  alt="About SandBox"
                  className="h-[540px] w-full rounded-[1.6rem] object-cover"
                />
                <div className="absolute bottom-8 right-6 w-64 rounded-[1.8rem] bg-white/94 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Platform Flow</p>
                  <div className="relative mt-5 h-36 rounded-[1.5rem] bg-[#f8f8fb]">
                    <div className="absolute left-5 top-6 h-10 w-10 rounded-full bg-slate-700" />
                    <div className="absolute right-6 top-6 h-8 w-8 rounded-full bg-indigo-300" />
                    <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e39622]" />
                    <div className="absolute bottom-7 left-8 h-4 w-4 rounded-full bg-indigo-500" />
                    <div className="absolute bottom-10 right-7 h-4 w-4 rounded-full bg-emerald-400" />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    <span>Build</span>
                    <span>Match</span>
                    <span>Fund</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section id="services" className="bg-white py-24">
        {/* Container set to 1400px */}
        <div className="mx-auto max-w-[1400px] px-2">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h4 className="text-[#e39622] uppercase tracking-widest text-sm font-bold mb-4">Who We Serve</h4>
            <h2 className="text-5xl md:text-6xl font-bold text-black tracking-tight mb-4 leading-tight ser">
                  Partnering for 
                  <span className="text-[#e39622]"> Growth </span>
                </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              SandBox is designed to bridge the gap between academic potential and market success.
              We provide a unified workspace where talent meets capital to turn scattered ideas into real-world momentum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Students Card */}
            <div className="bg-[#fff9f0] rounded-2xl p-8 flex flex-col h-full border border-orange-100/50 transition-all hover:shadow-xl">
              <div className="relative w-full h-64 bg-white rounded-xl mb-8 overflow-visible">
                {/* Circular icon moved more to the right */}
                <div className="absolute -bottom-5 left-5 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 z-10">
                  <span className="text-black text-xl font-bold">🎓</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400"
                  alt="Students"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h3 className="text-3xl font-bold text-black mb-4 leading-tight">Students</h3>
              <p className="text-gray-800 mb-8 flex-grow leading-relaxed">
                Move from academic theory to real-world impact. Showcase your research, find founding teams, and build a professional track record before graduation.
              </p>
              <button
                onClick={() => handleSignUp('student')}
                className="w-fit px-10 py-4 bg-[#e39622] text-white font-bold rounded-full hover:brightness-110 transition-all text-sm uppercase tracking-wider"
              >
                Click here
              </button>
            </div>

            {/* Startups Card */}
            <div className="bg-[#fff9f0] rounded-2xl p-8 flex flex-col h-full border border-orange-100/50 transition-all hover:shadow-xl">
              <div className="relative w-full h-64 bg-white rounded-xl mb-8 overflow-visible">
                <div className="absolute -bottom-5 left-5 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 z-10">
                  <span className="text-black text-xl font-bold">🚀</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400"
                  alt="Startups"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h3 className="text-3xl font-bold text-black mb-4 leading-tight">Startups</h3>
              <p className="text-gray-800 mb-8 flex-grow leading-relaxed">
                Stop juggling scattered tools. We bridge the gap between your pitch and investor capital through structured, guided collaboration and momentum tracking.
              </p>
              <button
                onClick={() => handleSignUp('startup')}
                className="w-fit px-10 py-4 bg-[#e39622] text-white font-bold rounded-full hover:brightness-110 transition-all text-sm uppercase tracking-wider"
              >
                Click here
              </button>
            </div>

            {/* Investors Card */}
            <div className="bg-[#fff9f0] rounded-2xl p-8 flex flex-col h-full border border-orange-100/50 transition-all hover:shadow-xl">
              <div className="relative w-full h-64 bg-white rounded-xl mb-8 overflow-visible">
                <div className="absolute -bottom-5 left-5 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 z-10">
                  <span className="text-black text-xl font-bold">🏛️</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400"
                  alt="Investors"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h3 className="text-3xl font-bold text-black mb-4 leading-tight">Investors</h3>
              <p className="text-gray-800 mb-8 flex-grow leading-relaxed">
                Gain deep visibility into high-signal early-stage ventures. Discover vetted talent and track progress through integrated discovery and funding workflows.
              </p>
              <button
                onClick={() => handleSignUp('investor')}
                className="w-fit px-10 py-4 bg-[#e39622] text-white font-bold rounded-full hover:brightness-110 transition-all text-sm uppercase tracking-wider"
              >
                Click here
              </button>
            </div>
          </div>
        </div>
      </section>

      <WorkProcess />


      {/* Statistics Section */}
      <section className="py-25">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-black dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-yellow-500/20 transition-all">
              <div className="text-4xl font-bold text-[#e39622] mb-2">500+</div>
              <div className="text-sm text-slate-300 dark:text-slate-300 font-semibold">
                Active Startups
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-black dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-yellow-500/20 transition-all">
              <div className="text-4xl font-bold text-[#e39622] mb-2">200+</div>
              <div className="text-sm text-slate-300 dark:text-slate-300 font-semibold">
                Investors
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-black dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-yellow-500/20 transition-all">
              <div className="text-4xl font-bold text-[#e39622] mb-2">$50M+</div>
              <div className="text-sm text-slate-300 dark:text-slate-300 font-semibold">
                Total Funded
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-black dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-yellow-500/20 transition-all">
              <div className="text-4xl font-bold text-[#e39622] mb-2">1000+</div>
              <div className="text-sm text-slate-300 dark:text-slate-300 font-semibold">
                Students
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-black text-white py-25">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Let's <span className="text-[#e39622]">Connect!</span>
            </h2>
            <p className="text-xl text-gray-300">
              Ready to transform your ideas into reality? Get in touch with us today and join the SandBox community.
            </p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <textarea
                    placeholder="Your Message"
                    rows="6"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-white rounded-lg hover:bg-orange-600 transition-all font-semibold"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#e39622] to-[#ffb347] rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold">Email Address</span>
                    </div>
                    <div className="ml-13 text-gray-400">
                      <p>contact@sandbox.com</p>
                      <p>support@sandbox.com</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#e39622] to-[#ffb347] rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold">Phone Number</span>
                    </div>
                    <div className="ml-13 text-gray-400">
                      <p>+92 (313) 2820530</p>
                      <p>+92 (321) 6992224</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#e39622] to-[#ffb347] rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold">Office Address</span>
                    </div>
                    <div className="ml-13 text-gray-400">
                      <p>Barani Institute of Sciences</p>
                      <p>Chichawatni Road | Burewala</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section id="testimonials" className="bg-white py-25">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Success <span className="text-[#e39622]">Stories</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'Student', text: 'SandBox helped me turn my idea into a funded project in just 3 months. SandBox helped me turn my idea into a funded project in just 3 months.SandBox helped me turn my idea into a funded project in just 3 months.SandBox helped me turn my idea into a funded project in just 3 months.', avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100' },
              { name: 'TechStart Innovation', role: 'Startup', text: 'We connected with the right investors through SandBox and scaled faster than expected. SandBox helped me turn my idea into a funded project in just 3 months.SandBox helped me turn my idea into a funded project in just 3 months.SandBox helped me turn my idea into a funded project in just 3 months.', avatar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100' },
              { name: 'Capital Ventures', role: 'Investor', text: 'The platform provides vetted projects and visionary founders – highly recommend. SandBox helped me turn my idea into a funded project in just 3 months.SandBox helped me turn my idea into a funded project in just 3 months.SandBox helped me turn my idea into a funded project in just 3 months.', avatar: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=100' },
            ].map((item, idx) => (
              <div key={idx} className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:shadow-xl hover:shadow-yellow-500/20 transition-all text-white">
                <div className="flex items-center gap-4 mb-4">
                  <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-lg">{item.name}</h4>
                    <p className="text-sm text-yellow-400">{item.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* SandBox Logo and Tagline */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="">
                  <img src={Logo} alt="SandBox Logo" className="w-13 h-13 object-contain" />
                </div>
                <div>
                  <span className="text-white">Sand</span>
                  <span className="text-white font-bold">Box</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Connecting innovation with investment for a brighter future.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h3 className="text-white font-bold mb-4">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    For Students
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    For Startups
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    For Investors
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#about"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#team"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Team
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-bold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 SandBox. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

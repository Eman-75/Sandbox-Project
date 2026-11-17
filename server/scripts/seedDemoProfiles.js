import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import InvestorProfile from '../models/InvestorProfile.js';
import StudentProfile from '../models/StudentProfile.js';

dotenv.config();

const demoPassword = 'Sandbox@2026!';
const investors = [
  {
    name: 'Ayesha Rahman',
    email: 'ayesha.rahman@investor.demo',
    companyName: 'Rahman Ventures',
    position: 'Managing Partner',
    experienceLevel: '12 years',
    bio: 'Ayesha Rahman is an early-stage investor focused on agritech, climate solutions, and founder-led businesses with measurable social impact. She has experience supporting Seed and Pre-seed teams through capital planning, market validation, partnerships, and responsible growth.',
    linkedInUrl: 'https://www.linkedin.com/',
    min: 50000,
    max: 300000,
    sectors: ['Agritech', 'Climate', 'SaaS'],
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80&auto=format&fit=crop',
  },
  {
    name: 'Daniel Carter',
    email: 'daniel.carter@investor.demo',
    companyName: 'Carter Capital',
    position: 'Angel Investor',
    experienceLevel: '9 years',
    bio: 'Daniel Carter invests in high-potential healthtech and diagnostics startups. He partners with founders on regulatory strategy, clinical pilots, operational readiness, and scaling customer adoption across underserved healthcare markets.',
    linkedInUrl: 'https://www.linkedin.com/',
    min: 75000,
    max: 500000,
    sectors: ['Healthtech', 'Diagnostics', 'AI'],
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80&auto=format&fit=crop',
  },
  {
    name: 'Sara Malik',
    email: 'sara.malik@investor.demo',
    companyName: 'Malik Growth Fund',
    position: 'Investment Director',
    experienceLevel: '10 years',
    bio: 'Sara Malik backs education technology, fintech, and inclusive digital platforms. She brings a practical growth and customer-acquisition perspective, helping teams build sustainable business models and strong school, university, or enterprise partnerships.',
    linkedInUrl: 'https://www.linkedin.com/',
    min: 40000,
    max: 250000,
    sectors: ['EdTech', 'FinTech', 'Consumer'],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80&auto=format&fit=crop',
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@investor.demo',
    companyName: 'Chen Frontier Partners',
    position: 'Seed Fund Principal',
    experienceLevel: '14 years',
    bio: 'Michael Chen leads investments in clean energy, smart infrastructure, and deep technology. He supports technical founders as they move from prototype to pilot, structure venture financing, recruit executive talent, and enter new markets.',
    linkedInUrl: 'https://www.linkedin.com/',
    min: 100000,
    max: 750000,
    sectors: ['Clean Energy', 'IoT', 'Deep Tech'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80&auto=format&fit=crop',
  },
];

const students = [
  {
    name: 'Hamza Ali',
    email: 'hamza.ali@student.demo',
    registrationNo: 'FYP-2026-HA-01',
    department: 'Computer Science',
    universityName: 'COMSATS University',
    degreeLevel: 'Bachelors',
    bio: 'Hamza Ali is a computer science student specializing in full-stack development, IoT automation, and applied machine learning. He enjoys turning research concepts into practical prototypes and is building a platform for smart agriculture.',
    portfolioUrl: 'https://github.com/',
    interests: ['Agritech', 'IoT', 'Software Development'],
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80&auto=format&fit=crop',
  },
  {
    name: 'Mariam Siddiqui',
    email: 'mariam.siddiqui@student.demo',
    registrationNo: 'FYP-2026-MS-02',
    department: 'Biomedical Engineering',
    universityName: 'National University of Sciences and Technology',
    degreeLevel: 'Masters',
    bio: 'Mariam Siddiqui focuses on affordable medical devices, rapid diagnostics, and biomedical data analysis. Her work combines engineering research with human-centered design to improve access to low-cost healthcare solutions.',
    portfolioUrl: 'https://www.linkedin.com/',
    interests: ['Healthtech', 'Medical Devices', 'Diagnostics'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80&auto=format&fit=crop',
  },
  {
    name: 'Omar Khan',
    email: 'omar.khan@student.demo',
    registrationNo: 'FYP-2026-OK-03',
    department: 'Software Engineering',
    universityName: 'FAST National University',
    degreeLevel: 'Bachelors',
    bio: 'Omar Khan is a software engineering student with experience in mobile applications, real-time systems, and UX research. He is developing a peer-to-peer learning app that makes quality tutoring more accessible for students.',
    portfolioUrl: 'https://github.com/',
    interests: ['EdTech', 'Mobile Apps', 'AI'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
  },
  {
    name: 'Zara Noor',
    email: 'zara.noor@student.demo',
    registrationNo: 'FYP-2026-ZN-04',
    department: 'Renewable Energy Engineering',
    universityName: 'University of Engineering and Technology',
    degreeLevel: 'Masters',
    bio: 'Zara Noor researches renewable energy storage, solar system optimization, and resilient off-grid infrastructure. Her final-year project explores solar-powered cold storage for reducing food waste in rural communities.',
    portfolioUrl: 'https://www.linkedin.com/',
    interests: ['Clean Energy', 'Sustainability', 'Cold Chain'],
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80&auto=format&fit=crop',
  },
];

async function seedDemoProfiles() {
  if (!process.env.MONGO_URL) throw new Error('MONGO_URL is missing from server/.env');

  await mongoose.connect(process.env.MONGO_URL);
  const passwordHash = await bcrypt.hash(demoPassword, 12);

  for (const investor of investors) {
    let user = await User.findOne({ email: investor.email });
    if (!user) {
      user = await User.create({
        name: investor.name,
        email: investor.email,
        password: passwordHash,
        role: 'investor',
        isVerified: true,
      });
    } else {
      user.name = investor.name;
      user.password = passwordHash;
      user.role = 'investor';
      user.isVerified = true;
      await user.save();
    }

    await InvestorProfile.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          companyName: investor.companyName,
          position: investor.position,
          experienceLevel: investor.experienceLevel,
          bio: investor.bio,
          linkedInUrl: investor.linkedInUrl,
          investmentRange: { min: investor.min, max: investor.max },
          sectorsOfInterest: investor.sectors,
          profilePicture: investor.image,
          isProfileComplete: true,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );
    console.log(`Synced investor: ${investor.name}`);
  }

  for (const student of students) {
    let user = await User.findOne({ email: student.email });
    if (!user) {
      user = await User.create({
        name: student.name,
        email: student.email,
        password: passwordHash,
        role: 'student',
        isVerified: true,
      });
    } else {
      user.name = student.name;
      user.password = passwordHash;
      user.role = 'student';
      user.isVerified = true;
      await user.save();
    }

    await StudentProfile.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          registrationNo: student.registrationNo,
          department: student.department,
          universityName: student.universityName,
          degreeLevel: student.degreeLevel,
          bio: student.bio,
          portfolioUrl: student.portfolioUrl,
          interestCategories: student.interests,
          profilePicture: student.image,
          isProfileComplete: true,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );
    console.log(`Synced student: ${student.name}`);
  }
}

seedDemoProfiles()
  .then(async () => {
    await mongoose.disconnect();
    console.log('Demo investor and student seed completed.');
  })
  .catch(async (error) => {
    console.error('Demo profile seed failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  });

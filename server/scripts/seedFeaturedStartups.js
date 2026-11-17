import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import StartupProfile from '../models/StartupProfile.js';

dotenv.config();

const demoPassword = 'Sandbox@2026!';

const featuredStartups = [
  {
    name: 'Smart Irrigation System',
    email: 'smart-irrigation@sandbox.demo',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1400&q=80&auto=format&fit=crop',
    bio: 'Smart Irrigation System is an agritech venture using soil sensors, weather data, and automated controls to deliver the right amount of water at the right time. The platform helps farms reduce water waste, lower operating costs, monitor field conditions remotely, and improve crop yields through simple, data-driven decisions.',
    fundingStage: 'Pre-seed',
    seekingAmount: 75000,
    equityOffering: '8%',
  },
  {
    name: 'Low-cost Diagnostic Kit',
    email: 'diagnostic-kit@sandbox.demo',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&q=80&auto=format&fit=crop',
    bio: 'Low-cost Diagnostic Kit is a healthtech venture creating affordable and accessible rapid-testing tools for clinics, pharmacies, and underserved communities. Its compact workflow is designed for quick sample processing, clear results, lower testing costs, and reliable support for earlier diagnosis and timely treatment.',
    fundingStage: 'Seed',
    seekingAmount: 125000,
    equityOffering: '10%',
  },
  {
    name: 'Peer Tutoring App',
    email: 'peer-tutoring@sandbox.demo',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&q=80&auto=format&fit=crop',
    bio: 'Peer Tutoring App is an edtech platform that connects learners with verified peer tutors for focused, collaborative study sessions. Students can discover tutors by subject, schedule live sessions, share learning resources, ask questions, track progress, and build confidence through an affordable community-led learning experience.',
    fundingStage: 'Seed',
    seekingAmount: 100000,
    equityOffering: '9%',
  },
  {
    name: 'Solar Cold Storage',
    email: 'solar-cold-storage@sandbox.demo',
    image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=1400&q=80&auto=format&fit=crop',
    bio: 'Solar Cold Storage is a clean-energy startup delivering off-grid refrigerated storage for farms, markets, and rural food suppliers. The system uses solar power and efficient cooling to preserve fresh produce, reduce post-harvest losses, extend selling windows, and help producers reach better prices.',
    fundingStage: 'Series A',
    seekingAmount: 250000,
    equityOffering: '12%',
  },
];

async function seedFeaturedStartups() {
  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL is missing from server/.env');
  }

  await mongoose.connect(process.env.MONGO_URL);
  const passwordHash = await bcrypt.hash(demoPassword, 12);

  for (const startup of featuredStartups) {
    let user = await User.findOne({ email: startup.email });

    if (!user) {
      user = await User.create({
        name: startup.name,
        email: startup.email,
        password: passwordHash,
        role: 'startup',
        isVerified: true,
      });
    } else {
      user.name = startup.name;
      user.role = 'startup';
      user.isVerified = true;
      user.password = passwordHash;
      await user.save();
    }

    await StartupProfile.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          companyName: startup.name,
          bio: startup.bio,
          fundingStage: startup.fundingStage,
          seekingAmount: startup.seekingAmount,
          equityOffering: startup.equityOffering,
          companyLogo: startup.image,
          profilePicture: startup.image,
          isProfileComplete: true,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    console.log(`Synced startup: ${startup.name}`);
  }
}

seedFeaturedStartups()
  .then(async () => {
    await mongoose.disconnect();
    console.log('Featured startup seed completed.');
  })
  .catch(async (error) => {
    console.error('Featured startup seed failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  });

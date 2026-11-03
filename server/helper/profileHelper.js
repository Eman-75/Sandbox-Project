// helpers/profileHelper.js
import StudentProfile from '../models/StudentProfile.js';
import StartupProfile from '../models/StartupProfile.js';
import InvestorProfile from '../models/InvestorProfile.js';

export const createProfileForUser = async (userId, role, name) => {
  if (role === 'startup') {
    return await StartupProfile.create({ userId, companyName: name });
  } else if (role === 'student') {
    return await StudentProfile.create({ userId });
  } else if (role === 'investor') {
    return await InvestorProfile.create({ userId });
  }
  throw new Error("Invalid role provided for profile creation.");
};
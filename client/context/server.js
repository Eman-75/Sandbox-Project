import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

//Database connection
mongoose
.connect(process.env.MONGO_URL)
.then(() => console.log('Database connected successfully'))
.catch((err) => console.log('Database connection error:', err));



// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // These 3 lines ensure the .env file is found even in nested folders
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.resolve(__dirname, '.env') });

// const app = express();

// // Database connection
// // Make sure .env has MONGO_URL=mongodb... (no spaces!)
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log('✅ Database connected successfully'))
//   .catch((err) => console.log('❌ Database connection error:', err));

// // Port Listener (keeps the server alive)
// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
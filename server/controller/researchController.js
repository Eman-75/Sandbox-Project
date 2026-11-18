import ResearchIdeas from '../models/ResearchIdeas.js';
import OpenAI from 'openai';
import PDFParser from "pdf2json";
import cloudinary from '../lib/cloudinary.js';
import streamifier from 'streamifier';

// ✅ Groq setup (FREE)
const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const uploadPDF = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw", // 🔥 REQUIRED for PDF
                folder: "research_papers" // optional but good
            },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

export const uploadAndAnalyzeResearch = async (req, res) => {
    console.log("📄 --- New Upload Request ---");

    try {
        const { title, category, uploadedBy } = req.body;

        // ✅ Validate input
        if (!title || !category || !uploadedBy) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Please upload a PDF file." });
        }

        // ✅ Upload PDF to Cloudinary
        const uploadResult = await uploadPDF(req.file.buffer);

        const pdfUrl = uploadResult.secure_url;

        console.log("📄 PDF Uploaded:", pdfUrl);

        // ✅ Extract text from PDF
        const pdfParser = new PDFParser(null, 1);

        const extractedText = await new Promise((resolve, reject) => {
            pdfParser.on("pdfParser_dataError", err => reject(err.parserError));
            pdfParser.on("pdfParser_dataReady", () => {
                resolve(pdfParser.getRawTextContent());
            });
            pdfParser.parseBuffer(req.file.buffer);
        });

        if (!extractedText || extractedText.length < 100) {
            return res.status(400).json({ message: "PDF content too small or unreadable." });
        }

        const slicedText = extractedText.substring(0, 12000);

        // ✅ Prompt
        const prompt = `
Act as a Senior Research & Development Consultant for a platform called "SandBox". 

OBJECTIVE:
Your goal is NOT to summarize what this paper has already achieved. Instead, your goal is to extract UNFINISHED business, GAPS, and "FUTURE WORK" mentioned by the authors to create new project opportunities for Students, Startups, and Investors.

Analyze the research paper titled "${title}" in the category "${category}".

STRICT EXTRACTION RULES:
1. DO NOT extract ideas based on the "Results" or "Methodology" already completed in the paper.
2. FOCUS ONLY on the "Future Work," "Conclusion," "Limitations," or "Discussion" sections where the authors admit what they couldn't do.
3. Identify specific "missing links" (e.g., missing data, unoptimized algorithms, or lack of mobile deployment).

Return ONLY valid JSON in this format:
{
  "researchSummary": "A 2-sentence summary of what was ALREADY done (to provide context).",
  "actionableIdeas": [
    {
      "ideaTitle": "A catchy name for a NEW project building ON TOP of this research",
      "technicalRoadmap": "A step-by-step technical guide for a Student. Explain exactly which 'Future Work' point this solves and what tech to use (e.g., 'The paper missed X, so you should implement Y using Z').",
      "marketPotential": "A business case for Investors: Why is solving this 'Future Work' commercially valuable? Who is the target customer?",
      "techStack": ["Tool1", "Tool2", "Tool3"],
      "difficulty": "Beginner/Intermediate/Advanced"
    }
  ]
}

PAPER CONTENT TO ANALYZE:
${slicedText}
`;

        // ✅ Groq API call (FREE LLM)
        const completion = await openai.chat.completions.create({
            model: "qwen/qwen3.8-27b",
            messages: [
                { role: "system", content: "You are a strict JSON generator. Always return valid JSON only." },
                { role: "user", content: prompt }
            ],
            temperature: 0.3,
        });

        let text = completion.choices[0].message.content.trim();

        // ✅ Clean response
        text = text.replace(/```json|```/g, "").trim();

        // ✅ Safe JSON parse
        let aiData;
        try {
            aiData = JSON.parse(text);
        } catch (parseError) {
            console.error("❌ JSON Parse Failed");
            console.error("Raw AI Response:", text);

            return res.status(500).json({
                message: "AI returned invalid JSON format."
            });
        }

        // ✅ Save to DB
        const newResearch = new ResearchIdeas({
            title,
            category,
            pdfUrl: pdfUrl, // You can replace this with the actual URL if you want
            summary: aiData.researchSummary || "",
            extractedIdeas: aiData.actionableIdeas || [],
            uploadedBy
        });

        await newResearch.save();

        console.log("✅ Research saved successfully");

        return res.status(201).json({
            message: "Success!",
            data: newResearch
        });

    } catch (error) {
        console.error("❌ Upload Controller Error:");
        console.error(error);

        return res.status(500).json({
            message: "AI Processing Failed",
            error: error.message
        });
    }
};
require('dotenv').config();
const {GoogleGenAI} = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
async function run() {
    try {
        const response = await ai.models.list();
        // Just print the IDs that have 'flash' in them
        let flashModels = [];
        for await (const m of response) {
            if (m.name.includes("flash")) flashModels.push(m.name);
        }
        console.log("Flash models available:", flashModels.join(", "));
    } catch (e) {
        console.error("Listing models failed:", e);
    }
}
run();

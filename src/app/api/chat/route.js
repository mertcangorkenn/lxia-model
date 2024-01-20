import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

export async function POST(req) {
  const json = await req.json();

  let token = json.token;

  if (token === "null") {
    token = null;
  }

  if (!token && !process.env.API_KEY) {
    return Response.json({
      error: "No API key provided.",
    });
  }

  const genAI = new GoogleGenerativeAI(
    process.env.API_KEY
  );

  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  const prompt = "The assistant receives a tiled series of screenshots from a user's live video feed. These screenshots represent sequential frames from the video, capturing distinct moments. The assistant is to analyze these frames as a continuous video feed, answering user's questions while focusing on direct and specific interpretations of the visual content.";

  const stream = await model.generateContent(prompt);
  return new StreamingTextResponse(stream);
}

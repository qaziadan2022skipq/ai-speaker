import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, language } = body;
    console.log(prompt);

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API key is Invalid", { status: 500 });
    }
    if (!prompt) {
      return new NextResponse("Messages are required", { status: 400 });
    }
    if (!language) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `
                You are a powerful Stage Introducer.
                Task: Prepare a professional intro from the text
                Style: Descriptive
                Tone: Formal
                Audience: Business and professionals
                Format: Text
                language: ${language}
                `,
        },
        { role: "user", content: prompt },
      ],
    });
    
    console.log(response.choices[0].message);
    return NextResponse.json(response.choices[0].message, { status: 200 });
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

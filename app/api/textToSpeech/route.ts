import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// const speechFile = path.resolve("./speech.mp3");
export const maxDuration = 60;
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body)
    const { prompt, voice } = body;

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API key is Invalid", { status: 500 });
    }
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }
    if (!voice) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: prompt,
    });
    const buffer = Buffer.from(await response.arrayBuffer()).toString("base64");

    return NextResponse.json(buffer, { status: 200 });
  } catch (error) {
    console.log("[TEXT_TO_SPEECH_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

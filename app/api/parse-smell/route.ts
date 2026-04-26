import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

export async function POST(request: NextRequest) {
  const { description } = await request.json();

  if (!description || typeof description !== "string") {
    return NextResponse.json(
      { error: "No description provided" },
      { status: 400 },
    );
  }

  const prompt = `You are translating a smell description into the physical properties of a volume of air.

    Imagine the smell as a 3D space you could walk into. What does the air feel like? Is it thick or thin, warm or cold, still or moving, tight or expansive?

    Return ONLY a JSON object matching this exact schema. No explanation, no markdown, just the JSON:

    {   
    "warmth": <float 0.0–1.0, where 0 is icy cold and 1 is intensely warm>,
    "density": <float 0.0–1.0, where 0 is thin/airy and 1 is thick/heavy>,
    "speed": <float 0.0–1.0, where 0 is completely still and 1 is fast-moving>,
    "spread": <one of: "vertical", "horizontal", "diffuse">,
    "shape": {
        "base_radius": <float 0.5–3.0>,
        "top_radius": <float 0.5–3.0>,
        "height": <float 1.0–5.0>,
        "vertical_bias": <float 0.5–2.0>
    },
    "color_stops": [[r,g,b],[r,g,b],[r,g,b],[r,g,b]],
    "motion": {
        "base_stillness": <float 0.0–1.0>,
        "top_drift": <float 0.0–1.0>,
        "flow_intensity": <float 0.0–1.0>
        }
    }

    All RGB values are floats 0.0–1.0. Colour stops should reflect actual colour associations of the smell.

    Smell description: "${description}"`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0].message.content;
  const params = JSON.parse(raw!);

  return NextResponse.json(params);
}

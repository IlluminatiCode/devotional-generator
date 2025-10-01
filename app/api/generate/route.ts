import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import axios from "axios";
import { devotionalRequestSchema } from "@/lib/validation";
import { getRandomVerses } from "@/lib/bible-verses";
import type { GeminiAPIResponse } from "@/lib/types";
import { ZodError } from "zod";

/**
 * POST /api/generate
 * Generate a devotional based on theme, audience, and mood
 */
export async function POST(request: NextRequest) {
  console.log("Received request to /api/generate");

  try {
    // Parse and validate request body
    const body = await request.json();

    let validatedData;
    try {
      validatedData = devotionalRequestSchema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Validation error:", error.issues);
        return NextResponse.json(
          {
            error: "Invalid request data",
            details: error.issues.map((issue) => ({
              path: issue.path.join("."),
              message: issue.message,
            })),
          },
          { status: 400 }
        );
      }
      throw error;
    }

    const { selectedTheme, selectedAudience, selectedMood } = validatedData;

    // Get random Bible verses for the theme
    const selectedVerses = getRandomVerses(selectedTheme, 2);
    const verseText =
      selectedVerses.length > 0
        ? "\n\nScripture for reflection:\n" + selectedVerses.join("\n")
        : "";

    // Build the prompt
    let prompt = `Generate a short devotional (200-300 words) on the theme of "${selectedTheme}".`;

    if (selectedAudience) {
      prompt += ` It should be tailored for a "${selectedAudience}" audience.`;
    }
    if (selectedMood) {
      prompt += ` The devotional should also consider a mood of "${selectedMood}".`;
    }

    prompt += `${verseText}\n\nIt must include:\n1. A concise title (3-6 words) for the devotional.\n2. An introductory thought on the theme.\n3. The provided Bible verses (with chapter and verse numbers, e.g., John 3:16) in the Scripture section.\n4. A brief reflection or practical application of the theme from a biblical perspective, specifically referencing the provided verses.\n5. An actionable and engaging "Today's Challenge".\n6. A short concluding prayer.\nPlease format your response with clear headings for each section: "Concise Title (3-6 words):", "Introductory Thought:", "Scripture:", "Reflection:", "Prayer:", "Today's Challenge:". Do not use any Markdown formatting like bold (**), italics (*), or headings (###) within the content of each section.`;

    // Get API key from environment
    console.log("Attempting to get API key...");
    const apiKey = process.env['GEMINI_API_KEY'];

    if (!apiKey) {
      console.error("API key not configured on the server.");
      return NextResponse.json(
        { error: "API key not configured on the server." },
        { status: 500 }
      );
    }

    // Construct Gemini API URL
    console.log("API key found. Constructing API URL...");
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Prepare payload
    const geminiPayload = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    console.log("Making request to Gemini API...");
    console.log(
      "Payload being sent to Gemini API:",
      JSON.stringify(geminiPayload, null, 2)
    );

    // Make request to Gemini API
    const response = await axios.post<GeminiAPIResponse>(
      apiUrl,
      geminiPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    console.log("Received response from Gemini API.");

    // Return the response
    return NextResponse.json(response.data);
  } catch (error) {
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      console.error(
        "Error proxying to Gemini API:",
        error.response?.data || error.message
      );

      return NextResponse.json(
        {
          error: "Failed to fetch from Gemini API",
          details: error.response?.data || error.message,
        },
        { status: error.response?.status || 500 }
      );
    }

    // Handle other errors
    console.error("Unexpected error in /api/generate:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Explicitly disable other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST instead." },
    { status: 405 }
  );
}

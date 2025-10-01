import { z } from "zod";

// Zod schema for request validation
export const devotionalRequestSchema = z.object({
  selectedTheme: z.enum([
    "Patience",
    "Forgiveness",
    "Leadership",
    "Hope",
    "Love",
    "Faith",
    "Gratitude",
    "Courage",
    "Wisdom",
    "Joy",
    "Kindness",
    "Humility",
  ]),
  selectedAudience: z.string().optional(),
  selectedMood: z.string().optional(),
});

export type DevotionalRequestInput = z.infer<typeof devotionalRequestSchema>;

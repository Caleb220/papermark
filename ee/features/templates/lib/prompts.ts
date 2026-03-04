const DEFAULT_SYSTEM_PROMPT = `You are an expert at organizing data rooms for business due diligence, fundraising, and document management. Generate a well-structured data room folder hierarchy based on the user's description. Create clear, professional folder names. Use standard industry naming conventions. Keep the structure concise and practical.`;

const DEFAULT_USER_PROMPT_TEMPLATE = `Create a data room folder structure for the following use case:

{{DESCRIPTION}}

Generate an appropriate name for the data room and organize it into logical folders with optional subfolders.`;

export async function getDataroomSystemPrompt(): Promise<string> {
  return DEFAULT_SYSTEM_PROMPT;
}

export async function getDataroomUserPrompt(
  description: string,
): Promise<string> {
  return DEFAULT_USER_PROMPT_TEMPLATE.replace(
    "{{DESCRIPTION}}",
    description.trim(),
  );
}

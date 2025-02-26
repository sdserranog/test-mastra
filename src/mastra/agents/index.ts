import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { tools } from "../tools/github";

export const githubAgent = new Agent({
	name: "Github Agent",
	instructions: `
      You are a helpful assistant that can use Github tools.
`,
	model: openai("gpt-4o"),
	tools,
});

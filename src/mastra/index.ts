import { createLogger } from "@mastra/core/logger";
import { Mastra } from "@mastra/core/mastra";

import { githubAgent } from "./agents";

export const mastra = new Mastra({
	agents: { githubAgent },
	logger: createLogger({
		name: "Mastra",
		level: "info",
	}),
});

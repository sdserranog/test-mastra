import type { Arcade } from "@arcadeai/arcadejs";
import type { Tool, ToolExecutionContext } from "@mastra/core/tools";
import type { z } from "zod";

export type MastraTool = Tool<
	string,
	z.ZodSchema,
	z.ZodSchema,
	ToolExecutionContext<z.ZodSchema>
>;

export type InputParameters = Arcade.ToolDefinition["input"]["parameters"];

import { Arcade } from "@arcadeai/arcadejs";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import type { InputParameters, MastraTool } from "./types";

// Initialize the Arcade client
const client = new Arcade();

/**
 * Get all tools from a toolkit
 * @param toolkit - The name of the toolkit to get tools from
 *
 * @returns A record of MastraTools with the tool name as the key
 */
export const getMastraToolsFromToolkit = async (toolkit: string) => {
	const githubToolkit = await client.tools.list({
		toolkit,
	});

	return convertListOfToolsToMastraTools(githubToolkit);
};

/**
 * Get a MastraTool from an ArcadeTool
 * @param tool - The name of the tool to get
 *
 * @returns A MastraTool
 */
export const getMastraToolFromArcadeTool = async (tool: string) => {
	const githubToolkit = await client.tools.get(tool);

	return convertArcadeToolToMastraTool(githubToolkit);
};

/**
 * Convert a list of ArcadeTools to a record of MastraTools
 * @param tools - The list of ArcadeTools to convert
 *
 * @returns A record of MastraTools with the tool name as the key
 */
export const convertListOfToolsToMastraTools = async (
	tools: Arcade.ToolDefinitionsOffsetPage,
) => {
	return tools.items.reduce(
		(toolsObj: Record<string, MastraTool>, tool) => {
			const mastraTool = convertArcadeToolToMastraTool(tool);
			toolsObj[tool.name] = mastraTool;
			return toolsObj;
		},
		{} as Record<string, MastraTool>,
	);
};

export const convertArcadeToolToMastraTool = (
	tool: Arcade.ToolDefinition,
): MastraTool => {
	const toolId =
		(tool.fully_qualified_name as `${string}.${string}`) ??
		`${tool.name}.${tool.toolkit.name}@${tool.toolkit.version}`;

	return createTool({
		id: toolId,
		description: tool.description,
		inputSchema: convertParametersToZodSchema(
			tool.input.parameters as InputParameters,
		),
		execute: async ({ context }) => {
			// Authorize the tool
			const auth = await client.tools.authorize({
				tool_name: toolId,
				user_id: "mastra",
			});

			// Check if authorization is completed
			if (auth?.status !== "completed") {
				return {
					message: "You must authorize the tool to use it.",
					target: "blank",
					url: auth?.url,
				};
			}

			const result = await client.tools.execute({
				tool_name: toolId,
				input: {
					...context,
				},
				user_id: "mastra",
			});
			return result;
		},
	});
};

/**
 * Converts Arcade tool parameters to a Zod schema
 */
export const convertParametersToZodSchema = (
	parameters: InputParameters | undefined,
): z.ZodObject<Record<string, z.ZodTypeAny>> => {
	if (!parameters || !Array.isArray(parameters)) {
		return z.object({});
	}

	const schemaShape: Record<string, z.ZodTypeAny> = {};

	for (const param of parameters) {
		if (!param.name || !param.value_schema) continue;

		let zodType: z.ZodTypeAny;

		switch (param.value_schema.val_type) {
			case "string":
				zodType = z.string();
				break;
			case "number":
			case "integer":
				zodType = z.number();
				break;
			case "boolean":
				zodType = z.boolean();
				break;
			case "array":
				// Handle arrays based on inner_val_type
				switch (param.value_schema.inner_val_type) {
					case "string":
						zodType = z.array(z.string());
						break;
					case "number":
					case "integer":
						zodType = z.array(z.number());
						break;
					case "boolean":
						zodType = z.array(z.boolean());
						break;
					default:
						zodType = z.array(z.unknown());
				}
				break;
			case "object":
				zodType = z.record(z.string(), z.unknown());
				break;
			default:
				zodType = z.unknown();
		}

		// Add description if available
		if (param.description) {
			zodType = zodType.describe(param.description);
		}

		// Make optional if required is explicitly set to false or not provided
		if (param.required === false || param.required === undefined) {
			zodType = zodType.optional();
		}

		schemaShape[param.name] = zodType;
	}

	return z.object(schemaShape);
};

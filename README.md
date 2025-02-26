# Test Mastra

A GitHub agent powered by Mastra and Arcade that provides AI-assisted GitHub tools.

## Features

- GitHub agent powered by GPT-4o
- Access to GitHub tools through Arcade's toolkit

## Prerequisites

- Node.js (v18 or higher recommended)
- pnpm or npm
- OpenAI API key
- Arcade API access

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd test-mastra
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Create a `.env.development` file with your API keys:

```
OPENAI_API_KEY=your_openai_api_key
ARCADE_API_KEY=your_arcade_api_key
```

## Usage

Start the development server:

```bash
pnpm dev
# or
npm run dev
```

The Mastra server will start, and you can interact with the GitHub agent.

## Project Structure

- `src/mastra/agents/` - Contains the GitHub agent definition
- `src/mastra/tools/` - Contains utilities for integrating with Arcade tools
- `src/mastra/index.ts` - Main entry point for the Mastra application

## Technologies

- [Arcade](https://arcade.dev) - AI tool-calling platform that enables AI to securely perform actions on behalf of users
- [Mastra](https://mastra.ai/) - Agent framework
- [OpenAI](https://openai.com) - AI models (GPT-4o)

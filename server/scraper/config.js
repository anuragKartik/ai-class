// Everything the scraper searches for, per track.
// `match` is a regex a result title must satisfy so unrelated videos are dropped.

export const TRACKS = {
  ai: {
    id: 'ai',
    label: 'AI Engineer',
    tagline: 'LangChain, LangGraph, RAG, agents - the best free videos and the best things to read.',
    recencyWeight: 1.4, // AI tooling goes stale fast, so newer content ranks higher
    minVideoSeconds: 8 * 60,
    topics: [
      {
        id: 'langchain',
        label: 'LangChain',
        match: /lang\s?chain/i,
        queries: ['LangChain tutorial', 'LangChain full course python', 'LangChain crash course'],
      },
      {
        id: 'langgraph',
        label: 'LangGraph',
        match: /lang\s?graph/i,
        queries: ['LangGraph tutorial', 'LangGraph full course agents', 'LangGraph multi agent'],
      },
      {
        id: 'rag',
        label: 'RAG',
        match: /\brag\b|retrieval/i,
        queries: ['RAG from scratch tutorial', 'advanced RAG tutorial', 'build RAG app vector database'],
      },
      {
        id: 'agents',
        label: 'AI Agents',
        match: /agent/i,
        queries: ['build AI agents tutorial', 'agentic AI full course', 'CrewAI AutoGen multi agent tutorial'],
      },
      {
        id: 'mcp',
        label: 'MCP & Tools',
        match: /\bmcp\b|model context protocol|tool calling|function calling/i,
        queries: ['Model Context Protocol tutorial', 'MCP server build tutorial', 'LLM function calling tutorial'],
      },
      {
        id: 'llm-basics',
        label: 'LLM Fundamentals',
        match: /llm|large language model|gpt|transformer|prompt/i,
        queries: ['LLM fundamentals explained', 'Andrej Karpathy LLM', 'prompt engineering course'],
      },
      {
        id: 'evals',
        label: 'Evals & Observability',
        match: /eval|langsmith|observab|monitor|tracing|langfuse/i,
        queries: ['LLM evaluation tutorial', 'LangSmith tutorial', 'LLM observability langfuse'],
      },
      {
        id: 'deploy',
        label: 'Ship to Production',
        match: /deploy|production|fastapi|docker|scal/i,
        queries: ['deploy LangChain app production', 'LLM app production FastAPI', 'productionize AI agents'],
      },
    ],
    hnQueries: ['langgraph', 'langchain', 'building effective agents', 'RAG production', 'LLM agents'],
    hnMatch: /lang\s?(chain|graph)|agent|\brag\b|retrieval|llm|\bmcp\b|eval/i,
  },

  fde: {
    id: 'fde',
    label: 'Forward Deployed Engineer',
    tagline: 'What the FDE role really is, and how people who do it for a living prepare and get hired.',
    recencyWeight: 0.8,
    minVideoSeconds: 4 * 60,
    topics: [
      {
        id: 'what-is-fde',
        label: 'What is an FDE?',
        match: /forward[\s-]?deployed|\bfde\b/i,
        queries: ['what is a forward deployed engineer', 'forward deployed engineer explained', 'forward deployed engineer role'],
      },
      {
        id: 'day-in-life',
        label: 'Day in the Life',
        match: /forward[\s-]?deployed|\bfde\b/i,
        queries: ['day in the life forward deployed engineer', 'forward deployed engineer Palantir day in life', 'a week as a forward deployed engineer'],
      },
      {
        id: 'interview',
        label: 'Interview Prep',
        match: /forward[\s-]?deployed|\bfde\b|palantir/i,
        queries: ['forward deployed engineer interview', 'forward deployed engineer interview prep', 'Palantir forward deployed software engineer interview'],
      },
      {
        id: 'breaking-in',
        label: 'How to Become One',
        match: /forward[\s-]?deployed|\bfde\b/i,
        queries: ['how to become a forward deployed engineer', 'forward deployed engineer career path', 'software engineer to forward deployed engineer'],
      },
      {
        id: 'ai-fde',
        label: 'FDE in AI Companies',
        match: /forward[\s-]?deployed|\bfde\b/i,
        queries: ['forward deployed engineer AI OpenAI Anthropic', 'forward deployed engineer vs solutions engineer', 'why forward deployed engineers are in demand'],
      },
    ],
    hnQueries: ['forward deployed engineer', 'forward deployed engineers', 'Palantir forward deployed', 'forward deployed', 'FDE engineer'],
    hnMinPoints: 3,
    hnMatch: /forward[\s-]?deployed|\bfde\b|palantir/i,
  },
};

// Hand-picked reading material. The scraper validates every URL (dead links are dropped)
// and enriches each with a description pulled from the page itself.
// Add your own here - this is the easiest place to extend the site.

export const CURATED = {
  ai: {
    topics: {
      langchain: [
        { url: 'https://python.langchain.com/docs/introduction/', title: 'LangChain Docs - Introduction', kind: 'docs' },
        { url: 'https://academy.langchain.com/', title: 'LangChain Academy (free courses)', kind: 'course' },
      ],
      langgraph: [
        { url: 'https://langchain-ai.github.io/langgraph/', title: 'LangGraph Docs', kind: 'docs' },
        { url: 'https://langchain-ai.github.io/langgraph/tutorials/introduction/', title: 'LangGraph Basics Tutorial', kind: 'docs' },
        { url: 'https://github.com/langchain-ai/langgraph', title: 'LangGraph on GitHub (examples)', kind: 'repo' },
      ],
      rag: [
        { url: 'https://github.com/langchain-ai/rag-from-scratch', title: 'RAG From Scratch - notebooks', kind: 'repo' },
        { url: 'https://docs.llamaindex.ai/en/stable/', title: 'LlamaIndex Docs', kind: 'docs' },
        { url: 'https://huyenchip.com/2024/07/25/genai-platform.html', title: 'Building A Generative AI Platform - Chip Huyen', kind: 'blog' },
      ],
      agents: [
        { url: 'https://www.anthropic.com/engineering/building-effective-agents', title: 'Building Effective Agents - Anthropic', kind: 'blog' },
        { url: 'https://lilianweng.github.io/posts/2023-06-23-agent/', title: 'LLM Powered Autonomous Agents - Lilian Weng', kind: 'blog' },
        { url: 'https://huggingface.co/learn/agents-course/unit0/introduction', title: 'Hugging Face Agents Course (free)', kind: 'course' },
        { url: 'https://huyenchip.com/2025/01/07/agents.html', title: 'Agents - Chip Huyen', kind: 'blog' },
      ],
      mcp: [
        { url: 'https://modelcontextprotocol.io/introduction', title: 'Model Context Protocol - Introduction', kind: 'docs' },
        { url: 'https://github.com/modelcontextprotocol/servers', title: 'Reference MCP servers', kind: 'repo' },
      ],
      'llm-basics': [
        { url: 'https://karpathy.ai/zero-to-hero.html', title: 'Neural Networks: Zero to Hero - Andrej Karpathy', kind: 'course' },
        { url: 'https://www.deeplearning.ai/short-courses/', title: 'DeepLearning.AI Short Courses (free)', kind: 'course' },
        { url: 'https://platform.openai.com/docs/guides/prompt-engineering', title: 'Prompt Engineering Guide - OpenAI', kind: 'docs' },
        { url: 'https://eugeneyan.com/writing/llm-patterns/', title: 'Patterns for Building LLM-based Systems - Eugene Yan', kind: 'blog' },
      ],
      evals: [
        { url: 'https://docs.smith.langchain.com/', title: 'LangSmith Docs (tracing + evals)', kind: 'docs' },
        { url: 'https://hamel.dev/blog/posts/evals/', title: 'Your AI Product Needs Evals - Hamel Husain', kind: 'blog' },
        { url: 'https://eugeneyan.com/writing/evals/', title: 'Task-Specific LLM Evals - Eugene Yan', kind: 'blog' },
      ],
      deploy: [
        { url: 'https://langchain-ai.github.io/langgraph/concepts/persistence/', title: 'LangGraph Persistence (memory & checkpoints)', kind: 'docs' },
        { url: 'https://cookbook.openai.com/', title: 'OpenAI Cookbook', kind: 'docs' },
      ],
    },
    links: [
      { label: 'LangChain YouTube channel', url: 'https://www.youtube.com/@LangChain', where: 'YouTube' },
      { label: 'freeCodeCamp - AI courses', url: 'https://www.youtube.com/@freecodecamp/search?query=langchain', where: 'YouTube' },
      { label: 'Latent Space podcast + newsletter', url: 'https://www.latent.space/', where: 'Blog / Podcast' },
      { label: "Simon Willison's blog (LLMs)", url: 'https://simonwillison.net/tags/llms/', where: 'Blog' },
      { label: 'r/LangChain', url: 'https://www.reddit.com/r/LangChain/', where: 'Reddit' },
      { label: 'r/LocalLLaMA', url: 'https://www.reddit.com/r/LocalLLaMA/', where: 'Reddit' },
      { label: 'Instagram - #langchain', url: 'https://www.instagram.com/explore/tags/langchain/', where: 'Reels' },
      { label: 'Instagram - #aiagents', url: 'https://www.instagram.com/explore/tags/aiagents/', where: 'Reels' },
      { label: 'LinkedIn - LangGraph posts', url: 'https://www.linkedin.com/search/results/content/?keywords=langgraph', where: 'LinkedIn' },
      { label: 'X / Twitter - LangGraph', url: 'https://x.com/search?q=langgraph&f=top', where: 'X' },
    ],
  },

  fde: {
    topics: {
      // Blog posts for FDE are discovered automatically from Hacker News (see run.js);
      // only add a URL here once you have opened it yourself.
      interview: [
        { url: 'https://www.palantir.com/careers/', title: 'Palantir Careers (official) - Forward Deployed roles', kind: 'careers', skipCheck: true },
      ],
      'ai-fde': [
        { url: 'https://openai.com/careers/search/', title: 'OpenAI Careers - search "Forward Deployed"', kind: 'careers', skipCheck: true },
        { url: 'https://www.anthropic.com/careers', title: 'Anthropic Careers', kind: 'careers', skipCheck: true },
      ],
    },
    links: [
      { label: 'Reddit - "forward deployed engineer" threads', url: 'https://www.reddit.com/search/?q=forward%20deployed%20engineer&sort=top', where: 'Reddit' },
      { label: 'r/cscareerquestions - FDE', url: 'https://www.reddit.com/r/cscareerquestions/search/?q=forward%20deployed&restrict_sr=1&sort=top', where: 'Reddit' },
      { label: 'LinkedIn - FDE posts from practitioners', url: 'https://www.linkedin.com/search/results/content/?keywords=forward%20deployed%20engineer', where: 'LinkedIn' },
      { label: 'LinkedIn - open FDE jobs', url: 'https://www.linkedin.com/jobs/search/?keywords=forward%20deployed%20engineer', where: 'Jobs' },
      { label: 'Instagram - #forwarddeployedengineer', url: 'https://www.instagram.com/explore/tags/forwarddeployedengineer/', where: 'Reels' },
      { label: 'Instagram - #palantir', url: 'https://www.instagram.com/explore/tags/palantir/', where: 'Reels' },
      { label: 'YouTube - FDE search (sorted by views)', url: 'https://www.youtube.com/results?search_query=forward+deployed+engineer&sp=CAM%253D', where: 'YouTube' },
      { label: 'X / Twitter - FDE', url: 'https://x.com/search?q=forward%20deployed%20engineer&f=top', where: 'X' },
      { label: 'Palantir jobs board', url: 'https://jobs.lever.co/palantir', where: 'Jobs' },
    ],
  },
};

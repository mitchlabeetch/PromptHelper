# 🚀 PromptHelper (WhiteInputSyndrome)

> **Cure your creative block. Turn vague ideas into battle-ready AI execution plans.**

Welcome to **PromptHelper** — your friendly AI architect that helps you go from "I have a fuzzy idea" to "Here's exactly what to do, which tool to use, and how to prompt it." Whether you're brand new to AI tools or a seasoned developer looking to save time, we've got you covered.

---

## 🎯 What Is This?

PromptHelper is a **free, open-source web application** that:

1. **Takes your rough ideas** — even super vague ones like _"I want to build a cute page for my DIY blog but I don't know code"_
2. **Refines them through conversation** — asking smart questions to understand what you really need
3. **Selects the perfect AI tool** from a database of 68+ platforms (ChatGPT, Claude, Cursor, Bolt, v0, Gemini, and more)
4. **Generates an optimized prompt** — tailored to that specific tool
5. **Creates an actionable plan** — step-by-step guidance on how to execute

Think of it as having an experienced AI consultant who knows which tool is best for what, and how to get the most out of each one.

---

## 🌟 Who Is This For?

### For **AI Beginners**
If you're just starting your journey with AI tools and feeling overwhelmed by all the options, PromptHelper is your guide. We help you:

- **Discover which tool to use** for your specific project
- **Learn how to prompt effectively** without the trial-and-error frustration
- **Get pointed in the right direction** with clear, beginner-friendly plans

**Example Use Case:**
> _"I want to build a cute page for my DIY blog but I don't know code"_
>
> → We'll ask about your design preferences, skill level, and goals
>
> → Then recommend v0.dev or Bolt.new with a perfectly crafted prompt
>
> → Plus a step-by-step plan to get your site live

### For **Advanced Users**
If you're already experienced with AI but want to **save time** on prompt engineering for specific tasks, PromptHelper streamlines your workflow:

- **Get optimized prompts instantly** for specialized tasks
- **Leverage our tool knowledge** to pick the right platform for niche use cases
- **Speed up project setup** with pre-architected plans

**Example Use Case:**
> _"I need an optimized prompt for an LLM to audit and improve my current UI and routing"_
>
> → We'll analyze your tech stack and preferences
>
> → Recommend Claude with Code Projects or Cursor with specific settings
>
> → Deliver a sophisticated prompt covering UX patterns, accessibility, performance, and routing best practices

---

## ⚠️ Current Status: Early Days

**This app is brand new** and still evolving! 🚧

We're actively improving the tool selection logic, prompt templates, and overall user experience. You might encounter:

- Occasional quirks or unexpected behavior
- Rate limits during high traffic (see below)
- Features that could be smoother

**We warmly welcome your feedback, bug reports, and suggestions!** Open an issue or submit a PR — this is a community-driven project.

---

## 🎯 Our Main Challenge: Keeping It 100% Free

The biggest hurdle we face is **finding an AI API with the right balance of:**

- ✅ **Intelligence** — smart enough to understand complex, vague inputs and architect great plans
- ✅ **Free tier limits** — generous enough to serve everyone without hitting paywalls
- ✅ **Reliability** — stable and consistently available

Currently, we use:

- **Groq (Llama 3.3 70B)** as our primary engine — 30 requests/min, 14,400/day
- **Google Gemini (1.5 Flash)** as fallback — ~15 requests/min, 1,500/day

This lets us serve **30+ requests per minute globally**, but during peak times you might hit rate limits. We're exploring solutions like:

- User-provided API keys (but that might be too technical for beginners)
- Hybrid models with smarter request routing
- Sponsorships or grants to upgrade to paid tiers

**If you have ideas or connections that could help, reach out!** 💡

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ installed
- npm, yarn, pnpm, or bun

### Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/lightmyfireadmin/PromptHelper.git
   cd PromptHelper
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with your API keys:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Deploy to Production

The easiest way to deploy is via [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repo in Vercel
3. Add your environment variables
4. Deploy!

---

## 🛠️ How It Works

PromptHelper uses a **three-phase workflow**:

### 1. **Refining Phase** (Chat Interface)
- You describe your project in natural language
- Our AI asks clarifying questions to understand your:
  - Technical skill level
  - Project complexity
  - Specific requirements
  - Preferences (UI style, speed vs. quality, etc.)

### 2. **Selection Phase** (Tool Matching)
- Runs a sophisticated filtering algorithm ("Sniper Scope") over 68+ AI tools
- Scores each tool based on:
  - Your project requirements
  - Tool capabilities (reasoning, coding, speed, ease of use)
  - Cost and availability
- Presents the top 3 best matches with explanations

### 3. **Planning Phase** (Prompt Architecture)
- Generates a highly optimized prompt for your chosen tool
- Creates a step-by-step execution plan
- Includes best practices, pitfalls to avoid, and pro tips

All powered by state-of-the-art LLMs (Groq/Llama 3.3 70B + Gemini) and a curated database of tools and prompting strategies.

---

## 🔮 Future Improvements

We have exciting features on the roadmap:

### 🏗️ **GitHub Repository Integration**
- Upload or link your existing GitHub repo
- Get **context-aware prompt suggestions** based on your actual codebase
- Receive recommendations like:
  - _"Your React app could benefit from Cursor with this prompt to add TypeScript strict mode"_
  - _"Based on your API structure, here's an optimized prompt for Claude to add error handling"_

### 🧠 **Code-Based Tool Recommendations**
- Analyze your project's tech stack automatically
- Suggest tools and prompts that integrate seamlessly with your existing code
- Example: _"You're using Next.js + Tailwind → Try v0.dev with this prompt for a new dashboard component"_

### 📊 **Prompt Library & Community Templates**
- Browse successful prompts shared by other users
- Rate and save your favorite strategies
- Fork and customize templates for your needs

### 🎨 **Advanced Customization**
- Fine-tune selection criteria (prefer free tools, prioritize speed, etc.)
- Save your preferences for faster recommendations
- Multi-project mode for managing different workflows

### 🔗 **API Access**
- Integrate PromptHelper directly into your development tools
- Programmatic access to tool recommendations and prompt generation

**Want to help build these features?** Check our [issues page](https://github.com/lightmyfireadmin/PromptHelper/issues) or open a PR!

---

## 🤝 Contributing

We **LOVE** contributions! Here's how you can help:

### Ways to Contribute
- 🐛 **Report bugs** — Open an issue with reproduction steps
- 💡 **Suggest features** — Tell us what would make PromptHelper more useful
- 📝 **Improve documentation** — Fix typos, clarify instructions, add examples
- 🧑‍💻 **Submit code** — Fix bugs, add features, improve performance
- 🗄️ **Update the tool database** — Add new AI tools or update existing entries in `src/data/tools_database.json`
- 🎨 **Design improvements** — UI/UX suggestions are always welcome

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (run `npm run lint` and `npm run build`)
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request with a detailed description

---

## 📚 Documentation

- **[API.md](./API.md)** — Rate limits and API provider details
- **Tool Database** — See `src/data/tools_database.json` for the full list of supported AI tools
- **Best Practices** — See `src/data/best_practices.json` for our prompting strategies

---

## 🔒 Privacy & Security

- **No user data collection** — We don't store your prompts or conversations
- **No tracking** — No analytics, no cookies, no surveillance
- **IP-based rate limiting only** — Just to prevent abuse, cleared every 5 minutes
- **Open source** — Inspect our code anytime

---

## 📄 License

This project is open source. Please check the repository for license details.

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org) — React framework
- [Groq](https://groq.com) — Lightning-fast LLM inference (Llama 3.3 70B)
- [Google Gemini](https://ai.google.dev) — Multimodal AI fallback
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [shadcn/ui](https://ui.shadcn.com) — UI components
- [Zustand](https://github.com/pmndrs/zustand) — State management

---

## 💬 Get in Touch

- **Issues:** [GitHub Issues](https://github.com/lightmyfireadmin/PromptHelper/issues)
- **Discussions:** [GitHub Discussions](https://github.com/lightmyfireadmin/PromptHelper/discussions)

---

<div align="center">

**Made with ❤️ by the open source community**

[⭐ Star this repo](https://github.com/lightmyfireadmin/PromptHelper) if you find it helpful!

</div>

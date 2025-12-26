⚠️ **This Web App's development is currently on pause, potentially stopped.** It should be working and is free to be copied and adapted, but the work is currently halted as many flaws it presents are tackled way more efficiently by other tools at the moment. Thank you for your understanding 💝

# 🚀 PromptHelper (WhiteInputSyndrome)

> **Conquer your creative block. Turn vague ideas into battle-ready AI execution plans.**

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

## � Getting Started

### Prerequisites

- Node.js 20+ installed
- npm, yarn, pnpm, or bun

### Run Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/lightmyfireadmin/PromptHelper.git
   cd PromptHelper/my-prompt-architect
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with your API key:

   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

   Get a free API key at [openrouter.ai/keys](https://openrouter.ai/keys)

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
3. Add your `OPENROUTER_API_KEY` environment variable
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
- Presents the best match with clear explanations

### 3. **Planning Phase** (Prompt Architecture)

- Generates a highly optimized prompt for your chosen tool
- Creates a step-by-step execution plan
- Includes best practices, pitfalls to avoid, and pro tips

---

## 🧰 Tech Stack

| Category       | Technology                              |
| -------------- | --------------------------------------- |
| **Framework**  | Next.js 15 (App Router)                 |
| **Language**   | TypeScript                              |
| **Styling**    | Tailwind CSS v4 + Shadcn/UI             |
| **State**      | Zustand                                 |
| **AI Gateway** | OpenRouter (Llama 3.3 70B, DeepSeek R1) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/architect/          # API routes
│   │   ├── chat/               # Conversation handler
│   │   ├── select/             # Tool selection logic
│   │   └── plan/               # Plan generation
│   └── page.tsx                # Main wizard UI
├── components/
│   ├── landing/                # Landing page sections
│   ├── wizard/                 # Tool reveal & plan display
│   └── chat/                   # Chat interface
├── data/
│   ├── tools_database.json     # 68 AI tools catalog
│   └── best_practices.json     # Prompting strategies
├── lib/
│   └── api/openrouter.ts       # OpenRouter client
└── store/
    ├── wizard.ts               # Wizard state
    └── chat.ts                 # Chat state
```

---

## 🎯 Keeping It 100% Free

We use **OpenRouter** as our AI gateway, which provides access to top free-tier models:

- **Primary:** Llama 3.3 70B Instruct (free)
- **Fallback:** DeepSeek R1 (free)

This lets us serve requests without hitting paywalls. During peak times you might experience slight delays as models queue.

---

## 🔮 Future Improvements

We have exciting features on the roadmap:

- 🏗️ **GitHub Repository Integration** — context-aware suggestions based on your codebase
- 📊 **Prompt Library** — community templates you can fork and customize
- 🎨 **Advanced Customization** — fine-tune selection criteria and save preferences
- 🔗 **API Access** — integrate PromptHelper into your development tools

**Want to help build these features?** Check our [issues page](https://github.com/lightmyfireadmin/PromptHelper/issues)!

---

## 🤝 Contributing

We **LOVE** contributions! Here's how you can help:

- 🐛 **Report bugs** — Open an issue with reproduction steps
- 💡 **Suggest features** — Tell us what would make PromptHelper more useful
- 📝 **Improve documentation** — Fix typos, clarify instructions, add examples
- 🧑‍💻 **Submit code** — Fix bugs, add features, improve performance
- 🗄️ **Update the tool database** — Add new AI tools in `src/data/tools_database.json`

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and test (`npm run build`)
4. Commit with clear messages
5. Open a Pull Request

---

## � Privacy & Security

- **No user data collection** — We don't store your prompts or conversations
- **No tracking** — No analytics, no cookies, no surveillance
- **Open source** — Inspect our code anytime

---

## �📄 License

MIT — Free to use, modify, and distribute.

---

## 🙏 Acknowledgments

Built with:

- [Next.js](https://nextjs.org) — React framework
- [OpenRouter](https://openrouter.ai) — AI gateway (Llama 3.3, DeepSeek R1)
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [shadcn/ui](https://ui.shadcn.com) — UI components
- [Zustand](https://github.com/pmndrs/zustand) — State management

---

<div align="center">

**Made with ❤️ by the open source community**

[⭐ Star this repo](https://github.com/lightmyfireadmin/PromptHelper) if you find it helpful!

</div>

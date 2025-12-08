# 🚀 Prompt Architect (WhiteInputSyndrome)

**Your AI-Powered Prompt Engineering Companion**

Stop wrestling with generic chatbots. Prompt Architect analyzes your project ideas, selects the perfect AI tool from 68+ curated models, and generates battle-ready prompts tailored to your specific needs.

---

## ✨ Features

- **Smart Tool Selection** — We analyze your idea and match it with the best AI tool from our curated database
- **Copy-Paste Launch Plans** — Get detailed, step-by-step prompts optimized for your chosen tool
- **100% Free** — Powered by OpenRouter's free tier models (Llama 3.3, DeepSeek R1)
- **68+ AI Tools** — Covers text, code, image, video, audio, 3D, and data tasks

---

## 🛠️ Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/lightmyfireadmin/PromptHelper.git
cd my-prompt-architect
npm install
```

### 2. Configure API Key

Create a `.env.local` file:

```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Get a free API key at [openrouter.ai/keys](https://openrouter.ai/keys)

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start architecting!

---

## 🏗️ How It Works

1. **Describe Your Vision** — Tell us what you want to create
2. **Smart Questions** — Our AI clarifies your needs and constraints
3. **Tool Selection** — We pick the perfect AI tool for your project
4. **Launch Plan** — Get optimized, copy-paste prompts for each step

---

## 🧰 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4 + Shadcn/UI
- **State:** Zustand
- **AI:** OpenRouter (Llama 3.3 70B Instruct, DeepSeek R1)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/architect/     # API routes (chat, select, plan)
│   └── page.tsx           # Main wizard UI
├── components/
│   ├── landing/           # Landing page sections
│   ├── wizard/            # Tool reveal & plan display
│   └── chat/              # Chat interface
├── data/
│   ├── tools_database.json    # 68 AI tools catalog
│   └── best_practices.json    # Prompting strategies
└── lib/
    └── api/openrouter.ts      # API client
```

---

## 📄 License

MIT — Free to use, modify, and distribute.

---

Built with ❤️ for the AI builder community.

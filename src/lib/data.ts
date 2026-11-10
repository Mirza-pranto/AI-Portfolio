export const portfolioData = {
  name: "Mirza Julkawsar" ,
  title: "Software Engineer | AI/NLP/LLM Engineer" ,
  tagline: "Building end-to-end LLM and RAG systems and turning ideas into working products",
  avatar: "/profile.jpg",

  about: {
    summary: `I'm a CSE graduate from Brac University with a strong academic record (Highest Distinction) and leadership experience, specializing in NLP, LLM engineering, and full-stack development.  I am a passionate, quick learner who has led and built end-to-end LLM and RAG systems, encompassing fine-tuning, hybrid retrieval, and multi-agent orchestration. I also authored an undergraduate thesis on pragmatic inference in language models. 

I specialize in both building intelligent models—like fine-tuning Llama-3 with LoRA—and developing the backend infrastructures that support them. `,
    profileImage: "/profile.jpg",
  },

  projects: [
    {
      id: 'proj-1',
      title: 'AI Compliance Auditor',
      subtitle: 'Llama-3 LoRA + RAG Pipeline',
      description: 'An end‑to‑end strict compliance auditor combining a LoRA fine‑tuned Llama‑3‑8B with a hybrid search and reranking RAG pipeline.',
      longDescription: `
**Overview**
Regulatory compliance is critical. This project is an intelligent assistant that only answers questions explicitly grounded in company policies, rejecting prompt-injection attempts and out-of-context queries.

**Key Features**
- **Hybrid Retrieval:** Combines keyword (BM25) and semantic (sentence‑transformers) search.
- **Reranking:** Uses FlashRank to re‑order candidates, ensuring highest relevance.
- **Fine‑Tuned Llama‑3:** LoRA adapters train the model for strict compliance auditing.
- **Security:** Hard‑coded patterns and keyword‑overlap fallbacks prevent prompt injection.
- **UI:** Streamlit two-column interface showing answers alongside source chunks.

**Architecture & Hardware**
Optimized for Kaggle’s GPU environment (Tesla T4) with 16GB VRAM, exposed via Cloudflare Tunnels for instant demonstration.
      `,
      tags: ['Llama-3', 'Unsloth', 'LangChain', 'ChromaDB', 'Streamlit', 'FlashRank'],
      gradient: 'from-emerald-600 to-cyan-600',
      image: '',
      links: { github: 'https://github.com/Mirza-pranto/ai-compilence-auditor' },
    },
    {
      id: 'proj-2',
      title: 'Omni‑Support AI',
      subtitle: 'Intelligent IT Support Agent',
      description: 'An end‑to‑end IT support platform combining a Groq-powered AI agent with a full‑featured admin dashboard and MCP tool orchestration.',
      longDescription: `
**Overview**
Omni‑Support AI leverages Groq’s ultra‑fast LLMs, Supabase for data persistence, and a Model Context Protocol (MCP) server to orchestrate IT tools like ticket management and knowledge base search.

**Key Features**
- **Auth & Dashboards:** Supabase Auth for dual-role systems (Users vs. Agents) and session persistence.
- **Multi-Modal AI:** Vision-capable for analyzing screenshots, and Whisper for voice input.
- **Actionable Tools:** Multi-turn tool calling to search KBs, create tickets, or search the web.
- **Proactive KB Generation:** Automatically drafts knowledge base articles when tickets are resolved.
- **Hybrid Knowledge Base:** Vector + Full‑Text Search powered by pgvector.
      `,
      tags: ['Groq', 'MCP', 'Supabase (pgvector)', 'Streamlit', 'Whisper', 'FastMCP'],
      gradient: 'from-orange-600 to-red-600',
      image: '',
      links: { github: 'https://github.com/Mirza-pranto/mcp-portfolio-project' },
    },
    {
      id: 'proj-3',
      title: 'Autonomous Multi-Agent Research Workspace',
      subtitle: 'Stateful Workflow Orchestration',
      description: 'An agentic research platform that plans tasks, retrieves web sources, synthesizes reports, and verifies claims with human-in-the-loop review.',
      longDescription: `
**Overview**
Powered by LangGraph, FastAPI, and Streamlit, this multi-node system automates deep technical research while keeping humans in the loop for crucial retrieval approvals.

**Key Features**
- **Real-Time Streaming:** Live token streaming for draft generation.
- **Human-in-the-Loop:** Explicit review steps before web retrieval begins.
- **Stateful Orchestration:** Uses AsyncSqliteSaver for checkpointing and resume support.
- **Fact-Checking Guardrails:** Automated verification for generated claims.
- **Exporting:** Markdown and Word export for finished reports.
      `,
      tags: ['LangGraph', 'FastAPI', 'Streamlit', 'SQLite', 'Agentic AI'],
      gradient: 'from-violet-600 to-purple-600',
      image: '',
      links: { github: 'https://github.com/Mirza-pranto/Research-Agent' },
    },
    {
      id: 'proj-4',
      title: 'Enterprise Knowledge Engine',
      subtitle: 'Graph-RAG + Unsloth + LangGraph',
      description: 'A production-grade engine integrating Graph-RAG (Neo4j + ChromaDB) with local Llama-3 inference and LangGraph multi-agent routing.',
      longDescription: `
**Overview**
Designed for enterprise-scale knowledge retrieval, this system combines the relational power of Neo4j with the semantic search of ChromaDB.

**Key Features**
- **Hybrid Graph-RAG:** Fuses Entity/Relationship graphs (Neo4j) with Cosine vector search (ChromaDB).
- **Multi-Agent Orchestration:** LangGraph stateful cyclic graph featuring Router, Retriever, Generator, and Auditor nodes.
- **Local Inference:** Runs 4-bit Quantized Llama-3 8B via an Ollama Docker container for privacy.
- **Observability:** LangSmith integration for full execution trace and latency auditing.
      `,
      tags: ['Neo4j', 'ChromaDB', 'Ollama', 'Docker', 'Unsloth', 'FastAPI'],
      gradient: 'from-blue-600 to-indigo-600',
      image: '',
      links: { github: 'https://github.com/Mirza-pranto/enterprise-multi-agent-knowledge-engine' },
    },
    {
      id: 'proj-5',
      title: 'TravelBuddy',
      subtitle: 'Social Travel & Itinerary Platform',
      description: 'A social media platform built with the MERN stack to connect travel mates, share itineraries, and organize group tours.',
      longDescription: `
**Overview**
TravelBuddy is an interactive platform where users can post tour descriptions and itineraries to find travel partners. Users can request to join tours, and organizers can manage approvals seamlessly.

**Key Features**
- **Social Feed:** Post and read detailed tour descriptions and plans.
- **Request Management:** Interactive approval system for tour hosts.
- **State Routing & Async APIs:** Smooth SPA experience built entirely on React and Express.
- **Data Isolation:** Designed MongoDB schemas to safely isolate concurrent user accounts and interactions.
      `,
      tags: ['MongoDB', 'Express.js', 'React', 'Node.js', 'MERN'],
      gradient: 'from-pink-600 to-rose-600',
      image: '',
      links: { github: 'https://github.com/Mirza-pranto/TravelBuddy' },
    },
    {
      id: 'proj-6',
      title: 'Sarcasm Detection in News Headlines',
      subtitle: 'Transformers vs. Deep Learning',
      description: 'An NLP research project benchmarking traditional ML, Bi-LSTM, and BERT for detecting sarcasm in 26,709 news headlines.',
      longDescription: `
**Overview**
Sarcasm is notoriously difficult for NLP systems. This project evaluates models across a dataset of headlines from The Onion (sarcastic) and HuffPost (non-sarcastic) to quantify the value of sequence memory and multi-head attention.

**Key Features**
- **Three-Tier Approach:** Benchmarked Baseline ML (Random Forest, SVM), Deep Learning (Bi-LSTM), and Transformers (BERT).
- **Deep Pragmatic Consistency:** Proved that traditional ML recognizes superficial text properties, while Transformers capture the contrasting word alignments inherent to satire.
- **Results:** The fine-tuned bert-base-uncased model achieved the highest accuracy at 84.87% and an F1-Score of 0.8248.
      `,
      tags: ['Python', 'TensorFlow', 'BERT', 'Bi-LSTM', 'NLP', 'PyTorch'],
      gradient: 'from-amber-600 to-orange-600',
      image: '',
      links: { github: 'https://github.com/Mirza-pranto/Sarcasm-Detection-News-Headlines' },
    },
    {
      id: 'proj-7',
      title: 'Multi-Class Text Classification',
      subtitle: 'ML vs DL for QA Text',
      description: 'An evaluation of nine model configurations for multi-class classification on a balanced dataset of 93,333 QA pairs across ten categories.',
      longDescription: `
**Overview**
This project investigates the effectiveness of traditional ML models versus deep learning architectures for multi-class Question–Answer text classification, handling noisy raw text and HTML tags.

**Key Features**
- **Extensive Preprocessing:** Stripped HTML, normalized text, and generated numerical representations using TF–IDF and Skip-gram Word2Vec.
- **Model Benchmarking:** Evaluated Logistic Regression, DNNs, SimpleRNN, LSTM, GRU, and bidirectional variants.
- **Results:** Gated architectures significantly outperformed simpler models, with GRU achieving the highest accuracy (71.44%). Logistic Regression proved highly resilient as a strong linear baseline (67.70%) on sparse representations.
      `,
      tags: ['TF-IDF', 'Word2Vec', 'GRU', 'LSTM', 'Scikit-Learn', 'Keras'],
      gradient: 'from-teal-600 to-emerald-600',
      image: '',
      links: {},
    },
  ],

  skills: {
    "AI, ML & NLP": [
      "PyTorch", "TensorFlow", "Hugging Face Transformers", "BERT", "Word2Vec",
      "TF-IDF", "Graph Neural Networks (GraphSAGE)", "LSTM/BILSTM/GRU",
      "scikit-learn", "pandas", "NumPy"
    ],
    "LLM Engineering": [
      "LLM fine-tuning (SFT, PEFT, LORA, QLORA)", "Unsloth", "RAG (hybrid BM25 + dense)",
      "LangGraph", "LangChain", "Model Context Protocol (MCP)", "Ollama" 
    ],
    "Backend & Web": [
      "FastAPI", "Node.js", "Express.js", "React.js", "REST APIs", "Streamlit",
      "MERN stack", "asynchronous programming" 
    ],
    "Databases & Tools": [
      "MySQL", "PostgreSQL (Supabase, pgvector)", "MongoDB", "Neo4j", "ChromaDB",
      "Git/GitHub", "Docker", "Linux", "Kaggle"
    ],
    "Programming Languages": [
      "Python", "Java", "C", "JavaScript", "R", "PHP", "x86 Assembly" 
    ],
  },

  fun: {
    images: [
      { id: "2", src: "/fun-2-placeholder.svg", alt: "UI/UX design workshop" },
      { id: "3", src: "/fun-3-placeholder.svg", alt: "Hackathon night" },
    ],
    items: [
      {
        id: "2",
        title: "Hackathons & Rapid Prototyping",
        subtitle: "National AI Competitions & Mentorship",
        emoji: "🚀",
        gradient: "from-violet-600 to-purple-600",
        description:
          "Competing in high-intensity hackathons, turning 0-to-1 concepts into functional AI prototypes, and mentoring junior engineers.",
        longDescription: `Hackathons are where I push the limits of speed and creativity. Building under intense 24-48 hour constraints has honed my ability to rapidly architect systems from initial idea to working prototype.

Key Highlights:
• Fast Execution: Developed end-to-end working prototypes integrating LLMs, vector search, and web interfaces within hackathon timeframes.
• Mentorship & Coaching: Conducted workshops and mentored newer university students on API design, prompt engineering, and modern web frameworks.
• Problem Solving: Focused on high-impact problem spaces including automated compliance, healthcare record summarization, and civic tech.`,
        tags: ["Hackathons", "Rapid Prototyping", "Mentorship", "AI Engineering"],
        links: {
          github: "https://github.com/Mirza-pranto",
        },
      },
      {
        id: "3",
        title: "Creative Tech & UI/UX Craft",
        subtitle: "Design Systems & Human-AI Interactions",
        emoji: "💻",
        gradient: "from-amber-600 to-orange-600",
        description:
          "Bridging deep AI technical backends with delightful, intuitive human-AI interfaces and fluid animations.",
        longDescription: `I believe the greatest AI breakthroughs are only as powerful as their user interfaces. I love tinkering at the intersection of generative AI, design systems, and fluid frontend interactions.

Key Highlights:
• Design Systems: Exploring modern UI architectures with Tailwind CSS, Framer Motion, and Figma design tokens.
• Human-AI Interaction: Designing micro-feedback mechanisms (like neural streaming glows, typewriter cadences, and optimistic states) that make working with AI models intuitive and engaging.
• Continuous Craft: Constantly experimenting with modern web standards, SVG animations, and responsive layouts.`,
        tags: ["UI/UX", "Framer Motion", "Tailwind CSS", "Design Systems", "Product Design"],
        links: {
          github: "https://github.com/Mirza-pranto",
        },
      },
    ],
    description: `Outside of building models, I am deeply involved in the tech and maker community! I love participating in fast-paced hackathons, designing human-centered AI interfaces, and mentoring younger developers. I constantly experiment with modern web standards, design systems, and creative technology.`,
  },

  experience: [
    {
      id: 'exp-1',
      role: 'Director, Department of Arts and Design',
      company: 'ROBU, Robotics Club of Brac University',
      duration: 'September 2022 - Present',
      location: 'Dhaka, Bangladesh',
      details: 'Lead a team of 75 people responsible for UI/UX direction, visual communication and structured documentation for robotics and automation initiatives and organized robotics events. Coordinate with hardware, software and management teams to plan, organize and manage exhibitions and national hackathons, supporting event delivery for large audiences.',
      image: '/A&D.jpeg',
      logo: '/Robu.png',
      links: {
        website: 'https://bracurobu.com/',
        facebook: 'https://www.facebook.com/BRACU.Robotics.Club/',
        instagram: 'https://www.instagram.com/bracu_robu/?hl=en',
      },
    },
  ],

  contact: {
    status: "Open to opportunities",
    duration: "Available immediately",
    location: "Gulshan-1, Dhaka, Bangladesh",
    phone: "01701087047",
    email: "mirzapranto100@gmail.com",
    linkedin: "https://linkedin.com/in/mirza-julkawsar-264752273",
    github: "https://github.com/Mirza-pranto",
    techStack: ["Python", "PyTorch", "LangGraph", "React.js", "FastAPI"],
    whatIBring: `I bring a comprehensive blend of AI research and full-stack execution. From my thesis on modeling pragmatic implicature in LLMs using pragmatic thought-chains to architecting multi-agent systems and fine-tuning models under hardware constraints, I know how to navigate the entire AI lifecycle. Plus, my leadership experience means I know how to communicate vision and collaborate effectively across disciplines.`,
    goal: `I am looking for a software, AI/ML, or NLP engineer role where I can utilize my expertise in natural language processing and LLM engineering to turn ambitious ideas into robust, working products.`,
  },

  education: [
    {
      id: 'edu-1',
      institution: 'Brac University',
      degree: 'BSc in Computer Science and Engineering',
      duration: 'September 2022 - October 2026',
      location: 'Dhaka, Bangladesh',
      details: "CGPA: 3.84/4.00 | Graduated with Highest Distinction. Honors: Vice Chancellor's Honor List (6 times), Dean's Honor List (1 time).",
      image: '/bracu.png',
      logo: '/bracu.png',
    },
    {
      id: 'edu-2',
      institution: 'Govt. Azizul Haque College',
      degree: 'Higher Secondary Certificate (Pre-Engineering)',
      duration: '2019 - 2021',
      location: 'Bogura, Bangladesh',
      details: 'GPA 5.00/5.00',
      image: '/azizul.png',
      logo: '/azizul.png',
    },
    {
      id: 'edu-3',
      institution: 'Bogura Cantonment Public School and College',
      degree: 'Secondary School Certificate',
      duration: '2007 - 2019',
      location: 'Bogura, Bangladesh',
      details: 'PSC, JSC, SSC: GPA 5.00/5.00 across all 3 board examinations.',
      image: '/bcpsc.jpg',
      logo: '/bcpsc.jpg',
    },
  ],
};

// System prompt for the AI chat
export const systemPrompt = `You are Mirza Julkawsar's AI clone — an interactive portfolio assistant. You speak in first person as Mirza. You are friendly, knowledgeable, and enthusiastic. 

Here's everything about Mirza:

**Background:** ${portfolioData.about.summary}

**Education:**
${portfolioData.education.map((e) => `- ${e.institution}: ${e.degree} (${e.duration}), ${e.location}. ${e.details}`).join('\n')}

**Experience:**
${portfolioData.experience.map((e) => `- ${e.role} at ${e.company} (${e.duration}), ${e.location}. ${e.details}`).join('\n')}

**Projects:**
${portfolioData.projects.map((p) => `- ${p.title} (${p.subtitle}): ${p.description}. Tech: ${p.tags.join(', ')}`).join('\n')}

**Skills:**
${Object.entries(portfolioData.skills).map(([cat, skills]) => `- ${cat}: ${skills.join(', ')}`).join('\n')}

**Fun Facts & Leadership:** ${portfolioData.fun.description}

**Contact:** Email: ${portfolioData.contact.email}, LinkedIn: ${portfolioData.contact.linkedin}, GitHub: ${portfolioData.contact.github}
Location: ${portfolioData.contact.location}
What I bring: ${portfolioData.contact.whatIBring}
Goal: ${portfolioData.contact.goal}

Rules:
- Always respond as Mirza in first person
- Be conversational and enthusiastic
- Keep responses concise but informative (2-4 paragraphs max)
- If asked about something not in your data, be honest and redirect to relevant info
- Use emoji sparingly but naturally
- When asked about availability, mention you're open to opportunities`;
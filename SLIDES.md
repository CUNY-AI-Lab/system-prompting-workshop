# Composing System Prompts - Slide Deck Content

> CUNY AI Lab Sandbox Workshop
> Source: `index.html`

---

## Slide 1 - Title

**Composing System Prompts**
A Workshop for the CUNY AI Lab Sandbox
March 16, 2026

---

## Slide 2 - Workshop Roadmap

**Three Weeks, Three Skills**

| Date | Session | Description |
|------|---------|-------------|
| March 16 - This Week | Composing System Prompts | Define how the AI thinks, responds, and engages with your students |
| March 23 | Curating Knowledge Collections | Upload syllabi, readings, and relevant sources to ground AI models in course materials |
| March 30 | Customizing Skills & Tools | Build specialized skills, tools, and workflows tailored to your courses |

---

## Slide 3 - What Is a System Prompt?

**The Basics**

A **system prompt** is a set of instructions you write *before* a conversation begins. The user never sees it, but it shapes every response the AI gives.

> Think of it as the **setup instructions** for a specialized tool: what task it handles, how it should operate, what guardrails to follow, and what's out of scope.

**Key distinction:** The *user prompt* is what someone types in the chat. The *system prompt* is what you, the instructor, compose behind the scenes to guide the AI's behavior across the entire conversation.

---

## Slide 4 - Where It Lives (Open WebUI)

In the CUNY AI Lab Sandbox, you'll find the system prompt field in two places:

1. **Chat-Level System Prompt** - Click the settings gear at the top of any new conversation to set a prompt for that session.
2. **Model Configuration** - Go to Workspace → Models to create a custom model with a permanent system prompt baked in.

**Note:** Custom models combine your system prompt with knowledge collections to ground the AI, situating learning and enabling instructional reuse. We'll come back to this next time.

---

## Slide 5 - Same Tool, Different Pedagogy

You're building a revision support tool for your composition course. A student opens it and types: **"I'm stuck on my introduction."**

**Without System Prompt** *(appears first)*
"Here's a strong introduction you could use: 'Throughout history, the question of racial identity has been central to American culture. In this essay, I will argue that...'"
*Writes the introduction for them. The student learns nothing.*

**With System Prompt** *(revealed on next advance)*
"Let's work through this. What's the main argument you want your reader to encounter first? Try telling me in one sentence what your paper is really about. Don't worry about making it perfect yet."
*Prompts the student to think. The writing stays theirs.*

---

## Slide 6 - Models in the CUNY AI Lab Sandbox

All open-weight models. No data retained on external servers. Each has different constraints and affordances.

| Model | Description |
|-------|-------------|
| DeepSeek V3.2 | Large mixture-of-experts model; strong at extended reasoning |
| Kimi K2.5 | Multimodal model; processes images and long documents |
| GLM 5 | Chain-of-thought reasoning; works through problems step by step |
| gpt-oss-120b | Large-scale open model; consistent structured outputs |
| Qwen3 235B | Large mixture-of-experts model; strong multilingual support |
| Gemma 3 27B | Compact, low-latency model; fast responses for everyday tasks |
| Llama 3.1 70B | Mid-size general-purpose model; reliable across a range of tasks |

---

## Slide 7 - Section Divider

**Part I: Drafting an Effective System Prompt**

---

## Slide 8 - Composition: The Vague Prompt

**Weak:** `Help students write better.`

**What goes wrong?**
- No role assignment to contextualize the model for specific workflows or domain-knowledge
- No boundaries or pedagogical guidance to constrain the model from doing work for students
- No success criteria for the model to optimize toward

---

## Slide 9 - Composition: Getting Warmer

**Getting There:** `You are a writing scaffold for a college composition course. Help students develop their essays by breaking revision into structured steps. Ask them to identify their thesis before giving feedback. Don't write essays for them.`

**What improved?**
- Assigns a role and disciplinary context
- Includes a basic pedagogical move
- Sets one boundary

**What's still missing?**
- No procedural instructions for *how* to give feedback
- No awareness of student population or course level
- No edge-case handling

---

## Slide 10 - Composition: A Prompt That Fosters Revision

```
You are a writing scaffold for an English 101 composition course at a public urban university. Students are multilingual, first-generation, and balancing work alongside coursework.

The core problem: students treat revision as proofreading—fixing grammar and word choice—rather than rethinking argument, structure, and evidence. They lack a process for examining whether their ideas are clear, well-organized, and sufficiently supported. This tool scaffolds the move from surface-level fixes to substantive revision.

Procedure:
1. Request the assignment prompt and student draft before responding.
2. Identify the highest-priority concerns (thesis clarity, structure, evidence) before surface-level issues.
3. For each concern, ask the student a question rather than providing a fix.

Constraints:
- Never generate text that could substitute for the student's own writing. Focus on higher-order concerns like argument, structure, and evidence.
- If asked to "just fix it," redirect toward a specific revision step.
- Do not grade or evaluate.
- Tone: Warm and direct. Use "I notice..." and "What if you tried..." Language accessible to multilingual and first-generation students.
```

---

## Slide 11 - Section Divider

**Example 2: Primary Source Analysis**

---

## Slide 12 - History: The Vague Prompt

**Weak:** `Analyze historical documents.`

**What goes wrong?**
- No methodological framework
- No period or geographic focus
- No guidance on handling hallucinated facts or invented sources

---

## Slide 13 - History: Getting Warmer

**Getting There:** `You are a history source-analysis tool. Help students analyze primary sources from American history. Ask them to consider the author, audience, and context of each document. Don't just summarize the document for them.`

**What improved?**
- Assigns a role and disciplinary scope
- References a real methodology
- Sets a boundary against summarization

**What's still missing?**
- No procedural steps for guiding analysis
- No handling of uncertainty or AI limitations
- No attention to historiographical perspective

---

## Slide 14 - History: A Prompt That Fosters Historical Thinking

```
You are a source-analysis tool for an undergraduate U.S. history survey.

The core problem: students extract facts from sources rather than analyzing them as constructed arguments shaped by author, audience, and context.

Procedure:
1. Ask the student to identify the source (title, date, creator, document type). Ensure you both have the same text in front of you before proceeding.
2. Introduce the SOAPS framework: you'll guide them through five questions, one at a time, to build a complete analysis.
3. Ask one SOAPS question and wait for the student's response before moving to the next. Never jump ahead.
4. When the student answers, follow up by asking why that detail matters—push them to connect their observation to what the source reveals about its moment.
5. Encourage the student to ground each answer in specific phrases or passages from the text.
6. After completing all five questions, ask the student to synthesize: What does the full picture of Speaker, Occasion, Audience, Purpose, and Significance tell us about this historical moment?

SOAPS Framework Questions:
- Speaker: Who created this and what do we know about them?
- Occasion: What events prompted it?
- Audience: Who was it for and how does that shape the content?
- Purpose: What was the author trying to achieve?
- Significance: What does it reveal about its moment?

Constraints:
- Let the student attempt each answer before offering guidance.
- Encourage grounding interpretations in specific passages as analysis develops.
- If unsure about a historical fact, say so. Never invent dates, names, or events.
- Do not provide a complete analysis. Model the questions historians ask.
- Tone: Patient and curious. Demonstrate genuine interest in the student's thinking without being condescending.
```

---

## Slide 15 - Section Divider

**Example 3: Close Reading & Literary Analysis**

---

## Slide 16 - Literature: The Vague Prompt

**Weak:** `Help with literary analysis.`

**What goes wrong?**
- Defaults to plot summary
- No theoretical or critical framework
- No requirement for textual evidence

---

## Slide 17 - Literature: Getting Warmer

**Getting There:** `You are a close-reading scaffold. Help students analyze literary texts by focusing on themes, symbolism, and narrative techniques. Don't just summarize the plot. Ask students to point to specific passages.`

**What improved?**
- Names specific analytical categories
- Addresses the plot-summary problem
- Requires textual evidence

**What's still missing?**
- No procedural steps for scaffolding analysis
- No critical or theoretical framework
- No attention to cultural context

---

## Slide 18 - Literature: A Prompt That Fosters Close Reading

```
You are a close-reading tool for an undergraduate literature and cultural studies course.

The core problem: students summarize plot rather than analyzing how language, form, and perspective shape meaning.

Procedure:
1. Ask what the student notices about the language in their chosen passage.
2. Prompt them to examine specific textual features (word choice, imagery, syntax, point of view) and how they create meaning.
3. Ask how the passage connects to the work's larger themes and cultural moment.
4. Guide them toward an interpretive claim grounded in textual evidence.

Critical framework:
- Who is speaking? Who is silenced? What power structures are visible?
- Treat texts as cultural artifacts, not just aesthetic objects.

Constraints:
- Facilitate multiple interpretations grounded in textual evidence rather than prescribing a correct reading.
- Redirect plot summary toward analysis: "What stood out to you about how the author crafted this?"
- Encourage grounding claims in textual evidence as analysis develops.
- Tone: Encouraging and accessible. Affirm the student's observations while pushing deeper into textual detail and cultural context.
```

---

## Slide 19 - Section Divider

**Part II: The Building Blocks**

---

## Slide 20 - Five Things Every System Prompt Needs

1. **Role & Persona** - What is the tool? A writing scaffold, a source-analysis instrument, a research tool, a debate simulator?
2. **Scope & Boundaries** - What should it do and what should it refuse to do? Topic limits, ethical guardrails.
3. **Pedagogical Approach** - How should it guide? Scaffolding, structured steps, modeling, direct instruction?
4. **Tone & Audience** - Register, formality, warmth. Are students multilingual? First-gen? Graduate-level?
5. **Output Format** - Bullet points or prose? Citation style? Response length? Structured templates?

---

## Slide 21 - Building Block 1: Role & Persona

The first sentence of your system prompt is the most important. It tells the AI *what it does* and immediately shapes everything that follows.

- **Writing Scaffold:** "You are a writing scaffold that guides through structured steps, never writes for students."
- **Research Tool:** "You are a research tool that helps locate, organize, and evaluate secondary sources."
- **Argumentation Tool:** "You are an argumentation tool that challenges the student's claims with counterarguments and asks them to defend their position."

---

## Slide 22 - Building Block 2: Scope & Boundaries

Boundaries aren't about restricting the AI. They're about protecting the learning process.

- **Topic scope** - "Only discuss texts assigned in this course"
- **What not to produce** - "Never write full paragraphs for the student"
- **Academic integrity** - "If the student asks you to write their assignment, redirect them"
- **Epistemic honesty** - "If you're unsure about a fact, say so"

---

## Slide 23 - Building Block 3: Pedagogical Approach

This is where disciplinary expertise shapes the system prompt. You're encoding specific pedagogical strategies into the tool's behavior.

- **Question-Driven Guidance** - "When a student makes a claim, respond with a question that pushes them to examine their reasoning."
- **Scaffolding** - "Break complex tasks into smaller steps. Only move to the next step when the student has completed the current one."
- **Modeling** - "Show one example of how to analyze a passage, then ask the student to try the same approach with a different passage."
- **Metacognitive Thinking** - "Periodically ask: 'What strategy are you using here?' or 'How did you decide to approach it this way?'"

---

## Slide 24 - Building Block 4: Tone & Audience

**Cold & Clinical:** "Your thesis is weak and lacks specificity. Revise it."

**Warm & Constructive:** "I can see what you're going for here. What if you narrowed your focus to make it more specific?"

---

## Slide 25 - Building Block 5: Output Format

**Structured Feedback Template:**
```
Strength: [one thing the student did well]
Focus area: [one thing to improve]
Next step: [a specific, actionable suggestion]
Question: [something for the student to think about]
```

---

## Slide 26 - Section Divider

**Part III: Advanced Strategies & Tips**

---

## Slide 27 - Advanced Prompting Strategies

- **Conditional Behavior** - "If the student submits a draft, give feedback. If they ask a conceptual question, respond with a guiding question. If they seem frustrated, acknowledge it before continuing."
- **Procedural Instructions** - "Step 1: Request the assignment prompt and draft. Step 2: Identify one focus area. Step 3: Ask the student a question about that area before offering guidance."
- **Epistemic Guardrails** - "If you are not certain about a factual claim, explicitly state your uncertainty. Never fabricate citations or attribute quotes."
- **Multilingual Support** - "If a student writes in a language other than English, respond in that language. Offer to discuss concepts in both languages to support comprehension."

---

## Slide 28 - Common Pitfalls

- **Too Long & Too Detailed** - A 2,000-word system prompt can confuse the model. Prioritize the most important instructions.
- **Contradictory Instructions** - "Always give detailed feedback" + "Keep responses under 50 words" = confused AI.
- **Forgetting the Student's Perspective** - Test by asking the kinds of questions your students actually ask.
- **Set It and Forget It** - System prompts need iteration. Use them, notice what breaks, revise.

---

## Slide 29 - The Road Ahead

| Date | Session | Description |
|------|---------|-------------|
| March 16 - Today | System Prompts ✓ | Defining how the AI thinks and teaches |
| March 23 - Next Week | Knowledge Collections | Upload your syllabus, readings, and relevant sources to ground AI models in course materials |
| March 30 | Skills & Tools | Build custom skills, tools, and workflows tailored to your courses |

---

## Slide 30 - Closing

**Let's Build One Together**
Open the CUNY AI Lab Sandbox and compose a system prompt for your course

1. Pick one assignment from your course
2. Write a system prompt using the five building blocks
3. Test it with a real student question
4. Iterate and refine

ailab.gc.cuny.edu

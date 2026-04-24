# AI Math Tutor

Final project for **ESE 5430 Human Systems Engineering**.

## Project Description

AI Math Tutor is a web-based prototype that explores how an AI tutoring interface can guide students toward more structured and learning-oriented math support. Instead of asking users to write an open-ended prompt, the interface organizes the tutoring interaction into a sequence of clear steps: add a math problem, start the tutor support process, choose a help type, and review guided tutor feedback.

The prototype is designed around the idea that students often need different kinds of help at different moments. Some students may not understand the problem statement, some may need to review the relevant concept, some may want help continuing their own work, and others may need to locate a mistake. The interface therefore separates AI support into six help types:

- Understand the problem
- Review relevant knowledge
- Continue my work
- Try another question
- Reveal the answer in stages
- Find my mistake

This structure is intended to make AI support easier to understand, easier to control, and more aligned with learning than a single general chat box.

## Interaction Flow

The prototype follows a four-step workflow:

1. **Add problem**: The user enters or confirms the math problem.
2. **Start**: The system reviews the problem structure and prepares the support options.
3. **Choose help type**: The user selects the type of tutoring support that best matches their current learning need.
4. **Guided help**: The system shows tutor guidance based on the selected help type.

The current demo uses a sample calculus problem involving rational function integration and partial fractions. Math expressions are rendered with KaTeX so that equations appear in readable mathematical notation.

## Human Systems Engineering Focus

This project applies human systems engineering concepts to the design of an AI learning tool. The main design concern is not only whether the system can provide math help, but whether users can understand the interaction structure, form an accurate mental model of what the system is doing, and choose the type of support that fits their goal.

The interface emphasizes:

- Visibility of the current workflow stage
- Clear action labels and step-by-step progression
- Recognition-based help choices instead of prompt-writing from memory
- User control through back, change-help-type, and start-over options
- Learning-oriented support such as hints, staged answers, mistake review, and practice questions

## Prototype Scope

This is a frontend-only prototype. It demonstrates the intended interaction design and tutoring workflow, but it does not connect to a live AI model, backend server, or database. Tutor responses are prewritten demo content used to support usability evaluation and design discussion.

## Technology

- React
- Vite
- Tailwind CSS
- Framer Motion
- KaTeX
- Lucide React icons

## Project Files

- `src/App.jsx`: Main prototype interface and tutoring flow
- `src/main.jsx`: React entry point
- `src/index.css`: Tailwind styles
- `docs/`: Static GitHub Pages build output
- `index.html`: App shell

## Running Locally

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```

To rebuild the GitHub Pages version in `docs/`:

```bash
npm run deploy-build
```

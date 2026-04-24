import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Brain,
  BookOpen,
  Lightbulb,
  PencilLine,
  CheckCircle2,
  FileText,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  User,
  Bot,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import "katex/dist/katex.min.css";
import renderMathInElement from "katex/dist/contrib/auto-render";

// --- Utility ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * A component that automatically renders any LaTeX math found within its children.
 * Supports inline math with $...$ and block math with $$...$$.
 */
function MathText({ children, className, as: Component = "div" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && children) {
      renderMathInElement(containerRef.current, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
        ],
        throwOnError: false,
      });
    }
  }, [children]);

  return (
    <Component ref={containerRef} className={className}>
      {children}
    </Component>
  );
}

// --- Chat UI Components ---

const ChatMessage = ({ role, children }) => {
  const isAssistant = role === "assistant";
  const label = isAssistant ? "Tutor support" : "Student note";
  return (
    <div className={cn("flex w-full gap-3 mb-6", isAssistant ? "justify-start" : "justify-end")}>
      {isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-white">
          <Bot className="h-5 w-5" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl p-4 shadow-sm",
          isAssistant
            ? "bg-white border border-neutral-100 text-neutral-800"
            : "bg-neutral-900 text-white"
        )}
      >
        <div className="text-[10px] uppercase tracking-wider font-bold mb-1 opacity-50">
          {label}
        </div>
        <MathText className="text-sm md:text-[15px] leading-relaxed">
          {children}
        </MathText>
      </div>
      {!isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  );
};

const ImageUploadBox = () => (
  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 transition hover:bg-neutral-100">
    <Upload className="h-4 w-4" />
    Upload photo of work
    <input className="hidden" type="file" accept="image/*" />
  </label>
);

const MathPreviewInput = ({ value, onChange, placeholder, label = "Your work", helper }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">{label}</label>
        <div className="text-[10px] text-neutral-400">Supports LaTeX (e.g. $x^2$)</div>
      </div>
      {helper && <p className="text-xs text-neutral-500">{helper}</p>}
      <div className="relative group">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[120px] rounded-2xl bg-neutral-50/50 border-neutral-200 focus:bg-white transition-all font-mono text-[14px]"
        />
      </div>
      <ImageUploadBox />
      {value.trim() && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Math preview</div>
          <MathText className="p-4 rounded-2xl border bg-blue-50/30 border-blue-100 text-neutral-800 min-h-[40px]">
            {value}
          </MathText>
        </div>
      )}
    </div>
  );
};

// --- Simplified UI Components ---
const Card = ({ className, ...props }) => (
  <div className={cn("rounded-xl border bg-white text-neutral-950 shadow", className)} {...props} />
);
const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);
const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("font-semibold leading-none tracking-tight text-xl", className)} {...props} />
);
const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

const Button = ({ className, variant = "default", ...props }) => {
  const variants = {
    default: "bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 shadow-sm",
    secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80",
    ghost: "hover:bg-neutral-100 hover:text-neutral-900",
    outline: "border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

const Badge = ({ className, variant = "default", ...props }) => {
  const variants = {
    default: "border-transparent bg-neutral-900 text-neutral-50",
    secondary: "border-transparent bg-neutral-100 text-neutral-900",
    outline: "text-neutral-950",
  };
  return (
    <div className={cn("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2", variants[variant], className)} {...props} />
  );
};

const Progress = ({ value, className }) => (
  <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-neutral-100", className)}>
    <div
      className="h-full w-full flex-1 bg-neutral-900 transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
);

const Textarea = ({ className, ...props }) => (
  <textarea
    className={cn(
      "flex min-h-[60px] w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
);

const Input = ({ className, ...props }) => (
  <input
    className={cn(
      "flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
);

const shortcutOptions = [
  { id: "understand", title: "Understand the problem", description: "Use this when the wording, notation, or goal of the problem feels unclear.", icon: BookOpen, color: "bg-blue-50 border-blue-200" },
  { id: "knowledge", title: "Review relevant knowledge", description: "Use this to view the concepts and methods most relevant to this problem.", icon: Brain, color: "bg-violet-50 border-violet-200" },
  { id: "work", title: "Continue my work", description: "Use this when you have started and want help with the next step.", icon: Lightbulb, color: "bg-amber-50 border-amber-200" },
  { id: "practice", title: "Try another question", description: "Use this to get a related practice question.", icon: PencilLine, color: "bg-emerald-50 border-emerald-200" },
  { id: "answer", title: "Reveal the answer in stages", description: "Use this when you want a hint, an outline, worked steps, or the final answer.", icon: FileText, color: "bg-slate-50 border-slate-200" },
  { id: "wrong", title: "Find my mistake", description: "Use this when you know your answer is wrong and want help finding where your work first went off track.", icon: CheckCircle2, color: "bg-cyan-50 border-cyan-200" },
];

const sampleProblem = "Evaluate $\\int \\frac{x^2+2x+3}{x(x+1)} \\, dx$.";
const practiceProblem = "Evaluate $\\int \\frac{x+5}{x(x+2)} \\, dx$.";
const practiceSolution = "Solution:\n$$\\frac{x+5}{x(x+2)}=\\frac{A}{x}+\\frac{B}{x+2}$$\nClear denominators:\n$$x+5=A(x+2)+Bx$$\nMatch coefficients:\n$$A+B=1,\\quad 2A=5$$\nSo:\n$$A=\\frac{5}{2},\\quad B=-\\frac{3}{2}$$\nIntegrate term by term:\n$$\\int \\frac{x+5}{x(x+2)}\\,dx=\\frac{5}{2}\\ln|x|-\\frac{3}{2}\\ln|x+2|+C$$";

const sampleAnalysis = {
  topic: "Integration",
  subtopic: "Partial Fraction",
  grade: "Calculus",
  concepts: [
    "Degree comparison",
    "Polynomial division",
    "Partial fraction decomposition",
    "Coefficient matching",
    "$\\int \\frac{1}{x} \\, dx = \\ln|x| + C$",
    "Algebraic simplification",
  ],
  keyStep: "Compare degrees, rewrite as a polynomial plus a proper fraction, decompose the proper fraction, integrate term by term, then simplify.",
};

function StepPill({ index, label, active, done }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
          active ? "bg-black text-white" : done ? "bg-neutral-200 text-neutral-800" : "bg-neutral-100 text-neutral-400"
        )}
      >
        {index}
      </div>
      <span className={cn("text-sm", active ? "text-black" : "text-neutral-500")}>{label}</span>
    </div>
  );
}

function Header() {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-neutral-600">
          <Sparkles className="h-3.5 w-3.5" />
          Structured math support
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">AI Math Tutor</h1>
        <p className="mt-2 max-w-3xl text-sm text-neutral-600 md:text-base">
          Add a problem, choose the help you need, and work through the next step.
        </p>
      </div>
    </div>
  );
}

function UploadStage({ onNext, problemText, setProblemText }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle>1. Add the math problem</CardTitle>
          <p className="text-sm text-neutral-500">
            Paste the exact problem you want help with.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 p-6 text-center">
            <Upload className="mx-auto mb-3 h-8 w-8 text-neutral-500" />
            <p className="text-sm font-medium">Paste the problem below</p>
            <p className="mt-1 text-xs text-neutral-500">Use LaTeX if you want math formatting.</p>
            <Button className="mt-4 rounded-2xl" variant="secondary" onClick={() => setProblemText(sampleProblem)}>
              Fill problem
            </Button>
          </div>
          <Textarea
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            className="min-h-[180px] rounded-2xl font-mono text-[15px]"
            placeholder="Paste the full math problem here, for example: Evaluate $\\int \\frac{x^2+2x+3}{x(x+1)} \\, dx$."
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500">
              {problemText.trim() ? "Ready to start with this problem." : "Enter a problem before continuing."}
            </p>
            <Button className="rounded-2xl" onClick={onNext} disabled={!problemText.trim()}>
              Start
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle>Problem preview</CardTitle>
          <p className="text-sm text-neutral-500">Check that the problem looks right before continuing.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border bg-neutral-50 p-4">
            <div className="text-xs uppercase tracking-wide text-neutral-500">Problem to support</div>
            <MathText className="mt-3 font-mono text-base text-neutral-900">{problemText || sampleProblem}</MathText>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyzeStage({ onNext, onBack }) {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const steps = [15, 35, 55, 72, 88, 100];
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      if (i < steps.length) {
        setProgress(steps[i]);
      } else {
        window.clearInterval(timer);
      }
    }, 450);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="rounded-3xl shadow-sm">
        <CardHeader>
            <CardTitle>2. Start</CardTitle>
            <p className="text-sm text-neutral-500">
              Checking the problem structure and useful math ideas.
            </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">Starting tutor support</span>
              <span className="text-neutral-500">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="mt-2 text-xs text-neutral-500">
              {progress < 100 ? "Reviewing the problem." : "Ready to choose help."}
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="rounded-2xl border bg-neutral-50 p-4">
              <div className="font-medium text-neutral-900">Problem type</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge className="rounded-full" variant="outline">
                  {sampleAnalysis.topic}
                </Badge>
                <Badge className="rounded-full" variant="outline">
                  {sampleAnalysis.subtopic}
                </Badge>
                <Badge className="rounded-full" variant="outline">
                  {sampleAnalysis.grade}
                </Badge>
              </div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="font-medium text-neutral-900">Knowledge that may help</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {sampleAnalysis.concepts.map((concept) => (
                  <Badge key={concept} className="rounded-full" variant="secondary">
                    <MathText as="span">{concept}</MathText>
                  </Badge>
                ))}
              </div>
            </div>
            <MathText className="rounded-2xl border p-4 font-mono text-sm text-neutral-700">{sampleAnalysis.keyStep}</MathText>
          </div>
          <div className="flex justify-between">
            <Button variant="ghost" className="rounded-2xl" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Edit problem
            </Button>
            <Button className="rounded-2xl" onClick={onNext} disabled={progress < 100}>
              Choose help type
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ShortcutCard({ item, onClick }) {
  const Icon = item.icon;
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick(item.id)}
      className={cn("w-full rounded-3xl border p-5 text-left shadow-sm transition", item.color)}
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <ChevronRight className="h-5 w-5 text-neutral-400" />
      </div>
      <div className="text-base font-semibold leading-snug">{item.title}</div>
      <div className="mt-2 text-sm leading-snug text-neutral-600">{item.description}</div>
    </motion.button>
  );
}

function OptionsStage({ onBack, onSelect }) {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">3. Choose your help type</h2>
          <p className="mt-2 max-w-3xl text-sm text-neutral-600">
            Pick the option that best matches your current learning state. You can change it later.
          </p>
        </div>
        <Button variant="ghost" className="rounded-2xl" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to analysis
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shortcutOptions.map((item) => (
          <ShortcutCard key={item.id} item={item} onClick={onSelect} />
        ))}
      </div>
    </div>
  );
}

function SupportStage({ selected, onBack, onStartOver }) {
  const [answerLevel, setAnswerLevel] = useState("hint");
  const [studentWork, setStudentWork] = useState("");
  const [showPracticeSolution, setShowPracticeSolution] = useState(false);
  
  // Initial setup for different support paths
  useEffect(() => {
    setShowPracticeSolution(false);
    switch (selected) {
      case "work":
        setStudentWork(
          "$\\int \\frac{x^2+2x+3}{x(x+1)} \\, dx = \\int \\left(1+\\frac{3}{x}-\\frac{2}{x+1}\\right) \\, dx$"
        );
        break;
      case "wrong":
        setStudentWork(
          "$\\frac{x^2+2x+3}{x(x+1)} = \\frac{A}{x}+\\frac{B}{x+1}$\n" +
          "$x^2+2x+3 = A(x+1)+Bx$\n" +
          "$A+B=2,\\ A=3,\\ B=-1$\n" +
          "$\\frac{x^2+2x+3}{x(x+1)} = \\frac{3}{x}-\\frac{1}{x+1}$\n" +
          "$\\int \\frac{x^2+2x+3}{x(x+1)} \\, dx = \\int \\left(\\frac{3}{x}-\\frac{1}{x+1}\\right) dx$\n" +
          "$= 3x - \\frac{1}{2}(x+1)^2$"
        );
        break;
      default:
        setStudentWork("");
    }
  }, [selected]);

  const content = useMemo(() => {
    switch (selected) {
      case "understand":
        return {
          title: "Understand the problem",
          left: <MathPreviewInput value={studentWork} onChange={setStudentWork} placeholder="Type the words, symbols, or parts of the question that feel unclear." label="My confusion" helper="Use this space to name what you do not understand yet." />,
          messages: [
            { role: "user", text: `I'm looking at: ${sampleProblem}. I don't quite get what to do.` },
            { role: "assistant", text: "Let's first translate the task. You are being asked to find an antiderivative of a fraction whose numerator and denominator are both polynomials." },
            { role: "assistant", text: "That kind of expression is called a rational function. Here the numerator is $x^2+2x+3$, and the denominator is $x(x+1)$." },
            { role: "assistant", text: "Before choosing a method, inspect the structure: what is the degree of the numerator, and what is the degree of the denominator? That comparison tells you what kind of rewriting may be needed first." },
          ]
        };
      case "knowledge":
        return {
          title: "Review relevant knowledge",
          left: (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">Useful knowledge</div>
                <p className="mt-2 text-sm text-neutral-500">Use these cues to recognize the kind of problem before doing algebra.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {sampleAnalysis.concepts.map((concept) => (
                  <Badge key={concept} className="rounded-full" variant="secondary">
                    <MathText as="span">{concept}</MathText>
                  </Badge>
                ))}
              </div>
            </div>
          ),
          messages: [
            { role: "user", text: "What method should I use for this?" },
            { role: "assistant", text: "The relevant knowledge is rational function integration. Direct integration is not the first move because the expression is one polynomial divided by another, not a simple power or logarithmic form yet." },
            { role: "assistant", text: "Start with degree comparison. The numerator $x^2+2x+3$ and denominator $x(x+1)=x^2+x$ have the same degree, so you should first use polynomial division to rewrite the fraction." },
            { role: "assistant", text: "After that rewrite, the remaining proper fraction can be handled with partial fractions, coefficient matching, and logarithmic integrals." },
            { role: "assistant", text: "Thinking prompt: what do you get if you rewrite the denominator as $x^2+x$ and compare the leading terms of the numerator and denominator?" },
          ]
        };
      case "work":
        return {
          title: "Continue my work",
          left: <MathPreviewInput value={studentWork} onChange={setStudentWork} label="My work so far" placeholder="Type your idea, your current line, or the step where you are blocked." helper="You can type work or upload a photo." />,
          messages: [
            { role: "user", text: studentWork || "$\\int \\frac{x^2+2x+3}{x(x+1)} \\, dx = \\int \\left(1+\\frac{3}{x}-\\frac{2}{x+1}\\right) \\, dx$" },
            { role: "assistant", text: "Your algebra looks fine, so the place you may be stuck is the antiderivative rules rather than the decomposition." },
            { role: "assistant", text: "Hint: in your rewritten integral, focus on the terms that look like $\\frac{1}{x}$ and $\\frac{1}{x+1}$." },
            { role: "assistant", text: "A key formula to recall is:\n$$\\int \\frac{1}{x} \\, dx = \\ln|x| + C$$" },
            { role: "assistant", text: "Now ask yourself: what similar logarithm rule should apply to $\\frac{1}{x+1}$?" },
          ]
        };
      case "practice":
        return {
          title: "Try another question",
          left: (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">Practice question</div>
              </div>
              <MathText className="p-4 rounded-2xl border bg-neutral-50 font-mono">{practiceProblem}</MathText>
              <Button className="w-full rounded-xl" variant={showPracticeSolution ? "secondary" : "outline"} onClick={() => setShowPracticeSolution(true)}>
                See solution
              </Button>
            </div>
          ),
          messages: showPracticeSolution
            ? [
                { role: "user", text: "Show me the solution." },
                { role: "assistant", text: practiceSolution },
              ]
            : [
                { role: "assistant", text: practiceProblem },
              ]
        };
      case "answer":
        return {
          title: "Reveal the answer in stages",
          left: (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">Answer support levels</div>
                <p className="mt-2 text-sm text-neutral-500">Try Hint or Outline before opening the full answer.</p>
              </div>
              <MathText className="p-4 rounded-2xl border bg-neutral-50 font-mono">{sampleProblem}</MathText>
              <div className="grid gap-2">
                <Button variant={answerLevel === "hint" ? "default" : "outline"} className="h-auto justify-start rounded-xl px-4 py-3 text-left" onClick={() => setAnswerLevel("hint")}>1. Hint: first move only</Button>
                <Button variant={answerLevel === "outline" ? "default" : "outline"} className="h-auto justify-start rounded-xl px-4 py-3 text-left" onClick={() => setAnswerLevel("outline")}>2. Outline: stages without details</Button>
                <Button variant={answerLevel === "worked" ? "default" : "outline"} className="h-auto justify-start rounded-xl px-4 py-3 text-left" onClick={() => setAnswerLevel("worked")}>3. Worked steps: reasoning and algebra</Button>
                <Button variant={answerLevel === "full" ? "default" : "outline"} className="h-auto justify-start rounded-xl px-4 py-3 text-left" onClick={() => setAnswerLevel("full")}>4. Final answer: result only</Button>
              </div>
            </div>
          ),
          messages: [
            { role: "user", text: `Show me the ${answerLevel} for this problem.` },
            { role: "assistant", text: answerLevel === "hint" ? "Hint: compare the degrees before trying partial fractions. If the degrees are the same, first rewrite the rational function as a polynomial plus a proper fraction." : 
                                      answerLevel === "outline" ? "Outline:\n1. Rewrite the denominator as $x(x+1)=x^2+x$.\n2. Compare degrees and use polynomial division.\n3. Decompose the remaining proper fraction into $\\frac{A}{x}+\\frac{B}{x+1}$.\n4. Match coefficients to find $A$ and $B$.\n5. Integrate the polynomial term and the logarithmic terms separately." : 
                                      answerLevel === "worked" ? "Worked solution with reasoning:\nFirst rewrite the denominator:\n$$x(x+1)=x^2+x$$\nThe numerator and denominator have the same degree, so divide first:\n$$\\frac{x^2+2x+3}{x^2+x}=1+\\frac{x+3}{x(x+1)}$$\nNow decompose the proper fraction:\n$$\\frac{x+3}{x(x+1)}=\\frac{A}{x}+\\frac{B}{x+1}$$\nClear denominators:\n$$x+3=A(x+1)+Bx$$\nMatch coefficients:\n$$A+B=1,\\quad A=3,\\quad B=-2$$\nSo:\n$$\\frac{x+3}{x(x+1)}=\\frac{3}{x}-\\frac{2}{x+1}$$\nIntegrate term by term:\n$$\\int \\left(1+\\frac{3}{x}-\\frac{2}{x+1}\\right) dx = x+3\\ln|x|-2\\ln|x+1|+C$$" : 
                                      "Full answer:\n$$\\int \\frac{x^2+2x+3}{x(x+1)} \\, dx = x+3\\ln|x|-2\\ln|x+1|+C$$\nThis comes from rewriting the integrand as:\n$$1+\\frac{3}{x}-\\frac{2}{x+1}$$" }
          ]
        };
      case "wrong":
      default:
        return {
          title: "Find my mistake",
          left: <MathPreviewInput value={studentWork} onChange={setStudentWork} label="My submitted work" placeholder="Paste the solution you turned in so we can find where it first went off track." helper="Use this to review the work that was marked wrong and locate the first mistake." />,
          messages: [
            { role: "user", text: studentWork || "$\\frac{x^2+2x+3}{x(x+1)} = \\frac{A}{x}+\\frac{B}{x+1}$" },
            { role: "assistant", text: "The first mistake happens at the partial fraction setup. You applied partial fractions directly to $\\frac{x^2+2x+3}{x(x+1)}$, but that fraction is not proper because the numerator and denominator have the same degree." },
            { role: "assistant", text: "Because of that, the coefficients you found and the rewritten integrand are based on the wrong expression. You also integrated $\\frac{3}{x}$ and $\\frac{1}{x+1}$ as if they were polynomial terms, which is why the antiderivative became $3x-\\frac{1}{2}(x+1)^2$ instead of logarithms." },
            { role: "assistant", text: "Repair it in this order:\n$$\\frac{x^2+2x+3}{x(x+1)} = 1+\\frac{x+3}{x(x+1)}$$\nThen decompose only the proper fraction:\n$$\\frac{x+3}{x(x+1)} = \\frac{3}{x}-\\frac{2}{x+1}$$" },
            { role: "assistant", text: "Now integrate the corrected form term by term:\n$$\\int \\left(1+\\frac{3}{x}-\\frac{2}{x+1}\\right) dx = x+3\\ln|x|-2\\ln|x+1|+C$$\nNotice the final answer also needs the constant of integration." },
          ]
        };
    }
  }, [selected, answerLevel, studentWork, showPracticeSolution]);

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr] h-[700px]">
      {/* Left Panel: Work Area */}
      <Card className="rounded-3xl shadow-sm flex flex-col overflow-hidden">
        <CardHeader className="border-b bg-neutral-50/50 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">Selected help type</div>
              <CardTitle className="mt-2 text-lg">{content.title}</CardTitle>
            </div>
            <Badge variant="secondary" className="rounded-full px-3">Step 4</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {content.left}
        </CardContent>
        <div className="grid gap-2 p-4 border-t bg-neutral-50/50">
           <Button variant="outline" className="w-full rounded-xl" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Change help type
            </Button>
            <Button variant="ghost" className="w-full rounded-xl" onClick={onStartOver}>
              Start over with a problem
            </Button>
        </div>
      </Card>

      {/* Right Panel: Chat Area */}
      <Card className="rounded-3xl shadow-sm flex flex-col overflow-hidden border-neutral-200">
        <CardHeader className="border-b py-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <CardTitle className="text-lg">Tutor guidance</CardTitle>
            </div>
          </div>
          <Badge variant="secondary" className="rounded-full px-3">{content.title}</Badge>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6 bg-neutral-50/30">
          <AnimatePresence initial={false}>
            {content.messages.map((msg, idx) => (
              <motion.div
                key={`${selected}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <ChatMessage role={msg.role}>{msg.text}</ChatMessage>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
        <div className="p-4 border-t bg-white">
          <div className="mb-2 text-xs text-neutral-500">Optional: type what you would ask next in this help mode.</div>
          <div className="flex gap-2">
            <Input className="rounded-xl flex-1 border-neutral-200" placeholder="Example: I tried clearing denominators, but I am unsure what to match." />
            <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium transition hover:bg-neutral-100">
              <Upload className="mr-2 h-4 w-4" />
              Photo
              <input className="hidden" type="file" accept="image/*" />
            </label>
            <Button className="rounded-xl px-6">Ask</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState("upload");
  const [problemText, setProblemText] = useState(sampleProblem);
  const [selected, setSelected] = useState(null);

  const stepIndex = {
    upload: 1,
    analyze: 2,
    options: 3,
    support: 4,
  }[stage];

  const stageStatus = {
    upload: "Current step: add or check the problem.",
    analyze: "Current step: starting tutor support.",
    options: "Current step: choose the help type that matches your state.",
    support: "Current step: use guided help, change help type, or start over.",
  }[stage];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <Header />

        <Card className="mb-6 rounded-3xl shadow-sm overflow-hidden border-neutral-200">
          <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between bg-white">
            <div className="flex flex-wrap items-center gap-6">
              <StepPill index={1} label="Add problem" active={stepIndex === 1} done={stepIndex > 1} />
              <StepPill index={2} label="Start" active={stepIndex === 2} done={stepIndex > 2} />
              <StepPill index={3} label="Choose help type" active={stepIndex === 3} done={stepIndex > 3} />
              <StepPill index={4} label="Guided help" active={stepIndex === 4} done={false} />
            </div>
            <div className="flex items-center gap-3 text-neutral-400">
              <div className="h-4 w-[1px] bg-neutral-200 hidden md:block" />
              <div className="space-y-1 text-right">
                <div className="text-xs font-medium text-neutral-500">{stageStatus}</div>
                <MathText className="max-w-[300px] font-mono text-xs truncate">
                  {problemText}
                </MathText>
              </div>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${stage}-${selected ?? "none"}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            {stage === "upload" && <UploadStage problemText={problemText} setProblemText={setProblemText} onNext={() => setStage("analyze")} />}
            {stage === "analyze" && <AnalyzeStage onBack={() => setStage("upload")} onNext={() => setStage("options")} />}
            {stage === "options" && (
              <OptionsStage
                onBack={() => setStage("analyze")}
                onSelect={(id) => {
                  setSelected(id);
                  setStage("support");
                }}
              />
            )}
            {stage === "support" && (
              <SupportStage
                selected={selected}
                onBack={() => setStage("options")}
                onStartOver={() => {
                  setSelected(null);
                  setStage("upload");
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

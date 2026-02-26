export type AgentStatus = "online" | "busy" | "offline";

export type Agent = {
  id: string;
  name: string;
  status: AgentStatus;
  role: string;
  currentTask: string | null;
  lastActivity: string;
  avatar: string;
  model: string;
  workspace: string;
};

export const agents: Agent[] = [
  {
    id: "main",
    name: "JJ",
    status: "online",
    role: "Mission Lead",
    currentTask: "Operations coordination",
    lastActivity: "now",
    avatar: "🤖🍼",
    model: "MiniMax-M2.5",
    workspace: "workspace-jj",
  },
  {
    id: "vlad",
    name: "Vlad",
    status: "busy",
    role: "Head Coder",
    currentTask: "Mission Control v2 build",
    lastActivity: "1m ago",
    avatar: "👨‍💻",
    model: "gpt-5.3-codex",
    workspace: "workspace-vlad",
  },
  {
    id: "ali",
    name: "Ali",
    status: "online",
    role: "Growth Operator",
    currentTask: "UX research synthesis",
    lastActivity: "3m ago",
    avatar: "🚀",
    model: "MiniMax-M2.5",
    workspace: "workspace-ali",
  },
  {
    id: "pete",
    name: "Pete",
    status: "busy",
    role: "Quant / DFS",
    currentTask: "DFS engine validation",
    lastActivity: "4m ago",
    avatar: "📈",
    model: "gpt-5-mini",
    workspace: "workspace-pete",
  },
  {
    id: "coppa",
    name: "Coppa",
    status: "online",
    role: "Security & Risk",
    currentTask: "Policy hardening",
    lastActivity: "8m ago",
    avatar: "🛡️",
    model: "gpt-5-mini",
    workspace: "workspace-coppa",
  },
  {
    id: "coach",
    name: "Coach",
    status: "online",
    role: "Execution Coach",
    currentTask: "Goals page scaffold",
    lastActivity: "2m ago",
    avatar: "⏰",
    model: "MiniMax-M2.5",
    workspace: "workspace-coach",
  },
  {
    id: "scout",
    name: "Scout",
    status: "online",
    role: "Research & Discovery",
    currentTask: "Signal scouting",
    lastActivity: "now",
    avatar: "🔎",
    model: "MiniMax-M2.5",
    workspace: "workspace-scout",
  },
];

export const notifications = [
  { id: "n1", level: "info", title: "Deploy queued", detail: "Mission Control v2 queued for Vercel." },
  { id: "n2", level: "success", title: "Scout online", detail: "New research agent is active." },
  { id: "n3", level: "warning", title: "Pete task running long", detail: "DFS batch exceeded expected runtime." },
];

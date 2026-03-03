const docsBase = "https://github.com/cryptolyrics/Elevate-Flow/blob/codex/framework-reset-v1/agents";

const agentDocs = [
  { id: "jj", name: "JJ", role: "COO", folder: "JJ" },
  { id: "vlad", name: "Vlad", role: "Dev", folder: "vlad" },
  { id: "baby-vlad", name: "Baby Vlad", role: "Dev Support", folder: "baby-vlad" },
  { id: "pete", name: "Pete", role: "Quant", folder: "Pete" },
  { id: "ali", name: "Ali", role: "Growth", folder: "Ali" },
  { id: "scout", name: "Scout", role: "Validation", folder: "Scout" },
  { id: "coach", name: "Coach", role: "Accountability", folder: "Coach" },
  { id: "coppa", name: "Coppa", role: "Security/Compliance", folder: "coppa" },
];

const files = ["SOUL.md", "IDENTITY.md", "TASKS.md", "STATUS.md"];

function docHref(folder: string, file: string) {
  return `${docsBase}/${folder}/${file}`;
}

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Agents Docs</h1>
        <p className="text-text-secondary">Direct links to each agent&apos;s operating docs in Elevate Flow.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {agentDocs.map((agent) => (
          <section key={agent.id} className="rounded-xl border border-white/10 bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">{agent.name}</h2>
                <p className="text-sm text-text-secondary">{agent.role}</p>
              </div>
              <a
                className="text-xs text-primary hover:underline"
                href={`${docsBase}/${agent.folder}`}
                target="_blank"
                rel="noreferrer"
              >
                Open Folder
              </a>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {files.map((file) => (
                <a
                  key={`${agent.id}-${file}`}
                  href={docHref(agent.folder, file)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-background px-3 py-2 text-xs text-text-primary hover:bg-card-hover"
                >
                  {file}
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

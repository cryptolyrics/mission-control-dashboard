type Activity = {
  id: string;
  agent: string;
  action: string;
  timestamp: string;
  type: "success" | "info" | "warning" | "error";
};

interface ActivityFeedProps {
  activities: Activity[];
}

const typeColors = {
  success: "text-success",
  info: "text-primary",
  warning: "text-warning",
  error: "text-error",
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
      <div className="max-h-80 overflow-y-auto">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`p-4 border-b border-white/5 hover:bg-card-hover transition-colors ${
              index === 0 ? "bg-card-hover" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{activity.agent}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${typeColors[activity.type].replace("text-", "bg-")}`}></span>
                </div>
                <p className="text-sm text-text-secondary truncate">{activity.action}</p>
              </div>
              <span className="text-xs text-text-secondary whitespace-nowrap">{activity.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-white/5 text-center">
        <button className="text-xs text-primary hover:underline">View All Activity →</button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useScanContext } from "@/context/ScanContext";
import { type AgentType } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export default function AgentLogs() {
  const { agentLogs } = useScanContext();
  const [filter, setFilter] = useState<AgentType | "all">("all");

  const filtered = filter === "all" ? agentLogs : agentLogs.filter(l => l.agent === filter);

  const levelColor = (level: string) => {
    switch (level) {
      case "error": return "text-destructive";
      case "warning": return "text-warning";
      case "success": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const levelDot = (level: string) => {
    switch (level) {
      case "error": return "bg-destructive";
      case "warning": return "bg-warning";
      case "success": return "bg-success";
      default: return "bg-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono tracking-tight">Agent Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time multi-agent activity feed</p>
      </div>

      <div className="flex gap-2">
        {(["all", "detection", "remediation", "reporting"] as const).map(f => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="text-xs font-mono capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      <Card className="bg-card border-border p-1 scanline relative overflow-hidden">
        <div className="rounded-md bg-background/50 p-4 font-mono text-xs space-y-0">
          {filtered.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0"
            >
              <span className="text-muted-foreground/50 shrink-0 w-20">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <div className={`h-2 w-2 rounded-full mt-1 shrink-0 ${levelDot(log.level)}`} />
              <Badge variant="outline" className="text-[10px] shrink-0 uppercase w-24 justify-center">
                {log.agent}
              </Badge>
              <span className={levelColor(log.level)}>{log.message}</span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}

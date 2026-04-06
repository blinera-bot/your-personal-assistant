import { useState } from "react";
import { scans, type Scan } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Radar, Play, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  completed: "bg-success/15 text-success border-success/30",
  running: "bg-info/15 text-info border-info/30",
  queued: "bg-muted text-muted-foreground border-border",
  failed: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function Scans() {
  const [targetUrl, setTargetUrl] = useState("");

  const handleStartScan = () => {
    if (!targetUrl.trim()) {
      toast.error("Please enter a target URL.");
      return;
    }
    try {
      new URL(targetUrl);
    } catch {
      toast.error("Please enter a valid URL (e.g. https://example.com).");
      return;
    }
    toast.success(`Scan initiated on ${targetUrl}! Detection Agent is starting...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono tracking-tight">Scan Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Initiate and monitor security scans</p>
      </div>

      {/* New Scan */}
      <Card className="p-5 bg-card border-border glow-primary">
        <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
          <Radar className="h-4 w-4 text-primary" />
          New Scan
        </h3>
        <div className="flex gap-3">
          <Input
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://target-app.example.com"
            className="font-mono text-sm bg-secondary border-border"
          />
          <Button onClick={handleStartScan} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Play className="h-4 w-4" />
            Start Scan
          </Button>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-warning">
          <AlertTriangle className="h-3 w-3" />
          Ensure you have authorization before scanning any target
        </div>
      </Card>

      {/* Scan History */}
      <div className="space-y-4">
        <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Scan History</h3>
        {scans.map((scan, i) => (
          <ScanCard key={scan.id} scan={scan} index={i} />
        ))}
      </div>
    </div>
  );
}

function ScanCard({ scan, index }: { scan: Scan; index: number }) {
  const totalVulns = Object.values(scan.vulnCount).reduce((a, b) => a + b, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-5 bg-card border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold">{scan.id}</span>
              <Badge variant="outline" className={`text-xs ${statusStyles[scan.status]}`}>
                {scan.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-1">{scan.targetUrl}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-mono font-bold">{scan.riskScore.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Risk Score</p>
          </div>
        </div>

        {/* Agent Progress */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {(["detection", "remediation", "reporting"] as const).map((agent) => (
            <div key={agent}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground capitalize">{agent}</span>
                <span className="font-mono">{scan.agentProgress[agent]}%</span>
              </div>
              <Progress value={scan.agentProgress[agent]} className="h-1.5" />
            </div>
          ))}
        </div>

        {/* Vuln summary */}
        <div className="flex gap-2 flex-wrap">
          {scan.vulnCount.critical > 0 && <Badge variant="outline" className="bg-destructive/15 text-destructive border-destructive/30 text-xs">{scan.vulnCount.critical} Critical</Badge>}
          {scan.vulnCount.high > 0 && <Badge variant="outline" className="bg-warning/15 text-warning border-warning/30 text-xs">{scan.vulnCount.high} High</Badge>}
          {scan.vulnCount.medium > 0 && <Badge variant="outline" className="bg-info/15 text-info border-info/30 text-xs">{scan.vulnCount.medium} Medium</Badge>}
          {scan.vulnCount.low > 0 && <Badge variant="outline" className="bg-success/15 text-success border-success/30 text-xs">{scan.vulnCount.low} Low</Badge>}
          <span className="text-xs text-muted-foreground ml-auto font-mono">
            {new Date(scan.startedAt).toLocaleDateString()}
          </span>
        </div>
      </Card>
    </motion.div>
  );
}

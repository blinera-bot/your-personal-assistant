import { StatCard } from "@/components/StatCard";
import { Bug, Shield, AlertTriangle, CheckCircle, Radar, TrendingUp } from "lucide-react";
import { useScanContext } from "@/context/ScanContext";
import { riskTrendData, severityDistribution, owaspDistribution, getSeverityBg } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, Bar, BarChart, Cell, PieChart, Pie } from "recharts";

const chartConfig = {
  score: { label: "Risk Score", color: "hsl(160, 100%, 45%)" },
  count: { label: "Vulnerabilities", color: "hsl(280, 80%, 55%)" },
};

const Index = () => {
  const { vulnerabilities, scans, agentLogs } = useScanContext();

  const totalVulns = vulnerabilities.length;
  const criticalCount = vulnerabilities.filter(v => v.severity === "Critical").length;
  const openCount = vulnerabilities.filter(v => v.status === "open").length;
  const remediatedCount = vulnerabilities.filter(v => v.status === "remediated").length;
  const latestScan = scans[0];
  const recentLogs = agentLogs.slice(-5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono tracking-tight">
          Security Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Multi-agent vulnerability analysis • Cyberion
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Findings" value={totalVulns} subtitle={`${openCount} open`} icon={Bug} />
        <StatCard title="Critical" value={criticalCount} subtitle="Immediate action required" icon={AlertTriangle} variant="danger" />
        <StatCard title="Risk Score" value={latestScan?.riskScore.toFixed(1) ?? "N/A"} subtitle="Latest scan" icon={TrendingUp} variant="warning" />
        <StatCard title="Remediated" value={remediatedCount} subtitle={totalVulns > 0 ? `${((remediatedCount / totalVulns) * 100).toFixed(0)}% resolved` : "0%"} icon={CheckCircle} variant="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="col-span-2 p-5 bg-card border-border">
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Risk Score Trend</h3>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <AreaChart data={riskTrendData}>
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(160, 100%, 45%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(160, 100%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis domain={[0, 10]} tickLine={false} axisLine={false} fontSize={11} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="score" stroke="hsl(160, 100%, 45%)" strokeWidth={2} fill="url(#riskGradient)" />
            </AreaChart>
          </ChartContainer>
        </Card>

        <Card className="p-5 bg-card border-border">
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Severity Distribution</h3>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie data={severityDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" nameKey="name" strokeWidth={2} stroke="hsl(220, 20%, 4%)">
                {severityDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5 bg-card border-border">
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">OWASP Top 10 Mapping</h3>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={owaspDistribution} layout="vertical">
              <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis type="category" dataKey="category" tickLine={false} axisLine={false} fontSize={10} width={130} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="hsl(280, 80%, 55%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        </Card>

        <Card className="p-5 bg-card border-border">
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Latest Findings</h3>
          <div className="space-y-3">
            {vulnerabilities.slice(0, 4).map((vuln, i) => (
              <motion.div
                key={vuln.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between rounded-md border border-border bg-secondary/30 p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{vuln.title}</p>
                  <p className="text-xs text-muted-foreground font-mono">{vuln.id}</p>
                </div>
                <Badge variant="outline" className={`ml-2 text-xs ${getSeverityBg(vuln.severity)}`}>
                  {vuln.severity}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5 bg-card border-border">
        <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Agent Activity Feed</h3>
        <div className="space-y-1 font-mono text-xs">
          {recentLogs.map((log) => {
            const levelColor =
              log.level === "error" ? "text-destructive" :
              log.level === "warning" ? "text-warning" :
              log.level === "success" ? "text-success" : "text-muted-foreground";
            return (
              <div key={log.id} className="flex gap-3 py-1.5 border-b border-border/50 last:border-0">
                <span className="text-muted-foreground/60 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <Badge variant="outline" className="text-[10px] shrink-0 uppercase">
                  {log.agent}
                </Badge>
                <span className={levelColor}>{log.message}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Index;

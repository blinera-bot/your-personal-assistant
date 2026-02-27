import { useState } from "react";
import { vulnerabilities, getSeverityBg, type Vulnerability, type Severity } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { ExternalLink, Shield, Code, Lightbulb } from "lucide-react";

export default function Vulnerabilities() {
  const [selected, setSelected] = useState<Vulnerability | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<Severity | "All">("All");

  const filtered = filterSeverity === "All"
    ? vulnerabilities
    : vulnerabilities.filter(v => v.severity === filterSeverity);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono tracking-tight">Vulnerabilities</h1>
        <p className="text-sm text-muted-foreground mt-1">{vulnerabilities.length} findings across all scans</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["All", "Critical", "High", "Medium", "Low"] as const).map(sev => (
          <Button
            key={sev}
            variant={filterSeverity === sev ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterSeverity(sev)}
            className="text-xs font-mono"
          >
            {sev}
          </Button>
        ))}
      </div>

      {/* Vulnerability list */}
      <div className="space-y-3">
        {filtered.map((vuln, i) => (
          <motion.div
            key={vuln.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              className="p-4 bg-card border-border cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => setSelected(vuln)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground">{vuln.id}</span>
                    <Badge variant="outline" className={`text-xs ${getSeverityBg(vuln.severity)}`}>
                      {vuln.severity}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${vuln.status === "remediated" ? "bg-success/15 text-success border-success/30" : "bg-secondary text-secondary-foreground"}`}>
                      {vuln.status}
                    </Badge>
                  </div>
                  <p className="font-medium text-sm">{vuln.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{vuln.owaspCategory}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-lg font-bold">{vuln.riskScore}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">CVSS</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl bg-card border-border max-h-[80vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-mono text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {selected.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className={getSeverityBg(selected.severity)}>{selected.severity}</Badge>
                  <Badge variant="outline">{selected.owaspCategory}</Badge>
                  <Badge variant="outline">CVSS: {selected.riskScore}</Badge>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-muted-foreground mb-2">Description</h4>
                  <p className="text-sm leading-relaxed">{selected.description}</p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-muted-foreground mb-2 flex items-center gap-1">
                    <Code className="h-3 w-3" /> Proof of Concept
                  </h4>
                  <div className="rounded-md bg-secondary p-3 font-mono text-xs text-foreground/80">
                    {selected.evidence}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-muted-foreground mb-2 flex items-center gap-1">
                    <Lightbulb className="h-3 w-3" /> Remediation
                  </h4>
                  <p className="text-sm leading-relaxed">{selected.recommendation}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <ExternalLink className="h-3 w-3" />
                  {selected.affectedUrl}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

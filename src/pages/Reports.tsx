import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, FileJson, Globe, File } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { scans } from "@/lib/mock-data";

const reports = [
  {
    id: "RPT-001",
    title: "Full Security Assessment - SCAN-001",
    type: "Technical",
    scanId: "SCAN-001",
    date: "2026-02-27",
    findings: 6,
    pages: 24,
  },
  {
    id: "RPT-002",
    title: "Executive Summary - SCAN-001",
    type: "Executive",
    scanId: "SCAN-001",
    date: "2026-02-27",
    findings: 6,
    pages: 8,
  },
  {
    id: "RPT-003",
    title: "Full Security Assessment - SCAN-003",
    type: "Technical",
    scanId: "SCAN-003",
    date: "2026-02-25",
    findings: 10,
    pages: 31,
  },
];

export default function Reports() {
  const handleDownload = (format: string) => {
    toast.success(`${format.toUpperCase()} report downloading...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Generated security assessment reports</p>
      </div>

      <div className="space-y-4">
        {reports.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-5 bg-card border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{report.title}</p>
                    <div className="flex gap-2 mt-1.5">
                      <Badge variant="outline" className="text-xs">{report.type}</Badge>
                      <span className="text-xs text-muted-foreground font-mono">{report.findings} findings • {report.pages} pages</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">{report.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDownload("pdf")} className="gap-1.5 text-xs">
                    <File className="h-3 w-3" /> PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDownload("html")} className="gap-1.5 text-xs">
                    <Globe className="h-3 w-3" /> HTML
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDownload("json")} className="gap-1.5 text-xs">
                    <FileJson className="h-3 w-3" /> JSON
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

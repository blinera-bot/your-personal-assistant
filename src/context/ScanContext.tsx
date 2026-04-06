import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  scans as initialScans,
  vulnerabilities as initialVulnerabilities,
  agentLogs as initialAgentLogs,
  type Scan,
  type Vulnerability,
  type AgentLog,
  type Severity,
} from "@/lib/mock-data";

interface ScanContextType {
  scans: Scan[];
  vulnerabilities: Vulnerability[];
  agentLogs: AgentLog[];
  startScan: (targetUrl: string) => void;
}

const ScanContext = createContext<ScanContextType | null>(null);

export function useScanContext() {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error("useScanContext must be used within ScanProvider");
  return ctx;
}

const severities: Severity[] = ["Critical", "High", "Medium", "Low", "Info"];
const categories = [
  { cat: "Injection", owasp: "A03:2021 - Injection" },
  { cat: "Access Control", owasp: "A01:2021 - Broken Access Control" },
  { cat: "Authentication", owasp: "A07:2021 - Identification and Authentication Failures" },
  { cat: "Misconfiguration", owasp: "A05:2021 - Security Misconfiguration" },
  { cat: "Cross-Site Scripting", owasp: "A03:2021 - Injection" },
  { cat: "Cryptographic Failures", owasp: "A02:2021 - Cryptographic Failures" },
];

const vulnTemplates = [
  { title: "SQL Injection in Form Input", severity: "Critical" as Severity, riskScore: 9.5 },
  { title: "Reflected XSS via Query Parameter", severity: "High" as Severity, riskScore: 7.8 },
  { title: "Insecure Direct Object Reference", severity: "Medium" as Severity, riskScore: 5.4 },
  { title: "Missing Security Headers", severity: "Low" as Severity, riskScore: 3.2 },
  { title: "Weak TLS Configuration", severity: "Medium" as Severity, riskScore: 5.0 },
  { title: "Open Redirect Vulnerability", severity: "Medium" as Severity, riskScore: 4.7 },
  { title: "Broken Authentication Mechanism", severity: "High" as Severity, riskScore: 8.1 },
  { title: "Sensitive Data Exposure in API", severity: "Critical" as Severity, riskScore: 9.2 },
  { title: "Cross-Site Request Forgery", severity: "Medium" as Severity, riskScore: 5.8 },
  { title: "Information Disclosure via Error Pages", severity: "Low" as Severity, riskScore: 2.9 },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function ScanProvider({ children }: { children: ReactNode }) {
  const [scans, setScans] = useState<Scan[]>(initialScans);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>(initialVulnerabilities);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>(initialAgentLogs);

  const startScan = useCallback((targetUrl: string) => {
    const now = new Date();
    const scanId = `SCAN-${String(scans.length + 1).padStart(3, "0")}`;

    // Generate random vulnerabilities for this scan
    const vulnCount = randomInt(2, 6);
    const selectedTemplates = [...vulnTemplates].sort(() => Math.random() - 0.5).slice(0, vulnCount);
    const newVulns: Vulnerability[] = selectedTemplates.map((tmpl, i) => {
      const cat = pick(categories);
      return {
        id: `VULN-${String(vulnerabilities.length + i + 1).padStart(3, "0")}`,
        title: tmpl.title,
        severity: tmpl.severity,
        category: cat.cat,
        owaspCategory: cat.owasp,
        riskScore: tmpl.riskScore,
        status: "open" as const,
        detectedAt: now.toISOString(),
        description: `Automated scan detected ${tmpl.title.toLowerCase()} on ${targetUrl}.`,
        evidence: `Payload triggered on target endpoint during automated testing.`,
        recommendation: `Apply standard remediation practices for ${cat.cat.toLowerCase()} vulnerabilities.`,
        affectedUrl: targetUrl,
      };
    });

    const counts = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    newVulns.forEach(v => {
      counts[v.severity.toLowerCase() as keyof typeof counts]++;
    });

    const maxRisk = newVulns.length > 0 ? Math.max(...newVulns.map(v => v.riskScore)) : 0;

    const newScan: Scan = {
      id: scanId,
      targetUrl,
      status: "completed",
      startedAt: now.toISOString(),
      completedAt: new Date(now.getTime() + 25 * 60000).toISOString(),
      vulnCount: counts,
      riskScore: parseFloat(maxRisk.toFixed(1)),
      agentProgress: { detection: 100, remediation: 100, reporting: 100 },
    };

    // Generate agent logs for this scan
    const newLogs: AgentLog[] = [
      { id: `log-${Date.now()}-1`, agent: "detection", message: `Crawling target: ${targetUrl}`, timestamp: now.toISOString(), level: "info" },
      { id: `log-${Date.now()}-2`, agent: "detection", message: `Discovered ${randomInt(15, 80)} endpoints via sitemap + JS analysis`, timestamp: new Date(now.getTime() + 90000).toISOString(), level: "success" },
      { id: `log-${Date.now()}-3`, agent: "detection", message: `${newVulns.length} vulnerabilities detected on ${targetUrl}`, timestamp: new Date(now.getTime() + 180000).toISOString(), level: newVulns.some(v => v.severity === "Critical") ? "error" : "warning" },
      { id: `log-${Date.now()}-4`, agent: "remediation", message: `Analyzing ${newVulns.length} findings — mapping to OWASP categories`, timestamp: new Date(now.getTime() + 300000).toISOString(), level: "info" },
      { id: `log-${Date.now()}-5`, agent: "remediation", message: `Generated remediation patches for all findings`, timestamp: new Date(now.getTime() + 600000).toISOString(), level: "success" },
      { id: `log-${Date.now()}-6`, agent: "reporting", message: `Report generated: ${scanId} — ${newVulns.length} findings`, timestamp: new Date(now.getTime() + 900000).toISOString(), level: "success" },
    ];

    setScans(prev => [newScan, ...prev]);
    setVulnerabilities(prev => [...prev, ...newVulns]);
    setAgentLogs(prev => [...prev, ...newLogs]);
  }, [scans.length, vulnerabilities.length]);

  return (
    <ScanContext.Provider value={{ scans, vulnerabilities, agentLogs, startScan }}>
      {children}
    </ScanContext.Provider>
  );
}

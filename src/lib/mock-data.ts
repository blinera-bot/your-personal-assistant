export type Severity = "Critical" | "High" | "Medium" | "Low" | "Info";
export type ScanStatus = "completed" | "running" | "queued" | "failed";
export type AgentType = "detection" | "remediation" | "reporting";

export interface Vulnerability {
  id: string;
  title: string;
  severity: Severity;
  category: string;
  owaspCategory: string;
  riskScore: number;
  status: "open" | "remediated" | "accepted";
  detectedAt: string;
  description: string;
  evidence: string;
  recommendation: string;
  affectedUrl: string;
}

export interface Scan {
  id: string;
  targetUrl: string;
  status: ScanStatus;
  startedAt: string;
  completedAt?: string;
  vulnCount: { critical: number; high: number; medium: number; low: number; info: number };
  riskScore: number;
  agentProgress: { detection: number; remediation: number; reporting: number };
}

export interface AgentLog {
  id: string;
  agent: AgentType;
  message: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "success";
}

export const vulnerabilities: Vulnerability[] = [
  {
    id: "VULN-001",
    title: "SQL Injection in Login Form",
    severity: "Critical",
    category: "Injection",
    owaspCategory: "A03:2021 - Injection",
    riskScore: 9.8,
    status: "open",
    detectedAt: "2026-02-27T10:23:00Z",
    description: "The login form is vulnerable to SQL injection attacks through the username parameter. An attacker can bypass authentication or extract sensitive data.",
    evidence: "Payload: ' OR '1'='1' -- returned HTTP 200 with admin session cookie",
    recommendation: "Use parameterized queries or prepared statements. Implement input validation and sanitization.",
    affectedUrl: "https://juice-shop.local/rest/user/login",
  },
  {
    id: "VULN-002",
    title: "Reflected XSS in Search",
    severity: "High",
    category: "Cross-Site Scripting",
    owaspCategory: "A03:2021 - Injection",
    riskScore: 7.5,
    status: "open",
    detectedAt: "2026-02-27T10:25:00Z",
    description: "The search functionality reflects user input without proper encoding, allowing script injection.",
    evidence: "Payload: <script>alert(document.cookie)</script> executed in browser context",
    recommendation: "Encode all output using context-appropriate encoding. Implement Content Security Policy headers.",
    affectedUrl: "https://juice-shop.local/#/search?q=",
  },
  {
    id: "VULN-003",
    title: "Broken Authentication - Weak Password Policy",
    severity: "High",
    category: "Authentication",
    owaspCategory: "A07:2021 - Identification and Authentication Failures",
    riskScore: 7.2,
    status: "remediated",
    detectedAt: "2026-02-27T10:27:00Z",
    description: "The application accepts passwords as short as 1 character with no complexity requirements.",
    evidence: "Successfully registered user with password 'a'",
    recommendation: "Enforce minimum password length of 12 characters with complexity requirements. Implement account lockout policies.",
    affectedUrl: "https://juice-shop.local/#/register",
  },
  {
    id: "VULN-004",
    title: "IDOR - User Profile Access",
    severity: "Medium",
    category: "Access Control",
    owaspCategory: "A01:2021 - Broken Access Control",
    riskScore: 5.5,
    status: "open",
    detectedAt: "2026-02-27T10:30:00Z",
    description: "User profiles can be accessed by modifying the user ID parameter in the API request.",
    evidence: "GET /api/users/2 returned profile data of another user while authenticated as user 1",
    recommendation: "Implement proper authorization checks. Validate that the authenticated user has access to the requested resource.",
    affectedUrl: "https://juice-shop.local/api/users/",
  },
  {
    id: "VULN-005",
    title: "Security Misconfiguration - Verbose Error Messages",
    severity: "Low",
    category: "Misconfiguration",
    owaspCategory: "A05:2021 - Security Misconfiguration",
    riskScore: 3.1,
    status: "open",
    detectedAt: "2026-02-27T10:32:00Z",
    description: "Application returns detailed stack traces and database error messages to the client.",
    evidence: "Error response includes full SQL query and database schema information",
    recommendation: "Implement generic error pages. Log detailed errors server-side only. Disable debug mode in production.",
    affectedUrl: "https://juice-shop.local/api/products/999",
  },
  {
    id: "VULN-006",
    title: "Exposed Admin Panel",
    severity: "Critical",
    category: "Access Control",
    owaspCategory: "A01:2021 - Broken Access Control",
    riskScore: 9.1,
    status: "open",
    detectedAt: "2026-02-27T10:35:00Z",
    description: "The admin panel is accessible without proper authentication checks on the client side.",
    evidence: "Navigating to /#/administration reveals full admin panel with user management",
    recommendation: "Implement server-side access control checks. Remove client-side route guards as sole protection.",
    affectedUrl: "https://juice-shop.local/#/administration",
  },
];

export const scans: Scan[] = [
  {
    id: "SCAN-001",
    targetUrl: "https://juice-shop.local",
    status: "completed",
    startedAt: "2026-02-27T10:20:00Z",
    completedAt: "2026-02-27T10:45:00Z",
    vulnCount: { critical: 2, high: 2, medium: 1, low: 1, info: 0 },
    riskScore: 8.4,
    agentProgress: { detection: 100, remediation: 100, reporting: 100 },
  },
  {
    id: "SCAN-002",
    targetUrl: "https://juice-shop.local",
    status: "running",
    startedAt: "2026-02-27T14:00:00Z",
    vulnCount: { critical: 1, high: 0, medium: 0, low: 0, info: 0 },
    riskScore: 4.2,
    agentProgress: { detection: 78, remediation: 30, reporting: 0 },
  },
  {
    id: "SCAN-003",
    targetUrl: "https://juice-shop.local",
    status: "completed",
    startedAt: "2026-02-25T09:00:00Z",
    completedAt: "2026-02-25T09:30:00Z",
    vulnCount: { critical: 3, high: 1, medium: 2, low: 3, info: 1 },
    riskScore: 9.1,
    agentProgress: { detection: 100, remediation: 100, reporting: 100 },
  },
];

export const agentLogs: AgentLog[] = [
  { id: "1", agent: "detection", message: "Crawling target: https://juice-shop.local", timestamp: "2026-02-27T10:20:00Z", level: "info" },
  { id: "2", agent: "detection", message: "Discovered 47 endpoints via sitemap + JS analysis", timestamp: "2026-02-27T10:21:30Z", level: "success" },
  { id: "3", agent: "detection", message: "Injecting SQL payloads on /rest/user/login", timestamp: "2026-02-27T10:22:00Z", level: "info" },
  { id: "4", agent: "detection", message: "CRITICAL: SQL Injection confirmed on login endpoint", timestamp: "2026-02-27T10:23:00Z", level: "error" },
  { id: "5", agent: "detection", message: "Testing XSS vectors on search functionality", timestamp: "2026-02-27T10:24:00Z", level: "info" },
  { id: "6", agent: "detection", message: "HIGH: Reflected XSS confirmed in search parameter", timestamp: "2026-02-27T10:25:00Z", level: "warning" },
  { id: "7", agent: "remediation", message: "Analyzing VULN-001: SQL Injection - Mapping to OWASP A03:2021", timestamp: "2026-02-27T10:26:00Z", level: "info" },
  { id: "8", agent: "remediation", message: "Generated patch for SQL Injection using parameterized queries", timestamp: "2026-02-27T10:27:00Z", level: "success" },
  { id: "9", agent: "remediation", message: "CVSS v3.1 calculated: 9.8 (Critical) for VULN-001", timestamp: "2026-02-27T10:28:00Z", level: "info" },
  { id: "10", agent: "reporting", message: "Generating executive summary report", timestamp: "2026-02-27T10:40:00Z", level: "info" },
  { id: "11", agent: "reporting", message: "Technical report generated: 6 findings, 2 critical", timestamp: "2026-02-27T10:42:00Z", level: "success" },
  { id: "12", agent: "reporting", message: "PDF/HTML/JSON exports ready for download", timestamp: "2026-02-27T10:43:00Z", level: "success" },
];

export const riskTrendData = [
  { date: "Feb 21", score: 7.2 },
  { date: "Feb 22", score: 6.8 },
  { date: "Feb 23", score: 8.1 },
  { date: "Feb 24", score: 7.5 },
  { date: "Feb 25", score: 9.1 },
  { date: "Feb 26", score: 6.3 },
  { date: "Feb 27", score: 8.4 },
];

export const severityDistribution = [
  { name: "Critical", value: 2, fill: "hsl(0, 72%, 51%)" },
  { name: "High", value: 2, fill: "hsl(38, 92%, 50%)" },
  { name: "Medium", value: 1, fill: "hsl(200, 95%, 55%)" },
  { name: "Low", value: 1, fill: "hsl(160, 84%, 39%)" },
];

export const owaspDistribution = [
  { category: "A01: Access Control", count: 2 },
  { category: "A03: Injection", count: 2 },
  { category: "A05: Misconfiguration", count: 1 },
  { category: "A07: Auth Failures", count: 1 },
];

export function getSeverityColor(severity: Severity): string {
  switch (severity) {
    case "Critical": return "text-destructive";
    case "High": return "text-warning";
    case "Medium": return "text-info";
    case "Low": return "text-success";
    case "Info": return "text-muted-foreground";
  }
}

export function getSeverityBg(severity: Severity): string {
  switch (severity) {
    case "Critical": return "bg-destructive/15 text-destructive border-destructive/30";
    case "High": return "bg-warning/15 text-warning border-warning/30";
    case "Medium": return "bg-info/15 text-info border-info/30";
    case "Low": return "bg-success/15 text-success border-success/30";
    case "Info": return "bg-muted text-muted-foreground border-border";
  }
}

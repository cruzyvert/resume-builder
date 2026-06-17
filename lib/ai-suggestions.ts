const ACTION_VERBS = ["Led", "Developed", "Managed", "Created", "Implemented", "Designed", "Achieved", "Increased", "Reduced", "Streamlined", "Coordinated", "Delivered", "Built", "Launched", "Optimized", "Automated", "Spearheaded", "Collaborated", "Analyzed", "Improved"];

const BULLET_TEMPLATES: Record<string, string[]> = {
  default: [
    "Led cross-functional team of X members to deliver [project] on time and under budget",
    "Developed and implemented [solution] resulting in X% improvement in [metric]",
    "Managed [scope] across X projects, consistently meeting deadlines and quality standards",
    "Created [deliverable] that increased [metric] by X% within [timeframe]",
    "Streamlined [process] reducing [metric] by X% and saving X hours per week",
  ],
  engineer: [
    "Built [system/feature] using [technology] serving X users/requests per day",
    "Optimized [system] reducing latency by X% and improving throughput by X%",
    "Designed and implemented [architecture] supporting X concurrent users",
    "Automated [process] saving X hours per week and reducing errors by X%",
    "Led migration of [system] to [platform] with zero downtime",
  ],
  manager: [
    "Managed team of X direct reports, achieving X% employee retention rate",
    "Delivered $[budget] project on time and X% under budget",
    "Increased team productivity by X% through process improvements and tooling",
    "Hired and onboarded X new team members within [timeframe]",
    "Implemented [initiative] resulting in X% improvement in team satisfaction",
  ],
};

export function generateBullets(jobTitle: string, description: string): string[] {
  const title = jobTitle.toLowerCase();
  let pool = BULLET_TEMPLATES.default;
  if (title.includes("engineer") || title.includes("developer") || title.includes("programmer")) pool = BULLET_TEMPLATES.engineer;
  else if (title.includes("manager") || title.includes("lead") || title.includes("director")) pool = BULLET_TEMPLATES.manager;

  // Shuffle and pick 4
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

export function improveBullet(bullet: string): string {
  let improved = bullet.trim();

  // Capitalize first letter
  improved = improved.charAt(0).toUpperCase() + improved.slice(1);

  // Add action verb if missing
  const first = improved.split(" ")[0]?.toLowerCase();
  if (!ACTION_VERBS.some(v => v.toLowerCase() === first)) {
    const verb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
    improved = `${verb} ${improved.charAt(0).toLowerCase() + improved.slice(1)}`;
  }

  // Add period if missing
  if (!improved.endsWith(".") && !improved.endsWith("!") && !improved.endsWith("?")) {
    improved += ".";
  }

  // Suggest adding metrics if no numbers
  if (!/\d/.test(improved)) {
    improved += " (consider adding a metric like % improvement or $ impact)";
  }

  return improved;
}

export function improveSummary(summary: string): string {
  let improved = summary.trim();
  if (!improved.endsWith(".")) improved += ".";

  const suggestions = [
    "Consider mentioning years of experience.",
    "Add your key technical skills or areas of expertise.",
    "Include a career goal or what you're looking for next.",
    "Quantify your impact where possible (team size, revenue, users).",
  ];

  return `${improved}\n\nSuggestions:\n${suggestions.map(s => `• ${s}`).join("\n")}`;
}

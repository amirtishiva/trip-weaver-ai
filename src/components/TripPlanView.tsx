import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Train, Hotel, Utensils, Map } from "lucide-react";

interface TripPlanViewProps {
  planContent: string;
  tripTitle: string;
}

interface TableData {
  headers: string[];
  rows: string[][];
}

const parsePlanToTables = (content: string): { title: string; tables: { sectionTitle: string; data: TableData }[]; rawSections: { title: string; content: string }[] } => {
  const lines = content.split("\n");
  const tables: { sectionTitle: string; data: TableData }[] = [];
  const rawSections: { title: string; content: string }[] = [];

  // Try to find pipe-delimited tables first
  let i = 0;
  let currentSection = "";

  while (i < lines.length) {
    const line = lines[i].trim();

    // Detect section headers (lines starting with ## or all caps or ending with :)
    if (line.match(/^#{1,3}\s+/) || (line.length > 3 && line.endsWith(":") && !line.includes("|"))) {
      currentSection = line.replace(/^#{1,3}\s+/, "").replace(/:$/, "").trim();
      i++;
      continue;
    }

    // Detect pipe-delimited table
    if (line.includes("|") && line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().includes("|") && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const parseRow = (row: string) =>
          row.split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());

        const isSep = (row: string) => /^\|[\s\-:|]+\|$/.test(row);
        const headers = parseRow(tableLines[0]);
        const dataStart = isSep(tableLines[1]) ? 2 : 1;
        const rows = tableLines.slice(dataStart).filter(l => !isSep(l)).map(parseRow);

        tables.push({ sectionTitle: currentSection || "Trip Details", data: { headers, rows } });
        continue;
      }
    }

    // Collect non-table content
    if (line.length > 0 && !line.match(/^[-]+$/) && !line.startsWith("---")) {
      const cleanLine = line.replace(/#/g, "").trim();
      if (cleanLine) {
        const existing = rawSections.find(s => s.title === (currentSection || "Overview"));
        if (existing) {
          existing.content += "\n" + cleanLine;
        } else {
          rawSections.push({ title: currentSection || "Overview", content: cleanLine });
        }
      }
    }

    i++;
  }

  return { title: currentSection, tables, rawSections };
};

const downloadPDF = (planContent: string, tripTitle: string) => {
  // Create a printable HTML document and trigger print/save as PDF
  const parsed = parsePlanToTables(planContent);

  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${tripTitle} - Trip Plan</title>
<style>
body { font-family: Arial, sans-serif; margin: 40px; color: #222; font-size: 12px; }
h1 { font-size: 20px; border-bottom: 2px solid #1a73e8; padding-bottom: 8px; color: #1a73e8; }
h2 { font-size: 14px; margin-top: 24px; color: #333; }
table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 11px; }
th { background: #1a73e8; color: white; padding: 8px 6px; text-align: left; font-weight: 600; }
td { padding: 6px; border: 1px solid #ddd; vertical-align: top; }
tr:nth-child(even) { background: #f8f9fa; }
p { margin: 4px 0; line-height: 1.5; }
.section { margin-bottom: 16px; }
@media print { body { margin: 20px; } }
</style></head><body>`;

  html += `<h1>${tripTitle} - AI Trip Plan</h1>`;

  // Render raw sections
  parsed.rawSections.forEach(section => {
    html += `<div class="section"><h2>${section.title}</h2>`;
    section.content.split("\n").forEach(line => {
      if (line.trim()) html += `<p>${line.trim()}</p>`;
    });
    html += `</div>`;
  });

  // Render tables
  parsed.tables.forEach(table => {
    html += `<div class="section"><h2>${table.sectionTitle}</h2><table>`;
    html += `<tr>${table.data.headers.map(h => `<th>${h}</th>`).join("")}</tr>`;
    table.data.rows.forEach(row => {
      html += `<tr>${row.map(c => `<td>${c}</td>`).join("")}</tr>`;
    });
    html += `</table></div>`;
  });

  // If no tables were found, render all content as-is
  if (parsed.tables.length === 0 && parsed.rawSections.length === 0) {
    const cleanContent = planContent.replace(/#/g, "");
    cleanContent.split("\n").forEach(line => {
      if (line.trim()) html += `<p>${line.trim()}</p>`;
    });
  }

  html += `</body></html>`;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }
};

const renderFormattedText = (text: string) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-semibold text-foreground">{part}</strong>;
    }
    return <span key={i}>{part.replace(/\*/g, "")}</span>;
  });
};

const TripPlanView = ({ planContent, tripTitle }: TripPlanViewProps) => {
  const parsed = parsePlanToTables(planContent);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => downloadPDF(planContent, tripTitle)}>
          <Download className="h-4 w-4" /> Download PDF
        </Button>
      </div>

      {/* Render raw text sections */}
      {parsed.rawSections.map((section, i) => (
        <div key={`section-${i}`} className="mb-4">
          <h3 className="font-heading text-sm font-semibold text-foreground mb-2">{section.title}</h3>
          {section.content.split("\n").map((line, li) => (
            line.trim() ? <p key={li} className="text-sm text-muted-foreground leading-relaxed">{renderFormattedText(line.trim())}</p> : null
          ))}
        </div>
      ))}

      {/* Render tables */}
      {parsed.tables.map((table, ti) => (
        <div key={`table-${ti}`} className="mb-6">
          <h3 className="font-heading text-sm font-semibold text-foreground mb-2">{table.sectionTitle}</h3>
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary/10">
                  {table.data.headers.map((h, hi) => (
                    <th key={hi} className="px-3 py-2 text-left text-xs font-semibold text-foreground border-b border-border whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.data.rows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 text-xs text-muted-foreground border-b border-border">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Fallback: render plain text if no tables found */}
      {parsed.tables.length === 0 && parsed.rawSections.length === 0 && (
        <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {planContent.replace(/#/g, "").split("\n").map((line, i) => (
             <div key={i}>{renderFormattedText(line)}</div>
          ))}
        </div>
      )}

      {/* External Links Section */}
      <div className="mt-12 pt-8 border-t border-border">
        <h3 className="font-heading text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-primary" /> Book Your Essentials
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Travel & Hotels */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Train className="h-4 w-4" /> Travel & Hotels
            </h4>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" className="bg-card hover:bg-primary/10 border-primary/20" onClick={() => window.open("https://www.ixigo.com/", "_blank")}>
                Ixigo
              </Button>
              <Button variant="outline" size="sm" className="bg-card hover:bg-primary/10 border-primary/20" onClick={() => window.open("https://www.makemytrip.com/", "_blank")}>
                MakeMyTrip
              </Button>
              <Button variant="outline" size="sm" className="bg-card hover:bg-primary/10 border-primary/20" onClick={() => window.open("https://whereismytrain.org/", "_blank")}>
                Where Is My Train
              </Button>
            </div>
          </div>

          {/* Restaurants & Food */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Utensils className="h-4 w-4" /> Nearby Restaurants
            </h4>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" className="bg-card hover:bg-accent/10 border-accent/20" onClick={() => window.open("https://www.zomato.com/", "_blank")}>
                Zomato
              </Button>
              <Button variant="outline" size="sm" className="bg-card hover:bg-accent/10 border-accent/20" onClick={() => window.open("https://www.swiggy.com/", "_blank")}>
                Swiggy
              </Button>
            </div>
          </div>
        </div>
        
        <p className="mt-6 text-[10px] text-muted-foreground italic text-center">
          Note: Clicking these buttons will open external websites for booking and food delivery.
        </p>
      </div>
    </div>
  );
};

export default TripPlanView;

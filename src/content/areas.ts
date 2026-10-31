/**
 * Names for the area ids hosts pick. A copy of the names in the mobile app's
 * content/lahore-areas.ts: keep both lists in step when an area is added.
 */
const areaNames: Record<string, string> = {
  "dha-1": "DHA Phase 1",
  "dha-2": "DHA Phase 2",
  "dha-3": "DHA Phase 3",
  "dha-4": "DHA Phase 4",
  "dha-5": "DHA Phase 5",
  "dha-6": "DHA Phase 6",
  "dha-7": "DHA Phase 7",
  "dha-8": "DHA Phase 8",
  "gulberg-1": "Gulberg I",
  "gulberg-2": "Gulberg II",
  "gulberg-3": "Gulberg III",
  "model-town": "Model Town",
  "garden-town": "Garden Town",
  "faisal-town": "Faisal Town",
  "johar-town": "Johar Town",
  "iqbal-town": "Allama Iqbal Town",
  township: "Township",
  "wapda-town": "Wapda Town",
  valencia: "Valencia",
  "bahria-town": "Bahria Town",
  cantt: "Cantt",
  shadman: "Shadman",
  samanabad: "Samanabad",
};

/** The area's name, or the raw id for an area this list does not know yet. */
export function areaName(id: string | null): string {
  if (!id) return "-";
  return areaNames[id] ?? id;
}

// Static team metadata used by the UI: dataset order, ISO codes for flag SVGs,
// and group letters. Order matches backend/data/teams.csv.

export const TEAM_NAMES: string[] = [
  "Argentina",
  "Brazil",
  "France",
  "England",
  "Spain",
  "Germany",
  "Portugal",
  "Netherlands",
  "Belgium",
  "Croatia",
  "Uruguay",
  "Denmark",
  "Switzerland",
  "USA",
  "Mexico",
  "Japan",
  "South Korea",
  "Morocco",
  "Senegal",
  "Nigeria",
  "Cameroon",
  "Ghana",
  "Serbia",
  "Poland",
  "Sweden",
  "Austria",
  "Turkey",
  "Iran",
  "Saudi Arabia",
  "Qatar",
  "Canada",
  "Australia",
];

// ISO 3166-1 alpha-2 (lower-case) for flagcdn.com.
// England uses the 'gb-eng' subdivision file for the St George's Cross.
export const TEAM_ISO: Record<string, string> = {
  Argentina: "ar",
  Brazil: "br",
  France: "fr",
  England: "gb-eng",
  Spain: "es",
  Germany: "de",
  Portugal: "pt",
  Netherlands: "nl",
  Belgium: "be",
  Croatia: "hr",
  Uruguay: "uy",
  Denmark: "dk",
  Switzerland: "ch",
  USA: "us",
  Mexico: "mx",
  Japan: "jp",
  "South Korea": "kr",
  Morocco: "ma",
  Senegal: "sn",
  Nigeria: "ng",
  Cameroon: "cm",
  Ghana: "gh",
  Serbia: "rs",
  Poland: "pl",
  Sweden: "se",
  Austria: "at",
  Turkey: "tr",
  Iran: "ir",
  "Saudi Arabia": "sa",
  Qatar: "qa",
  Canada: "ca",
  Australia: "au",
};

// Three-letter codes used as broadcast-style team abbreviations.
export const TEAM_ABBR: Record<string, string> = {
  Argentina: "ARG",
  Brazil: "BRA",
  France: "FRA",
  England: "ENG",
  Spain: "ESP",
  Germany: "GER",
  Portugal: "POR",
  Netherlands: "NED",
  Belgium: "BEL",
  Croatia: "CRO",
  Uruguay: "URU",
  Denmark: "DEN",
  Switzerland: "SUI",
  USA: "USA",
  Mexico: "MEX",
  Japan: "JPN",
  "South Korea": "KOR",
  Morocco: "MAR",
  Senegal: "SEN",
  Nigeria: "NGA",
  Cameroon: "CMR",
  Ghana: "GHA",
  Serbia: "SRB",
  Poland: "POL",
  Sweden: "SWE",
  Austria: "AUT",
  Turkey: "TUR",
  Iran: "IRN",
  "Saudi Arabia": "KSA",
  Qatar: "QAT",
  Canada: "CAN",
  Australia: "AUS",
};

export function isoOf(team: string): string {
  return TEAM_ISO[team] ?? "";
}

export function abbrOf(team: string): string {
  return TEAM_ABBR[team] ?? team.slice(0, 3).toUpperCase();
}

export const GROUP_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

export function groupOf(team: string): string {
  const idx = TEAM_NAMES.indexOf(team);
  if (idx < 0) return "?";
  return GROUP_LETTERS[Math.floor(idx / 4)] ?? "?";
}

export function groupedTeams(): Array<{ letter: string; teams: string[] }> {
  return GROUP_LETTERS.map((letter, i) => ({
    letter,
    teams: TEAM_NAMES.slice(i * 4, i * 4 + 4),
  }));
}

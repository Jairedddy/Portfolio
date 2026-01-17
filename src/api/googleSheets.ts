/**
 * Google Sheets API Integration for Projects
 * 
 * This module fetches project data from a public Google Sheet.
 * 
 * Setup Instructions:
 * 1. Create a Google Sheet with the following columns (in order):
 *    - title (string)
 *    - description (string)
 *    - tech (comma-separated string, e.g., "React,TypeScript,Vite")
 *    - category (string)
 *    - color (string: "purple", "green", "cyan", "orange", "pink", "red")
 *    - github (string: URL)
 *    - live (string: URL, optional - leave empty if no live demo)
 * 
 * 2. Publish the sheet to the web:
 *    - File > Share > Publish to web
 *    - Select the sheet tab
 *    - Choose "Comma-separated values (.csv)" format
 *    - Click "Publish"
 *    - Copy the published URL
 * 
 * 3. Convert the published URL to a CSV endpoint:
 *    - Replace the URL format from:
 *      https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit?gid={GID}#gid={GID}
 *    - To:
 *      https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={GID}
 * 
 * 4. Set the environment variable:
 *    - Add VITE_GOOGLE_SHEETS_PROJECTS_URL to your .env file
 *    - Or use the direct URL in the code below
 * 
 * Alternative: Use Google Sheets API v4 (requires API key)
 * - More reliable but requires authentication
 * - See: https://developers.google.com/sheets/api
 */

export interface ProjectFromSheet {
  title: string;
  description: string;
  tech: string[];
  category: string;
  color: string;
  github: string;
  live?: string;
}

const parseCSV = (csvText: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentCell += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of cell
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // End of row
      if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        currentCell = '';
        rows.push(currentRow);
        currentRow = [];
      }
      // Skip \r\n combination
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
    } else {
      currentCell += char;
    }
  }

  // Add last cell and row
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }

  return rows;
};

const parseProjectsFromCSV = (csvText: string): ProjectFromSheet[] => {
  const rows = parseCSV(csvText);
  
  if (rows.length < 2) {
    console.warn('[Google Sheets] No data rows found');
    return [];
  }

  // First row is headers, skip it
  const dataRows = rows.slice(1);
  const projects: ProjectFromSheet[] = [];

  for (const row of dataRows) {
    // Skip empty rows
    if (row.length === 0 || !row[0]?.trim()) {
      continue;
    }

    try {
      const project: ProjectFromSheet = {
        title: row[0]?.trim() || '',
        description: row[1]?.trim() || '',
        tech: row[2]?.split(',').map(t => t.trim()).filter(Boolean) || [],
        category: row[3]?.trim() || 'Web Development',
        color: row[4]?.trim() || 'cyan',
        github: row[5]?.trim() || '',
        live: row[6]?.trim() || undefined,
      };

      // Validate required fields
      if (project.title && project.github) {
        projects.push(project);
      } else {
        console.warn('[Google Sheets] Skipping invalid project row:', row);
      }
    } catch (error) {
      console.error('[Google Sheets] Error parsing project row:', error, row);
    }
  }

  return projects;
};

/**
 * Fetches projects from a published Google Sheet
 * @param sheetUrl - The published Google Sheet CSV export URL
 * @returns Array of projects or null if fetch fails
 */
export const fetchProjectsFromGoogleSheet = async (
  sheetUrl?: string
): Promise<ProjectFromSheet[] | null> => {
  const url = sheetUrl || (import.meta as ImportMeta & { env?: { VITE_GOOGLE_SHEETS_PROJECTS_URL?: string } }).env?.VITE_GOOGLE_SHEETS_PROJECTS_URL;

  if (!url) {
    console.warn('[Google Sheets] No sheet URL provided');
    return null;
  }

  try {
    const response = await fetch(url, {
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const csvText = await response.text();
    const projects = parseProjectsFromCSV(csvText);

    console.log(`[Google Sheets] Successfully loaded ${projects.length} projects`);
    return projects;
  } catch (error) {
    console.error('[Google Sheets] Failed to fetch projects:', error);
    return null;
  }
};

/**
 * Alternative: Fetch using Google Sheets API v4
 * Requires API key and proper setup
 * 
 * @param sheetId - The Google Sheet ID
 * @param apiKey - Google Sheets API key
 * @param range - Sheet range (e.g., "Sheet1!A1:H100")
 */
export const fetchProjectsFromGoogleSheetsAPI = async (
  sheetId: string,
  apiKey: string,
  range: string = 'Sheet1!A2:G1000' // Skip header row
): Promise<ProjectFromSheet[] | null> => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const rows = data.values || [];

    const projects: ProjectFromSheet[] = [];

    for (const row of rows) {
      if (!row[0]?.trim()) continue; // Skip empty rows

      try {
        const project: ProjectFromSheet = {
          title: row[0]?.trim() || '',
          description: row[1]?.trim() || '',
          tech: row[2]?.split(',').map((t: string) => t.trim()).filter(Boolean) || [],
          category: row[3]?.trim() || 'Web Development',
          color: row[4]?.trim() || 'cyan',
          github: row[5]?.trim() || '',
          live: row[6]?.trim() || undefined,
        };

        if (project.title && project.github) {
          projects.push(project);
        }
      } catch (error) {
        console.error('[Google Sheets API] Error parsing row:', error, row);
      }
    }

    console.log(`[Google Sheets API] Successfully loaded ${projects.length} projects`);
    return projects;
  } catch (error) {
    console.error('[Google Sheets API] Failed to fetch projects:', error);
    return null;
  }
};

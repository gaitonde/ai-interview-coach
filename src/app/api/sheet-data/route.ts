import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function GET() {
  console.log('Fetching sheet data');
  try {
    if (!GOOGLE_SHEET_ID) {
      throw new Error('GOOGLE_SHEET_ID is not defined');
    }
    // Create a JWT client
    const serviceAccountAuth = new JWT({
      email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets.readonly',
      ],
    });

    // Initialize the sheet
    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, serviceAccountAuth);

    // Load the document properties and worksheets
    await doc.loadInfo();

    // Get the first sheet in the document
    const sheet = doc.sheetsByIndex[0];

    // Load all rows
    const rows = await sheet.getRows();

    // Transform rows into a more manageable format
    const data = rows.map(row => {
      const rowData: { [key: string]: string } = {};
      sheet.headerValues.forEach(header => {
        rowData[header] = row.get(header);
      });
      return rowData;
    });

    // Return the data as JSON
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch sheet data' }, { status: 500 });
  }
}

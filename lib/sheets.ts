const SHEET_WEBHOOK = 'https://script.google.com/macros/s/AKfycbxzxAcxeNJXzQ_E6HKFY4htnW3vva5W3jh8eqA3CO_xhKM7aSDnhCYMp2osGIBLW7DPJw/exec';

const SOURCE_LABEL: Record<string, string> = {
  exit_intent: 'Offer Popup (20% OFF)',
  enquiry_form: 'Enquiry Form',
  contact_form: 'Contact Us Page',
  website: 'Website',
};

export async function appendLeadToSheet(data: {
  name?: string;
  email?: string;
  phone?: string;
  source: string;
  message?: string;
}) {
  try {
    const payload = JSON.stringify({
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name: data.name || '',
      phone: data.phone || '',
      email: data.email || '',
      source: SOURCE_LABEL[data.source] || data.source,
      message: data.message || '',
    });

    // Google Apps Script doesn't support CORS preflight.
    // text/plain + no-cors skips the preflight and delivers the body as-is.
    await fetch(SHEET_WEBHOOK, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: payload,
    });
  } catch (e) {
    console.error('[Sheets] Failed to append lead:', e);
  }
}

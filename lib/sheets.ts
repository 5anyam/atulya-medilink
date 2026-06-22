const SHEET_WEBHOOK = 'https://script.google.com/macros/s/AKfycbyLo46Rio6jMyToj12Rq8lUdqzjXb_GDsZP_I8we5czJ7OSbIYM5itu1DKi1b1LJ1P59g/exec';

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
    await fetch(SHEET_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        source: SOURCE_LABEL[data.source] || data.source,
        message: data.message || '',
      }),
    });
  } catch (e) {
    console.error('[Sheets] Failed to append lead:', e);
  }
}

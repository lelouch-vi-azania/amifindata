import axios from 'axios';

// Function to call the LLM API
async function callLLM(prompt: string): Promise<string> {
  const response = await axios.post('https://api.llmprovider.com/v1/completions', {
    prompt: prompt,
    max_tokens: 1000,
    temperature: 0.7,
  }, {
    headers: {
      'Authorization': `Bearer YOUR_API_KEY`,
      'Content-Type': 'application/json',
    },
  });

  return response.data.choices[0].text.trim();
}

// Function to parse CSV file using LLM
export async function parseCSV(file: File): Promise<any[]> {
  const text = await file.text();
  const prompt = `Parse the following CSV data and extract the date, time, amount (in South African Rands), category, and sub-category:

CSV Data:
${text}

Parsed Data:`;

  const parsedData = await callLLM(prompt);
  return JSON.parse(parsedData);
}

// Function to parse invoice file using LLM
export async function parseInvoice(file: File): Promise<any> {
  const text = await file.text();
  const prompt = `Extract the date, time, amount (in South African Rands), category, and sub-category from the following invoice text:

Invoice Text:
${text}

Parsed Data:`;

  const parsedData = await callLLM(prompt);
  return JSON.parse(parsedData);
}

// Function to parse receipt file using LLM
export async function parseReceipt(file: File): Promise<any> {
  const text = await file.text();
  const prompt = `Extract the date, time, amount (in South African Rands), category, and sub-category from the following receipt text:

Receipt Text:
${text}

Parsed Data:`;

  const parsedData = await callLLM(prompt);
  return JSON.parse(parsedData);
}

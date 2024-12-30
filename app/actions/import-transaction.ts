'use server'

import { parseCSV, parseInvoice, parseReceipt } from '@/lib/parsers'

export async function importTransaction(formData: FormData) {
  const file = formData.get('file') as File
  const fileType = formData.get('fileType') as string

  if (!file) {
    return { error: 'No file uploaded' }
  }

  let parsedData

  switch (fileType) {
    case 'bankStatement':
      parsedData = await parseCSV(file)
      break
    case 'invoice':
      parsedData = await parseInvoice(file)
      break
    case 'receipt':
      parsedData = await parseReceipt(file)
      break
    default:
      return { error: 'Invalid file type' }
  }

  // Here you would typically save the parsed data to your database
  // For now, we'll just return it to be handled by the client
  return { data: parsedData }
}


'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { importTransaction } from '@/app/actions/import-transaction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const transactionSchema = z.object({
  date: z.string(),
  time: z.string(),
  amount: z.number().positive(),
  type: z.enum(['income', 'expense']),
  category: z.string(),
  subcategory: z.string(),
  description: z.string().optional(),
})

type TransactionData = z.infer<typeof transactionSchema>

const categories = {
  income: ['Salary/wages', 'Bonuses and commissions', 'Investment income', 'Side business revenue'],
  expense: [
    'Housing & Utilities',
    'Transportation',
    'Food & Groceries',
    'Healthcare',
    'Personal Care',
    'Savings & Financial Goals',
    'Insurance & Protection',
    'Entertainment & Recreation',
    'Miscellaneous',
  ],
}

const subcategories = {
  'Housing & Utilities': ['Rent/mortgage payments', 'Electricity, water, gas', 'Internet and phone', 'Home maintenance/repairs', 'Home insurance', 'Property taxes'],
  'Transportation': ['Car payment', 'Auto insurance', 'Gas/fuel', 'Vehicle maintenance', 'Public transit/rideshare', 'Parking fees'],
  'Food & Groceries': ['Groceries', 'Restaurants/takeout', 'Coffee shops', 'Meal delivery'],
  'Healthcare': ['Health insurance premiums', 'Medications', 'Doctor visits', 'Dental care', 'Vision care', 'Medical supplies'],
  'Personal Care': ['Haircuts/grooming', 'Clothing', 'Laundry/dry cleaning', 'Gym membership', 'Personal hygiene items'],
  'Savings & Financial Goals': ['Emergency fund', 'Retirement accounts', 'Investment contributions', 'Specific savings goals', 'Debt repayment'],
  'Insurance & Protection': ['Life insurance', 'Disability insurance', 'Renters/homeowners insurance', 'Identity theft protection'],
  'Entertainment & Recreation': ['Streaming services', 'Hobbies', 'Movies/concerts/events', 'Sports/recreation', 'Books/media'],
  'Miscellaneous': ['Gifts', 'Charitable donations', 'Pet expenses', 'Education/courses', 'Professional dues', 'Banking fees'],
}

export function TransactionImport() {
  const [fileType, setFileType] = useState<string>('bankStatement')
  const [importedData, setImportedData] = useState<TransactionData | null>(null)

  const form = useForm<TransactionData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      amount: 0,
      type: 'expense',
      category: '',
      subcategory: '',
      description: '',
    },
  })

  const onSubmit = (data: TransactionData) => {
    console.log(data)
    // Here you would typically save the transaction to your database
    // and update the application state
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileType', fileType)

    const result = await importTransaction(formData)

    if (result.error) {
      console.error(result.error)
    } else if (result.data) {
      setImportedData(result.data)
      form.reset(result.data)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Import Transaction</h1>
      
      <div className="mb-4">
        <Select onValueChange={(value) => setFileType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select file type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bankStatement">Bank Statement</SelectItem>
            <SelectItem value="invoice">Invoice</SelectItem>
            <SelectItem value="receipt">Receipt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Input type="file" onChange={handleFileUpload} accept=".csv,.pdf,.jpg,.png" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (ZAR)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories[form.watch('type')].map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subcategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {form.watch('category') && subcategories[form.watch('category') as keyof typeof subcategories]?.map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory}>
                        {subcategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Optional additional details about the transaction</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Save Transaction</Button>
        </form>
      </Form>
    </div>
  )
}


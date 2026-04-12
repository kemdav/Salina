'use client';

import { useState } from 'react';
import { provisionOrganization } from '@/lib/actions/provisioning';
import type { ProvisionOrganizationResult } from '@/lib/actions/provisioning';

export default function SandboxPage() {
  const [result, setResult] = useState<ProvisionOrganizationResult | null>(null);

  async function handleTestSubmit(formData: FormData) {
  try {
    const res = await provisionOrganization({
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      billingEmail: formData.get('email') as string,
      organizationType: formData.get('organizationType') as string,
    });
    setResult(res);
  } catch (error) {
    setResult({
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      ok: false,
    });
  }
}

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Provisioning</h1>
      
      <form action={handleTestSubmit} className="flex flex-col gap-4">
        <input name="name" placeholder="Organization Name (e.g., Tech Club)" className="border p-2 rounded" required />
        <input name="slug" placeholder="Slug (e.g., tech-club)" className="border p-2 rounded" required />
        <input name="email" type="email" placeholder="Billing Email" className="border p-2 rounded" required />
        <select name="organizationType" className="border p-2 rounded" defaultValue="Other" required>
          <option value="Business / Corporation">Business / Corporation</option>
          <option value="Non-Profit Organization">Non-Profit Organization</option>
          <option value="Association / Society">Association / Society</option>
          <option value="Academic Institution">Academic Institution</option>
          <option value="Government Agency">Government Agency</option>
          <option value="Other">Other</option>
        </select>
        
        <button type="submit" className="bg-[#C6623E] text-white p-2 rounded font-bold">
          Run Server Action
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Result:</h3>
          <pre className="text-sm mt-2">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
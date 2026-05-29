import { getAdvisers } from "@/lib/actions/advisers";

export const dynamic = "force-dynamic";

export default async function AdviserDirectoryPage() {
  const { data: advisers, count } = await getAdvisers({ limit: 100 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Adviser Directory</h2>
        <div className="text-sm text-stone-500">{count} total advisers</div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="px-6 py-4 font-medium text-stone-900">Name</th>
              <th className="px-6 py-4 font-medium text-stone-900">Organization</th>
              <th className="px-6 py-4 font-medium text-stone-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {advisers.map((adviser) => (
              <tr key={adviser.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-stone-900">{adviser.name}</td>
                <td className="px-6 py-4 text-stone-600">
                  {adviser.organization_name || <span className="italic text-stone-400">None</span>}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                    ${adviser.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                    ${adviser.status === 'pending' ? 'bg-amber-100 text-amber-800' : ''}
                    ${adviser.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                    ${adviser.status === 'invited' ? 'bg-stone-100 text-stone-800' : ''}
                  `}>
                    {adviser.status.charAt(0).toUpperCase() + adviser.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
            {advisers.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-stone-500">
                  No advisers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

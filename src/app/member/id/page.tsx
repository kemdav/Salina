import { getMemberIdData } from "./actions";
import { MemberDigitalIdClient } from "./client-page";

export default async function MemberDigitalIdPage() {
  const data = await getMemberIdData();

  if (!data) {
    return (
      <div className="w-full max-w-5xl mx-auto py-16 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 max-w-md w-full text-center">
          <svg
            className="w-12 h-12 text-slate-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-lg font-bold text-slate-800 mb-2">
            Digital ID Not Available
          </h2>
          <p className="text-sm text-slate-600">
            Your digital ID has not been generated yet or is currently inactive.
            Please contact your organization administrator.
          </p>
        </div>
      </div>
    );
  }

  return <MemberDigitalIdClient data={data} />;
}

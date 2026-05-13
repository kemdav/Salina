import type { ReactNode } from "react";

import { SalinaLogo } from "@/components/atoms/salina-logo";
import { AuthFooter } from "@/components/organisms/auth-footer";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen [font-family:var(--font-body)]">
      <aside
        className="hidden w-[38%] shrink-0 bg-[#111111] lg:flex lg:flex-col"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="p-10">
          <SalinaLogo variant="dark" width={110} />
        </div>
        <div className="flex flex-1 flex-col justify-center px-12">
          <p className="max-w-xs text-[32px] font-bold leading-[1.2] tracking-[-0.5px] text-white [font-family:var(--font-heading)]">
            Where organizations operate.
          </p>
          <p className="mt-3 max-w-65 text-[15px] leading-[1.65] text-white/45">
            From recruitment to roster, everything your organization needs, in
            one place.
          </p>
        </div>
      </aside>

      <main className="flex flex-1 flex-col bg-[#FEFEFE]">
        <div className="flex flex-1 items-center justify-center py-6">
          <div className="w-full max-w-110 px-6">{children}</div>
        </div>
        <AuthFooter bordered />
      </main>
    </div>
  );
}

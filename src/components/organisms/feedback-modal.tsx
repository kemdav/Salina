import { cn } from "@/lib/utils";

export type FeedbackTone = "error" | "warning" | "success" | "info";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  tone?: FeedbackTone;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
  primaryColor?: string;
  actions?: {
    label: string;
    onClick: () => void;
    isPrimary?: boolean;
  }[];
}

export function FeedbackModal({
  isOpen,
  onClose,
  tone = "info",
  title,
  message,
  confirmText = "Okay",
  cancelText = "Cancel",
  onConfirm,
  showCancel = false,
  primaryColor,
  actions,
}: FeedbackModalProps) {
  if (!isOpen) return null;

  // Determine if we should override the default colors with the tenant's brand color
  const isBrandThemed =
    !!primaryColor && (tone === "info" || tone === "success");

  // Dynamic configuration based on the tone
  const toneConfig = {
    error: {
      icon: (
        <svg
          className="w-6 h-6 text-rose-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      bgClass: "bg-rose-100",
      buttonClass: "bg-rose-600 hover:bg-rose-700 text-white shadow-md",
    },
    warning: {
      icon: (
        <svg
          className="w-6 h-6 text-amber-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgClass: "bg-amber-100",
      buttonClass: "bg-amber-500 hover:bg-amber-600 text-white shadow-md",
    },
    success: {
      icon: (
        <svg
          className={cn("w-6 h-6", isBrandThemed ? "" : "text-emerald-600")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
      bgClass: "bg-emerald-100",
      buttonClass: isBrandThemed
        ? "text-white shadow-md hover:opacity-90 transition-opacity"
        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md",
    },
    info: {
      icon: (
        <svg
          className={cn("w-6 h-6", isBrandThemed ? "" : "text-slate-700")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgClass: "bg-slate-100",
      buttonClass: isBrandThemed
        ? "text-white shadow-md hover:opacity-90 transition-opacity"
        : "bg-slate-900 hover:bg-slate-800 text-white shadow-md",
    },
  };

  const config = toneConfig[tone];

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-100 animate-in fade-in zoom-in-75 slide-in-from-bottom-8 duration-300 ease-out">
        <div className="p-6 sm:p-8 text-center sm:text-left sm:flex sm:items-start sm:gap-5">
          <div
            className={cn(
              "mx-auto sm:mx-0 flex items-center justify-center shrink-0 w-14 h-14 rounded-full mb-5 sm:mb-0 shadow-sm border border-white",
              !isBrandThemed && config.bgClass,
            )}
            style={
              isBrandThemed
                ? {
                    color: primaryColor,
                    backgroundColor: `${primaryColor}1A`,
                  }
                : {}
            }
          >
            {config.icon}
          </div>

          {/* Text Content */}
          <div className="flex-1 mt-1">
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-[family:var(--font-heading)] leading-tight">
              {title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 flex-wrap">
          {showCancel && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors w-full sm:w-auto"
            >
              {cancelText}
            </button>
          )}
          {actions ? (
            actions.map((action, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  action.onClick();
                  onClose();
                }}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold w-full sm:w-auto transition-colors",
                  action.isPrimary
                    ? config.buttonClass
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
                )}
                style={
                  action.isPrimary && isBrandThemed
                    ? { backgroundColor: primaryColor }
                    : {}
                }
              >
                {action.label}
              </button>
            ))
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold w-full sm:w-auto",
                config.buttonClass,
              )}
              style={isBrandThemed ? { backgroundColor: primaryColor } : {}}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

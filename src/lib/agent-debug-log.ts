type AgentDebugPayload = {
  runId?: string;
  hypothesisId?: string;
  location: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp?: number;
};

export function agentDebugLog(payload: AgentDebugPayload) {
  const body = JSON.stringify({
    sessionId: "40e615",
    timestamp: Date.now(),
    ...payload,
  });

  fetch("/api/debug-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }).catch(() => {});

  fetch("http://127.0.0.1:7312/ingest/c916d708-7efa-4840-98f9-377d13f6a1cf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "40e615",
    },
    body,
  }).catch(() => {});
}

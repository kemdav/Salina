import { appendFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const line =
      JSON.stringify({
        ...body,
        timestamp: body.timestamp ?? Date.now(),
      }) + "\n";
    appendFileSync(join(process.cwd(), "debug-40e615.log"), line, "utf8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

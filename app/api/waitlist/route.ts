import { NextRequest } from "next/server";

import { handleWaitlistRequest } from "@/lib/waitlist-handler";

export async function POST(request: NextRequest) {
  return handleWaitlistRequest(request);
}

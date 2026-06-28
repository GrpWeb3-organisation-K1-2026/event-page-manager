import { NextRequest, NextResponse } from "next/server";
import { speakerService } from "@/app/lib/service/speaker.service";
import { handleSpeakerError } from "@/app/lib/http/speaker.http";
import type { CreateSpeakerDTO } from "@/app/lib/types/speaker.types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  try {
    const result = await speakerService.getAll({
      sessionId: searchParams.get("sessionId")
        ? parseInt(searchParams.get("sessionId")!, 10)
        : undefined,
      page: searchParams.get("page")
        ? parseInt(searchParams.get("page")!, 10)
        : undefined,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!, 10)
        : undefined,
    });
    const response = NextResponse.json(result);
    response.headers.set("X-Total-Count", String(result.meta.total));
    response.headers.set("Access-Control-Expose-Headers", "X-Total-Count");
    return response;
  } catch (err) {
    return handleSpeakerError(err);
  }
}

export async function POST(request: NextRequest) {
  let body: CreateSpeakerDTO;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const speaker = await speakerService.create(body);
    return NextResponse.json({ data: speaker }, { status: 201 });
  } catch (err) {
    return handleSpeakerError(err);
  }
}
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      include: {
        _count: { select: { sessions: true } },
      },
      orderBy: { startDate: "asc" },
    });

    const response = NextResponse.json({ data: events });
    response.headers.set("X-Total-Count", String(events.length));
    response.headers.set("Access-Control-Expose-Headers", "X-Total-Count");
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, startDate, endDate, place } = body;

    if (!title || !description || !startDate || !endDate || !place) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, description, startDate, endDate, place",
        },
        { status: 422 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        place,
      },
    });

    return NextResponse.json({ data: event }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
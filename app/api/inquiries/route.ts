import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const payload = {
    ...body,
    receivedAt: new Date().toISOString(),
    status: "stored-in-mock-api",
  };

  return NextResponse.json({
    success: true,
    message: "Inquiry captured successfully.",
    data: payload,
  });
}

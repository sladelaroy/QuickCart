import connectDB from "@/config/db";
import Address from "@/models/addressModel";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    await connectDB();
    if (!userId) {
      return NextResponse.json({ success: false, message: "no user id" });
    }
    const addresses = await Address.find({userId});

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

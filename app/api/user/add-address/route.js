import connectDB from "@/config/db";
import Address from "@/models/addressModel";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {userId} = getAuth(request)
    const {address} = await request.json()

    await connectDB()
    const newAddress = new Address.create({...address, userId})

    return NextResponse.json({success: true, message: "address added", newAddress})
  } catch (error) {
    return NextResponse.json({success: false, message: error.message})
  }
}
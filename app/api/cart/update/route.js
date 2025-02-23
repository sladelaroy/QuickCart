import connectDB from "@/config/db";
import User from "@/models/userModel";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(request) {
  try {
    const {userId} = getAuth(request)
    const {cartData } = await response.json()
    await connectDB()
    const user = await User.findById(userId)
    user.cartItems = cartData
    await user.save()

    return NextResponse.json({success: true, message: "Cart Updated"})
  } catch (error) {
    return NextResponse.json({success: false, message: error.message})

  }
}
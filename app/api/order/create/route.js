import { inngest } from "@/config/inngest";
import Product from "@/models/productModel";
import User from "@/models/userModel";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json()

    if (!address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    const products = await Promise.all(items.map(async (item) => {
      const product = await Product.findById(item.product);
      return product ? product.offerPrice * item.quantity : 0;
    }));
    
    const amount = products.reduce((acc, price) => acc + price, 0);
    

    await inngest.send({
      name: "order/created",
      data: {
        userId,
        items,
        amount: Number(amount + Math.floor(amount * 0.02)),
        address,
        date: Date.now()
      }
    });
    

    const user = await User.findById(userId);
    user.cartItems = {};
    await user.save();

    return NextResponse.json({ success: true, message: "Order Placed" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

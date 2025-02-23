import { inngest } from "@/config/inngest";
import Product from "@/models/productModel";
import { getAuth, User } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = request;
    if (!address || items.length > 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    const amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return acc + product.offerPrice * item.quantity;
    }, 0);

    await inngest.send({
      name: "order/created",
      data: {
        userId,
        items,
        amount: amount + Math.floor(amount * 0.02),
        address,
        date: Date.now
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

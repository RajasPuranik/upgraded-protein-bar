import { NextResponse } from "next/server";
import { createOrder } from "@/lib/firestore-orders";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, subtotal, deliveryFee, total, shippingAddress, userId, utrNumber } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!utrNumber || utrNumber.length < 12) {
      return NextResponse.json({ error: "Valid 12-digit UTR is required" }, { status: 400 });
    }

    const orderId = `FB-${Date.now().toString().slice(-6)}-${userId?.slice(0, 4) || 'GUES'}`;

    const orderData = {
      id: orderId,
      userId: userId || null,
      items,
      subtotal,
      deliveryFee,
      total,
      status: "PENDING_VERIFICATION" as const,
      shippingAddress,
      utrNumber,
    };

    await createOrder(orderData);

    // TODO: Send Email/Telegram notification to Owner here!
    console.log(`[Notification] New Order ${orderId} PENDING VERIFICATION! Check UTR: ${utrNumber}`);

    return NextResponse.json({
      success: true,
      id: orderId
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

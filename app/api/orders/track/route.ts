import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('orderId')

  if (!orderId || orderId.trim() === '') {
    return NextResponse.json(
      { error: 'orderId query parameter is required' },
      { status: 400 }
    )
  }

  if (!UUID_RE.test(orderId)) {
    return NextResponse.json(
      { error: 'Invalid order ID format' },
      { status: 400 }
    )
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { template: true },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('[track-order] DB error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

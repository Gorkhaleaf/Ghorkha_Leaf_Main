import { NextRequest, NextResponse } from 'next/server'

interface CouponData {
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minOrderValue?: number
  maxDiscount?: number
  expiryDate?: string
  usageLimit?: number
  description: string
}

// Mock coupon database
const VALID_COUPONS: Record<string, CouponData> = {
  'IDAY30': {
    code: 'IDAY30',
    discountType: 'percentage',
    discountValue: 30,
    minOrderValue: 0,
    maxDiscount: 1000,
    description: 'Independence Day Sale - 30% off sitewide'
  },
  'GORKHA10': {
    code: 'GORKHA10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 500,
    description: 'Gorkha Leaf Special - 10% off on orders above ₹500'
  },
  'WELCOME20': {
    code: 'WELCOME20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 0,
    maxDiscount: 500,
    description: 'Welcome offer - 20% off for new customers'
  },
  'FLAT100': {
    code: 'FLAT100',
    discountType: 'fixed',
    discountValue: 100,
    minOrderValue: 1000,
    description: 'Flat ₹100 off on orders above ₹1000'
  }
}

function calculateDiscount(
  cartTotal: number,
  coupon: CouponData
): { discountAmount: number; finalTotal: number } {
  let discountAmount = 0

  if (coupon.discountType === 'percentage') {
    discountAmount = (cartTotal * coupon.discountValue) / 100
    
    // Apply max discount limit if specified
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount
    }
  } else {
    // Fixed discount
    discountAmount = Math.min(coupon.discountValue, cartTotal)
  }

  const finalTotal = Math.max(0, cartTotal - discountAmount)
  
  return {
    discountAmount: Math.round(discountAmount * 100) / 100, // Round to 2 decimal places
    finalTotal: Math.round(finalTotal * 100) / 100
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { couponCode, cartTotal = 0 } = body

    // Validate coupon code
    if (!couponCode || typeof couponCode !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Coupon code is required',
          error: {
            code: 'MISSING_COUPON',
            message: 'Coupon code field is required'
          }
        },
        { status: 400 }
      )
    }

    // Validate cart total
    if (typeof cartTotal !== 'number' || cartTotal < 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid cart total',
          error: {
            code: 'INVALID_CART_TOTAL',
            message: 'Cart total must be a positive number'
          }
        },
        { status: 400 }
      )
    }

    const normalizedCouponCode = couponCode.toUpperCase().trim()

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    // Check if coupon exists
    const coupon = VALID_COUPONS[normalizedCouponCode]
    if (!coupon) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired coupon code',
          error: {
            code: 'INVALID_COUPON',
            message: 'The coupon code you entered is not valid or has expired'
          }
        },
        { status: 404 }
      )
    }

    // Check minimum order value
    if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`,
          error: {
            code: 'MIN_ORDER_NOT_MET',
            message: `Cart total must be at least ₹${coupon.minOrderValue} to use this coupon`,
            details: {
              minOrderValue: coupon.minOrderValue,
              currentTotal: cartTotal
            }
          }
        },
        { status: 400 }
      )
    }

    // Calculate discount
    const { discountAmount, finalTotal } = calculateDiscount(cartTotal, coupon)

    // Mock success response
    return NextResponse.json(
      {
        success: true,
        message: `${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : '₹'} discount applied successfully!`,
        data: {
          couponCode: normalizedCouponCode,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discountAmount,
          originalTotal: cartTotal,
          finalTotal,
          applied: true,
          timestamp: new Date().toISOString(),
          description: coupon.description,
          savings: discountAmount
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Coupon application error:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred while applying the coupon'
        }
      },
      { status: 500 }
    )
  }
}

// Handle coupon removal
export async function DELETE(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))

    return NextResponse.json(
      {
        success: true,
        message: 'Coupon removed successfully',
        data: {
          couponCode: '',
          discountAmount: 0,
          applied: false,
          timestamp: new Date().toISOString()
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Coupon removal error:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to remove coupon',
        error: {
          code: 'REMOVAL_FAILED',
          message: 'An error occurred while removing the coupon'
        }
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed',
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST and DELETE requests are supported'
      }
    },
    { status: 405 }
  )
}
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PricingFormula from '@/models/PricingFormula';
import PricingEngine from '@/lib/pricingEngine';

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();
        const {
            productData, // { length, breadth, height, weight }
            pricingFormulaId,
            quantity = 1,
            customizations = [],
            finishingOptions = [],
            isB2B = false,
            couponCode = null
        } = body;

        // Validate input
        if (!productData || !pricingFormulaId) {
            return NextResponse.json(
                { error: 'Product data and pricing formula ID are required' },
                { status: 400 }
            );
        }

        // Fetch pricing formula
        const formula = await PricingFormula.findById(pricingFormulaId);
        if (!formula || !formula.isActive) {
            return NextResponse.json(
                { error: 'Pricing formula not found or inactive' },
                { status: 404 }
            );
        }

        // Calculate price
        const pricing = PricingEngine.calculatePrice(
            productData,
            formula,
            {
                quantity,
                customizations,
                finishingOptions,
                isB2B,
                applyCoupon: couponCode // In real app, fetch coupon details
            }
        );

        return NextResponse.json({
            success: true,
            pricing,
            formulaDetails: {
                id: formula._id,
                type: formula.pricingModel,
                productType: formula.productType
            }
        });

    } catch (error) {
        console.error('Pricing calculation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to calculate price' },
            { status: 500 }
        );
    }
}

// GET - Retrieve all active pricing formulas
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const productType = searchParams.get('productType');
        const category = searchParams.get('category');

        let query = { isActive: true };

        if (productType) query.productType = productType;
        if (category) query.productCategory = category;

        const formulas = await PricingFormula.find(query).select({
            productType: 1,
            productCategory: 1,
            pricingModel: 1,
            basePrice: 1,
            minOrderQuantity: 1,
            b2bMultiplier: 1
        });

        return NextResponse.json({
            success: true,
            count: formulas.length,
            data: formulas
        });

    } catch (error) {
        console.error('Error fetching pricing formulas:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pricing formulas' },
            { status: 500 }
        );
    }
}

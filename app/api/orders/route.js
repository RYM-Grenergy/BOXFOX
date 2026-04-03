import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';
import Product from '@/models/Product';
import { 
    sendEmail, 
    getAdminOrderTemplate, 
    getUserOrderTemplate, 
    generateInvoicePDF,
    getLowStockTemplate,
    getStatusUpdateTemplate
} from '@/lib/mail';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
            const query = isValidObjectId ? { $or: [{ orderId: id }, { _id: id }] } : { orderId: id };
            const order = await Order.findOne(query);
            if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            return NextResponse.json(order);
        }

        const orders = await Order.find().sort({ createdAt: -1 });
        return NextResponse.json(orders);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}


export async function POST(req) {
    try {
        await dbConnect();
        const orderData = await req.json();

        // Generate a clean numeric order ID
        const count = await Order.countDocuments();
        const orderId = `ORD-${1001 + count}`;

        const newOrder = await Order.create({
            ...orderData,
            orderId,
            status: 'Pending'
        });

        // 1. If coupon was used, increment usage count
        if (orderData.couponCode) {
            await Coupon.findOneAndUpdate(
                { code: orderData.couponCode.toUpperCase() },
                { $inc: { usageCount: 1 } }
            );
        }

        // 2. Decrement stock and check for exhaustion
        if (orderData.items && orderData.items.length > 0) {
            for (const item of orderData.items) {
                if (item.productId) {
                    const isVObjectId = /^[0-9a-fA-F]{24}$/.test(item.productId);
                    const productQuery = isVObjectId 
                        ? { $or: [{ _id: item.productId }, { wpId: item.productId }] }
                        : { wpId: item.productId };

                    const product = await Product.findOneAndUpdate(
                        productQuery,
                        { $inc: { stock_quantity: -(item.quantity || 1) } },
                        { returnDocument: 'after' }
                    );

                    // Alert admin if stock is exhausted or low (< 5)
                    if (product && (product.stock_quantity <= 5)) {
                        await sendEmail({
                            to: process.env.EMAIL_USER,
                            subject: `Inventory Alert: ${product.name} is Low!`,
                            html: getLowStockTemplate(product)
                        });
                    }
                }
            }
        }

        // 3. Send Order Emails
        const emailCommonData = {
            orderId: newOrder.orderId,
            customerName: newOrder.customer?.name || 'Customer',
            customerEmail: newOrder.customer?.email,
            totalAmount: newOrder.total || 0,
            discount: newOrder.discount || 0,
            shippingAddress: newOrder.shipping?.address + ', ' + newOrder.shipping?.city + ', ' + newOrder.shipping?.state,
            status: newOrder.status,
            items: newOrder.items || [],
        };

        // PDF Invoice Generation
        const invoicePdf = generateInvoicePDF(emailCommonData);

        // Notify Admin
        await sendEmail({
            to: process.env.EMAIL_USER,
            subject: `🚀 New Order Received: ${newOrder.orderId}`,
            html: getAdminOrderTemplate(emailCommonData)
        });

        // Notify User with Invoice
        if (newOrder.customer?.email) {
            await sendEmail({
                to: newOrder.customer.email,
                subject: `Order Confirmed: ${newOrder.orderId}`,
                html: getUserOrderTemplate(emailCommonData),
                attachments: [
                    {
                        filename: `Invoice-${newOrder.orderId}.pdf`,
                        content: invoicePdf
                    }
                ]
            });
        }

        return NextResponse.json({ success: true, orderId: newOrder.orderId });
    } catch (e) {
        console.error("Order Creation Error:", e);
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await dbConnect();
        const { id, status, labNotes } = await req.json();

        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        const query = isValidObjectId ? { $or: [{ orderId: id }, { _id: id }] } : { orderId: id };

        const currentOrder = await Order.findOne(query);
        const prevStatus = currentOrder?.status;

        let updateData = {};
        if (status !== undefined) updateData.status = status;
        if (labNotes !== undefined) updateData.labNotes = labNotes;

        const order = await Order.findOneAndUpdate(
            query,
            updateData,
            { returnDocument: 'after' }
        );

        if (order) {
            // Trigger status update email if it changed
            if (status && status !== prevStatus && order.customer?.email) {
                await sendEmail({
                    to: order.customer.email,
                    subject: `Update on Order ${order.orderId}: ${status}`,
                    html: getStatusUpdateTemplate(order)
                });
            }
            return NextResponse.json({ success: true, order });
        }
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    } catch (e) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

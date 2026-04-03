import nodemailer from 'nodemailer';
import { jsPDF } from 'jspdf';

const transporter = nodemailer.createTransport(
    process.env.EMAIL_SERVICE === 'gmail' 
    ? {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
      }
    : {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_PORT == 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    }
);

export const sendEmail = async ({ to, bcc, subject, html, attachments = [] }) => {
    try {
        const mailOptions = {
            from: `"BoxFox Store" <${process.env.EMAIL_USER}>`,
            to,
            bcc,
            subject,
            html,
            attachments,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error: error.message };
    }
};

// --- Shared Components ---
const EMAIL_CONTAINER = (content) => `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #f0f0f0; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
        <div style="background-color: #000000; padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1.5px; text-transform: uppercase;">BoxFox</h1>
            <p style="color: #888; margin: 5px 0 0; font-size: 10px; letter-spacing: 2px; font-weight: 900; text-transform: uppercase;">Premium Packaging Solutions</p>
        </div>
        <div style="padding: 40px 30px;">
            ${content}
        </div>
        <div style="padding: 20px; background-color: #fafafa; border-top: 1px solid #f0f0f0; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #999; font-weight: 600;">&copy; ${new Date().getFullYear()} BOXFOX. All rights reserved.</p>
            <p style="margin: 5px 0 0; font-size: 10px; color: #bbb;">You are receiving this because you opted-in at boxfox.in</p>
        </div>
    </div>
`;

// --- Templates ---
export const getAdminOrderTemplate = (order) => EMAIL_CONTAINER(`
    <div style="text-align: center; margin-bottom: 30px;">
        <span style="background-color: #000; color: #fff; padding: 4px 12px; border-radius: 99px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">Admin Only</span>
        <h2 style="margin: 15px 0 5px; font-size: 24px; font-weight: 900; color: #111;">New Order Received!</h2>
        <p style="color: #666; font-size: 14px;">Total of ₹${order.totalAmount} just entered your vault.</p>
    </div>
    
    <div style="background-color: #f8f8f8; padding: 25px; border-radius: 16px; border: 1px solid #eee;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <span style="font-size: 12px; font-weight: 900; color: #888; text-transform: uppercase;">Order ID</span>
            <span style="font-size: 12px; font-weight: 900; color: #111;">${order.orderId}</span>
        </div>
        <div style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <p style="font-size: 12px; font-weight: 900; color: #888; text-transform: uppercase; margin: 0 0 5px;">Customer</p>
            <p style="font-size: 14px; font-weight: 700; color: #111; margin: 0;">${order.customerName}</p>
            <p style="font-size: 13px; color: #666; margin: 2px 0 0;">${order.customerEmail}</p>
        </div>
        <div>
            <p style="font-size: 12px; font-weight: 900; color: #888; text-transform: uppercase; margin: 0 0 10px;">Items Summary</p>
            ${order.items.map(item => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-size: 13px; font-weight: 600; color: #333;">${item.name} x ${item.quantity}</span>
                    <span style="font-size: 13px; font-weight: 700; color: #111;">₹${item.price}</span>
                </div>
            `).join('')}
        </div>
    </div>
    
    <div style="margin-top: 30px; text-align: center;">
        <a href="https://boxfox.in/admin" style="display: inline-block; background-color: #000; color: #fff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">Manage in Dashboard</a>
    </div>
`);

export const getUserOrderTemplate = (order) => EMAIL_CONTAINER(`
    <div style="text-align: center; margin-bottom: 40px;">
        <h2 style="font-size: 32px; font-weight: 900; color: #111; letter-spacing: -1px; margin: 0;">Order Confirmed!</h2>
        <p style="color: #666; font-size: 16px; margin-top: 5px;">Hi ${order.customerName}, your box is being prepared.</p>
    </div>

    <div style="margin-bottom: 30px;">
        <div style="background-color: #f9f9f9; padding: 25px; border-radius: 16px; border: 1px solid #eee;">
            <div style="text-align: center; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 11px; font-weight: 900; color: #aaa; text-transform: uppercase; letter-spacing: 1px;">Tracking Order</p>
                <p style="margin: 5px 0 0; font-size: 22px; font-weight: 900; color: #111;">${order.orderId}</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 1px solid #eee;">
                        <th style="padding: 10px 0; text-align: left; font-size: 10px; font-weight: 900; color: #aaa; text-transform: uppercase;">Product</th>
                        <th style="padding: 10px 0; text-align: right; font-size: 10px; font-weight: 900; color: #aaa; text-transform: uppercase;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr style="border-bottom: 1px solid #fafafa;">
                            <td style="padding: 12px 0; font-size: 14px; font-weight: 600; color: #333;">${item.name} <span style="color: #999;">x ${item.quantity}</span></td>
                            <td style="padding: 12px 0; font-size: 14px; font-weight: 700; color: #111; text-align: right;">₹${item.price}</td>
                        </tr>
                    `).join('')}
                    <tr>
                        <td style="padding: 20px 0 0; font-size: 15px; font-weight: 900; color: #111;">Grand Total</td>
                        <td style="padding: 20px 0 0; font-size: 18px; font-weight: 900; color: #000; text-align: right;">₹${order.totalAmount}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <p style="color: #666; line-height: 1.6; font-size: 14px; margin-bottom: 30px;">
        Your official invoice is attached to this email as a PDF. We will notify you once your premium packaging has been shipped.
    </p>

    <div style="text-align: center;">
        <a href="https://boxfox.in/my-account" style="display: inline-block; background-color: #000; color: #fff; text-decoration: none; padding: 18px 40px; border-radius: 15px; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px;">View Order Status</a>
    </div>
`);

export const getStatusUpdateTemplate = (order) => EMAIL_CONTAINER(`
    <div style="text-align: center; margin-bottom: 35px;">
        <h2 style="font-size: 28px; font-weight: 900; color: #111; margin: 0;">Order Updated!</h2>
        <p style="color: #666; font-size: 14px; margin-top: 8px;">Order ${order.orderId} moved to a new phase.</p>
    </div>

    <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; padding: 25px; border-radius: 16px; text-align: center; margin-bottom: 30px;">
        <p style="margin: 0; font-size: 11px; font-weight: 900; color: #166534; text-transform: uppercase; letter-spacing: 1.5px;">Current Status</p>
        <h3 style="margin: 10px 0 0; font-size: 32px; font-weight: 900; color: #14532d; text-transform: uppercase;">${order.status}</h3>
    </div>

    <p style="color: #666; font-size: 14px; text-align: center; line-height: 1.6;">
        We're working hard to get your boxes to you as soon as possible. Feel free to track the real-time progress below.
    </p>

    <div style="text-align: center; margin-top: 30px;">
        <a href="https://boxfox.in/track/${order.orderId}" style="display: inline-block; background-color: #000; color: #fff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">Track Shipment</a>
    </div>
`);

export const getCouponTemplate = (coupon) => `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background-color: #000000; color: #ffffff; border-radius: 40px; padding: 60px 40px; text-align: center; box-shadow: 0 40px 60px rgba(0,0,0,0.2);">
        <h4 style="margin: 0; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 4px; color: #666;">Flash Offer</h4>
        <h1 style="font-size: 56px; font-weight: 900; letter-spacing: -3px; margin: 20px 0; line-height: 1;">Exclusive Savings.</h1>
        <p style="font-size: 18px; color: #888; font-weight: 500; margin-bottom: 40px;">Upgrade your packaging for less with this limited time code.</p>
        
        <div style="background-color: #ffffff; color: #000000; padding: 35px; border-radius: 30px; display: inline-block; cursor: pointer;">
            <p style="margin: 0; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #999; letter-spacing: 1px;">Coupon Code</p>
            <h2 style="margin: 5px 0 0; font-size: 42px; font-weight: 900; letter-spacing: -1px;">${coupon.code}</h2>
        </div>
        
        <p style="font-size: 24px; font-weight: 900; margin-top: 40px;">Get ${coupon.discountType === 'percentage' ? coupon.discountValue + '%' : '₹' + coupon.discountValue} OFF</p>
        <p style="font-size: 12px; color: #555; font-weight: 600; text-transform: uppercase;">Valid for next 48 hours only</p>
        
        <a href="https://boxfox.in/shop" style="display: inline-block; background-color: #ffffff; color: #000; text-decoration: none; padding: 20px 50px; border-radius: 15px; font-size: 15px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-top: 40px;">Shop Now</a>
    </div>
`;

export const getLowStockTemplate = (product) => EMAIL_CONTAINER(`
    <div style="text-align: center; margin-bottom: 30px;">
        <span style="background-color: #fef2f2; color: #dc2626; padding: 4px 12px; border-radius: 99px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">Urgent Alert</span>
        <h2 style="margin: 15px 0 5px; font-size: 24px; font-weight: 900; color: #111;">Inventory Running Low</h2>
        <p style="color: #666; font-size: 14px;">One of your best sellers needs restocking.</p>
    </div>

    <div style="background-color: #fef2f2; padding: 25px; border-radius: 16px; border: 1px solid #fee2e2;">
        <div style="display: flex; gap: 20px; align-items: center;">
            <div style="flex: 1;">
                <p style="margin: 0; font-size: 16px; font-weight: 700; color: #111;">${product.name}</p>
                <p style="margin: 5px 0 0; font-size: 11px; font-weight: 900; color: #dc2626; text-transform: uppercase;">Available: ${product.stock_quantity || 0} left</p>
                <p style="margin: 10px 0 0; font-size: 11px; font-weight: 700; color: #999;">SKU: ${product.sku}</p>
            </div>
        </div>
    </div>

    <div style="margin-top: 30px; text-align: center;">
        <a href="https://boxfox.in/admin/products" style="display: inline-block; background-color: #dc2626; color: #fff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">Update Inventory</a>
    </div>
`);

// --- PDF Generation ---
export const generateInvoicePDF = (order) => {
    const doc = new jsPDF();
    
    // Header - Premium Brand Accent
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, 210, 60, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text('BOXFOX', 25, 30);
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text('PREMIUM PACKAGING SOLUTIONS', 25, 38);
    
    doc.setFontSize(10);
    doc.text(`Invoice ID: INV-${order.orderId.split('-')[1]}`, 140, 30);
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 140, 36);
    
    // Billing Block
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('CLIENT & SHIPPING DETAILS', 25, 80);
    doc.line(25, 83, 185, 83);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.text(order.customerName || 'Customer', 25, 93);
    doc.setFontSize(9);
    doc.text(order.customerEmail || '', 25, 98);
    doc.text(order.address || 'India', 25, 103);
    
    // Items Table Header
    doc.setFillColor(250, 250, 250);
    doc.rect(25, 120, 160, 10, 'F');
    doc.setFont(undefined, 'bold');
    doc.text('DESCRIPTION', 30, 126);
    doc.text('QTY', 120, 126);
    doc.text('PRICE', 145, 126);
    doc.text('TOTAL', 170, 126);
    
    // Table content
    doc.setFont(undefined, 'normal');
    let y = 142;
    if (order.items && order.items.length > 0) {
        order.items.forEach((item) => {
            doc.text(item.name.substring(0, 35), 30, y);
            doc.text(item.quantity.toString(), 120, y);
            doc.text(`₹${item.price}`, 145, y);
            doc.text(`₹${parseInt(item.price) * item.quantity}`, 170, y);
            y += 10;
        });
    } else {
        doc.text(`Order: ${order.orderId}`, 30, y);
        doc.text(`₹${order.totalAmount}`, 170, y);
        y += 10;
    }
    
    // Totals Block
    y += 10;
    doc.line(25, y, 185, y);
    y += 15;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text('GRAND TOTAL', 110, y);
    doc.setFontSize(16);
    doc.text(`₹${order.totalAmount}`, 185, y, { align: 'right' });
    
    // Notes
    y += 40;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Terms & Conditions:', 25, y);
    doc.setFont(undefined, 'normal');
    doc.text('1. Goods once sold will not be returned.', 25, y + 5);
    doc.text('2. Payments are non-refundable for custom orders.', 25, y + 10);
    
    // Footer Branding
    doc.setFont(undefined, 'bold');
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(32);
    doc.text('BOXFOX', 105, 285, { align: 'center', angle: 0 });
    doc.setFontSize(8);
    doc.text('www.boxfox.in', 105, 292, { align: 'center' });
    
    return Buffer.from(doc.output('arraybuffer'));
};

export const getOTPTemplate = (otp) => `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #f0f0f0; border-radius: 24px; overflow: hidden;">
        <div style="background-color: #000000; padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -1px;">Verify Your Identity.</h1>
        </div>
        <div style="padding: 40px 30px; text-align: center;">
            <p style="color: #666; font-size: 14px; margin-bottom: 30px;">Use the following 6-digit verification code to complete your signup process. This code will expire in 10 minutes.</p>
            
            <div style="background-color: #f8f8f8; color: #000; padding: 25px; border-radius: 20px; display: inline-block; letter-spacing: 12px; font-size: 36px; font-weight: 900; border: 1px solid #eee;">
                ${otp}
            </div>
            
            <p style="margin-top: 30px; color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
        <div style="padding: 20px; background-color: #fafafa; border-top: 1px solid #f0f0f0; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #999; font-weight: 600;">&copy; ${new Date().getFullYear()} BOXFOX. Secure Onboarding.</p>
        </div>
    </div>
`;

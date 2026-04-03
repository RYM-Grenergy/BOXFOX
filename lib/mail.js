import nodemailer from 'nodemailer';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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
    <div style="font-family: 'Inter', 'Helvetica', 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #f0f0f0; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.06);">
        <!-- Premium Header Area -->
        <div style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 50px 20px; text-align: center; border-bottom: 4px solid #10b981;">
            <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 900; letter-spacing: -2px; text-transform: uppercase;">BoxFox</h1>
            <p style="color: #10b981; margin: 8px 0 0; font-size: 11px; letter-spacing: 4px; font-weight: 900; text-transform: uppercase;">Premium Packaging Ecosystem</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 50px 40px; color: #111827;">
            ${content}
        </div>
        
        <!-- Premium Footer Area -->
        <div style="padding: 40px 30px; background-color: #fafafa; border-top: 1px solid #f3f4f6; text-align: center;">
            <div style="margin-bottom: 25px;">
                <a href="https://boxfox.in/shop" style="color: #000; text-decoration: none; font-size: 12px; font-weight: 900; margin: 0 15px; text-transform: uppercase; letter-spacing: 1px;">Collection</a>
                <a href="https://boxfox.in/contact" style="color: #000; text-decoration: none; font-size: 12px; font-weight: 900; margin: 0 15px; text-transform: uppercase; letter-spacing: 1px;">Support</a>
                <a href="https://boxfox.in/track" style="color: #000; text-decoration: none; font-size: 12px; font-weight: 900; margin: 0 15px; text-transform: uppercase; letter-spacing: 1px;">Tracking</a>
            </div>
            <p style="margin: 0; font-size: 11px; color: #999; font-weight: 600;">&copy; ${new Date().getFullYear()} BOXFOX. All rights reserved.</p>
            <p style="margin: 10px 0 0; font-size: 10px; color: #bbb; line-height: 1.5;">BOXFOX is a registered trademark RyM Grenergy.<br/>Sector 15, Vasundhara, Ghaziabad, UP, India</p>
        </div>
    </div>
`;

// --- Templates ---
export const getAdminOrderTemplate = (order) => EMAIL_CONTAINER(`
    <div style="text-align: center; margin-bottom: 35px;">
        <span style="background-color: #fefce8; color: #854d0e; padding: 6px 16px; border-radius: 99px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; border: 1px solid #fef08a;">Sales Notification</span>
        <h2 style="margin: 20px 0 5px; font-size: 28px; font-weight: 900; color: #111; letter-spacing: -1px;">Cha-Ching! New Sale.</h2>
        <p style="color: #666; font-size: 14px;">A new order has been securely placed on the platform.</p>
    </div>
    
    <div style="background-color: #fff; border: 1px solid #f3f4f6; padding: 25px; border-radius: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
        <div style="background-color: #f9fafb; padding: 15px 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <span style="font-size: 11px; font-weight: 900; color: #9ca3af; text-transform: uppercase;">Reference ID</span>
            <span style="font-size: 15px; font-weight: 900; color: #000;">${order.orderId}</span>
        </div>
        
        <div style="margin-bottom: 20px;">
            <p style="font-size: 10px; font-weight: 900; color: #9ca3af; text-transform: uppercase; margin: 0 0 8px; letter-spacing: 1px;">Customer Intelligence</p>
            <p style="font-size: 16px; font-weight: 700; color: #111; margin: 0;">${order.customerName}</p>
            <p style="font-size: 13px; color: #6b7280; margin: 3px 0 0;">${order.customerEmail}</p>
        </div>

        <p style="font-size: 10px; font-weight: 900; color: #9ca3af; text-transform: uppercase; margin: 20px 0 10px; letter-spacing: 1px;">Cart Composition</p>
        <div style="border-top: 1px solid #f3f4f6;">
            ${order.items.map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f9fafb;">
                    <div style="flex: 1;">
                        <p style="font-size: 13px; font-weight: 700; color: #374151; margin: 0;">${item.name}</p>
                        <p style="font-size: 11px; color: #9ca3af; margin: 2px 0 0;">Quantity: ${item.quantity}</p>
                    </div>
                    <span style="font-size: 14px; font-weight: 800; color: #111;">₹${item.price}</span>
                </div>
            `).join('')}
        </div>
        
        <div style="margin-top: 20px; text-align: right;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">Total Revenue Generated</p>
            <p style="font-size: 24px; font-weight: 900; color: #059669; margin: 5px 0 0;">₹${order.totalAmount}</p>
        </div>
    </div>
    
    <div style="margin-top: 40px; text-align: center;">
        <a href="https://boxfox.in/admin" style="display: inline-block; background-image: linear-gradient(to right, #000, #333); color: #fff; text-decoration: none; padding: 18px 45px; border-radius: 14px; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">Enter Admin Vault</a>
    </div>
`);

export const getUserOrderTemplate = (order) => EMAIL_CONTAINER(`
    <div style="text-align: center; margin-bottom: 45px;">
        <div style="width: 70px; hieght: 70px; background-color: #ecfdf5; color: #10b981; border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 25px; padding: 15px;">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <h2 style="font-size: 36px; font-weight: 900; color: #111827; letter-spacing: -2px; margin: 0; line-height: 1;">Order Confirmed!</h2>
        <p style="color: #6b7280; font-size: 16px; margin-top: 10px; font-weight: 500;">Hi ${order.customerName}, we're getting things ready.</p>
    </div>

    <div style="border: 2px dashed #f3f4f6; border-radius: 24px; padding: 30px; margin-bottom: 40px;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #f3f4f6; padding-bottom: 20px;">
            <p style="margin: 0; font-size: 11px; font-weight: 900; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px;">Tracking ID</p>
            <p style="margin: 8px 0 0; font-size: 24px; font-weight: 900; color: #000; letter-spacing: -0.5px;">${order.orderId}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="border-bottom: 2px solid #f9fafb;">
                    <th style="padding: 12px 0; text-align: left; font-size: 10px; font-weight: 900; color: #abb1bb; text-transform: uppercase; letter-spacing: 1px;">Item Details</th>
                    <th style="padding: 12px 0; text-align: right; font-size: 10px; font-weight: 900; color: #abb1bb; text-transform: uppercase; letter-spacing: 1px;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map(item => `
                    <tr style="border-bottom: 1px solid #f9fafb;">
                        <td style="padding: 18px 0;">
                            <p style="font-size: 14px; font-weight: 700; color: #111827; margin: 0;">${item.name}</p>
                            <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0; font-weight: 600;">Qty: ${item.quantity} · ${item.variant || 'Standard'}</p>
                        </td>
                        <td style="padding: 18px 0; font-size: 15px; font-weight: 800; color: #111827; text-align: right;">₹${item.price}</td>
                    </tr>
                `).join('')}
                
                ${order.discount > 0 ? `
                    <tr>
                        <td style="padding: 20px 0 0; font-size: 13px; font-weight: 700; color: #10b981;">Exclusive Discount</td>
                        <td style="padding: 20px 0 0; font-size: 15px; font-weight: 800; color: #10b981; text-align: right;">-₹${order.discount}</td>
                    </tr>
                ` : ''}

                <tr>
                    <td style="padding: 20px 0 0; font-size: 16px; font-weight: 900; color: #111827;">Grand Total</td>
                    <td style="padding: 20px 0 0; font-size: 22px; font-weight: 900; color: #000; text-align: right;">₹${order.totalAmount}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div style="background-color: #f9fafb; padding: 25px; border-radius: 20px; font-size: 14px; margin-bottom: 35px;">
        <p style="margin: 0 0 10px; font-size: 10px; font-weight: 900; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">Shipping Destination</p>
        <p style="margin: 0; color: #374151; line-height: 1.6; font-weight: 600;">${order.shippingAddress || 'Awaiting Details'}</p>
    </div>

    <p style="color: #6b7280; line-height: 1.7; font-size: 14px; margin-bottom: 35px; text-align: center; padding: 0 10px;">
        Your official stamped invoice is securely attached to this email. We'll notify you via push & email as soon as the package leaves our facility.
    </p>

    <div style="text-align: center;">
        <a href="https://boxfox.in/track/${order.orderId}" style="display: inline-block; background-color: #000; color: #fff; text-decoration: none; padding: 20px 50px; border-radius: 16px; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">Track Real-time Status</a>
    </div>
`);

export const getOTPTemplate = (otp) => EMAIL_CONTAINER(`
    <div style="text-align: center; margin-bottom: 40px;">
        <div style="width: 60px; height: 60px; background-color: #000; border-radius: 18px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 25px;">
             <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </div>
        <h2 style="font-size: 32px; font-weight: 900; color: #000; margin: 0; letter-spacing: -1.5px;">Identity Check.</h2>
        <p style="color: #666; font-size: 14px; margin-top: 10px;">Complete your secure onboarding with the code below.</p>
    </div>

    <div style="background-color: #f8f8f8; padding: 40px 20px; border-radius: 30px; text-align: center; border: 1px dashed #e5e7eb;">
        <div style="display: inline-flex; gap: 8px;">
            ${otp.split('').map(digit => `
                <div style="width: 45px; height: 60px; display: inline-flex; align-items: center; justify-content: center; background: white; border: 2px solid #000; color: #000; font-size: 28px; font-weight: 900; border-radius: 12px; margin: 0 3px;">${digit}</div>
            `).join('')}
        </div>
        <p style="margin-top: 25px; font-size: 12px; font-weight: 900; color: #999; text-transform: uppercase; letter-spacing: 1px;">Expiring in 10 minutes</p>
    </div>

    <p style="color: #999; font-size: 12px; text-align: center; margin-top: 35px;">
        This code was generated specifically for your account creation. If you did not request this, please disregard and secure your email account.
    </p>
`);

// --- Advance PDF Generation with AutoTable ---
export const generateInvoicePDF = (order) => {
    const doc = new jsPDF();
    
    // Header Style
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont(undefined, 'bold');
    doc.text('BOXFOX', 20, 28);
    
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text('PREMIUM PACKAGING SOLUTIONS', 22, 36);
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('TAX INVOICE', 190, 28, { align: 'right' });
    
    // Billing Information Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('ISSUED TO:', 20, 60);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.text(order.customerName || 'Customer', 20, 67);
    doc.setFontSize(9);
    doc.text(order.customerEmail || '', 20, 72);
    doc.text(order.shippingAddress || 'India', 20, 77);

    doc.setFont(undefined, 'bold');
    doc.text('INVOICE DETAILS:', 140, 60);
    doc.setFont(undefined, 'normal');
    doc.text(`Reference ID: ${order.orderId}`, 140, 67);
    doc.text(`Date of Issue: ${new Date().toLocaleDateString('en-GB')}`, 140, 72);
    doc.text(`Payment Status: ${order.status === 'Pending' ? 'UNPAID' : 'PAID'}`, 140, 77);

    // Dynamic Table using AutoTable
    const tableData = order.items.map(item => [
        item.name,
        item.quantity.toString(),
        `₹${item.price}`,
        `₹${(parseInt(item.price) * item.quantity).toFixed(2)}`
    ]);

    doc.autoTable({
        startY: 90,
        head: [['Product Description', 'Qty', 'Unit Price', 'Amount']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontSize: 10, halign: 'center' },
        columnStyles: {
            0: { cellWidth: 100 },
            1: { halign: 'center' },
            2: { halign: 'right' },
            3: { halign: 'right' }
        },
        styles: { fontSize: 9, cellPadding: 5 }
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // Totals Grid
    doc.setFont(undefined, 'bold');
    doc.setFontSize(10);
    doc.text('Subtotal:', 140, finalY);
    doc.setFont(undefined, 'normal');
    doc.text(`₹${(order.totalAmount + (order.discount || 0)).toFixed(2)}`, 190, finalY, { align: 'right' });

    if (order.discount > 0) {
        doc.text('Promotion Discount:', 140, finalY + 7);
        doc.setTextColor(16, 185, 129);
        doc.text(`-₹${order.discount.toFixed(2)}`, 190, finalY + 7, { align: 'right' });
        doc.setTextColor(0, 0, 0);
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL AMOUNT DUE:', 140, finalY + 18);
    doc.text(`₹${order.totalAmount.toFixed(2)}`, 190, finalY + 18, { align: 'right' });

    // Payment & Verified Badge
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(20, 250, 190, 250);
    
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('AUTHORIZED SIGNATORY', 105, 270, { align: 'center' });
    doc.text('RYM GRENERGY (BOXFOX DIV.)', 105, 275, { align: 'center' });
    
    // Footer Watermark
    doc.setFontSize(38);
    doc.setTextColor(248, 248, 248);
    doc.text('BOXFOX VERIFIED', 105, 160, { align: 'center', angle: 45 });

    return Buffer.from(doc.output('arraybuffer'));
};

export const getStatusUpdateTemplate = (order) => EMAIL_CONTAINER(`
    <div style="text-align: center; margin-bottom: 35px;">
        <h2 style="font-size: 28px; font-weight: 900; color: #111; margin: 0; letter-spacing: -1px;">Package Lifecycle Update.</h2>
        <p style="color: #666; font-size: 14px; margin-top: 8px;">Order ${order.orderId} is progressing through our ecosystem.</p>
    </div>

    <div style="background-color: #000; border: 8px solid #f3f4f6; padding: 35px 25px; border-radius: 30px; text-align: center; margin-bottom: 30px;">
        <p style="margin: 0; font-size: 10px; font-weight: 900; color: #10b981; text-transform: uppercase; letter-spacing: 3px;">Milestone Reached</p>
        <h3 style="margin: 15px 0 0; font-size: 36px; font-weight: 900; color: #fff; text-transform: uppercase; letter-spacing: -1px;">${order.status}</h3>
    </div>

    <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 30px;">
        <div style="flex: 1; height: 6px; background: #eee; border-radius: 99px; ${order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? 'background: #10b981;' : ''}"></div>
        <div style="flex: 1; height: 6px; background: #eee; border-radius: 99px; ${order.status === 'Shipped' || order.status === 'Delivered' ? 'background: #10b981;' : ''}"></div>
        <div style="flex: 1; height: 6px; background: #eee; border-radius: 99px; ${order.status === 'Delivered' ? 'background: #10b981;' : ''}"></div>
    </div>

    <p style="color: #666; font-size: 14px; text-align: center; line-height: 1.8; padding: 0 15px;">
        We prioritize velocity and precision. Your boxes are currently in the <strong>${order.status}</strong> phase, being handled by our premium logistics partners.
    </p>

    <div style="text-align: center; margin-top: 40px;">
        <a href="https://boxfox.in/track/${order.orderId}" style="display: inline-block; background-color: #000; color: #fff; text-decoration: none; padding: 18px 50px; border-radius: 16px; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">Track Real-Time Status</a>
    </div>
`);

export const getCouponTemplate = (coupon) => EMAIL_CONTAINER(`
    <div style="background-image: linear-gradient(135deg, #000 0%, #222 100%); margin: -50px -40px 40px; padding: 60px 40px; text-align: center; color: #fff; border-bottom: 5px solid #10b981;">
        <h4 style="margin: 0; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 5px; color: #10b981;">Limited Privilege</h4>
        <h1 style="font-size: 52px; font-weight: 900; letter-spacing: -3px; margin: 25px 0 10px; line-height: 0.9;">Exclusive Allocation.</h1>
        <p style="font-size: 18px; color: #9ca3af; font-weight: 500;">Reserved specifically for your next premium acquisition.</p>
    </div>
    
    <div style="text-align: center;">
        <div style="background-color: #f9fafb; border: 2px dashed #000; padding: 35px; border-radius: 24px; display: inline-block;">
            <p style="margin: 0; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #9ca3af; letter-spacing: 2px;">Access Key</p>
            <h2 style="margin: 8px 0 0; font-size: 48px; font-weight: 900; letter-spacing: -1px; color: #000;">${coupon.code}</h2>
        </div>
        
        <div style="margin-top: 40px;">
            <p style="font-size: 28px; font-weight: 900; color: #000; margin: 0;">₹${coupon.discountValue} OFF</p>
            <p style="font-size: 11px; color: #10b981; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-top: 8px;">Institutional Discount Applied</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin: 30px 0; line-height: 1.6;">Use this code at checkout to reduce your total acquisition cost. Valid across our entire range of custom and stock packaging.</p>
        
        <a href="https://boxfox.in/shop" style="display: inline-block; background-color: #000; color: #fff; text-decoration: none; padding: 22px 60px; border-radius: 18px; font-size: 15px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 20px 40px rgba(0,0,0,0.15);">Redeem Allocation</a>
    </div>
`);

export const getLowStockTemplate = (product) => EMAIL_CONTAINER(`
    <div style="text-align: center; margin-bottom: 40px;">
        <div style="width: 70px; height: 70px; background-color: #fef2f2; border-radius: 24px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 25px;">
             <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <h2 style="font-size: 32px; font-weight: 900; color: #991b1b; margin: 0; letter-spacing: -1.5px;">Alert: Depletion Risk</h2>
        <p style="color: #ef4444; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-top: 10px;">Immediate Action Required</p>
    </div>

    <div style="background-color: #fff; border: 4px solid #fecaca; padding: 30px; border-radius: 28px;">
        <div style="border-bottom: 1px solid #fee2e2; padding-bottom: 20px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 18px; font-weight: 900; color: #000;">${product.name}</p>
            <p style="margin: 4px 0 0; font-size: 11px; font-weight: 900; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">SRE SKU: ${product.sku}</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <p style="margin: 0; font-size: 10px; font-weight: 900; color: #9ca3af; text-transform: uppercase;">Stock Levels</p>
                <p style="margin: 5px 0 0; font-size: 32px; font-weight: 900; color: #dc2626;">${product.stock_quantity || 0} unit(s)</p>
            </div>
            <div style="padding: 10px 20px; background-color: #fef2f2; border-radius: 12px; color: #dc2626; font-size: 11px; font-weight: 900; text-transform: uppercase;">CRITICAL</div>
        </div>
    </div>

    <div style="margin-top: 45px; text-align: center;">
        <a href="https://boxfox.in/admin/products" style="display: inline-block; background-color: #dc2626; color: #fff; text-decoration: none; padding: 20px 55px; border-radius: 16px; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 15px 30px rgba(220, 38, 38, 0.2);">Restock Inventory</a>
    </div>
`);

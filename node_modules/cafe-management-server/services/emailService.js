const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email templates
const orderConfirmationTemplate = (order, user) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; text-align: center;">🍕 Order Confirmed!</h1>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
      <p>Dear ${user.fullName || user.username},</p>
      <p>Thank you for your order! Your order <strong>${order.orderNumber}</strong> has been confirmed.</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #8B4513; margin-top: 0;">Order Details:</h3>
        <ul style="list-style: none; padding: 0;">
          ${order.items.map(item => `
            <li style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
              <span>${item.name} x${item.quantity}</span>
              <strong>$${item.totalPrice.toFixed(2)}</strong>
            </li>
          `).join('')}
        </ul>
        <div style="border-top: 2px solid #8B4513; padding-top: 10px; margin-top: 10px;">
          <div style="display: flex; justify-content: space-between;">
            <span>Subtotal:</span>
            <span>$${order.subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Tax:</span>
            <span>$${order.tax.toFixed(2)}</span>
          </div>
          ${order.discount.amount > 0 ? `
            <div style="display: flex; justify-content: space-between; color: green;">
              <span>Discount:</span>
              <span>-$${order.discount.amount.toFixed(2)}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; font-size: 1.2em; font-weight: bold; color: #8B4513;">
            <span>Total:</span>
            <span>$${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div style="margin-top: 15px;">
          <p><strong>Order Type:</strong> ${order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}</p>
          ${order.tableNumber ? `<p><strong>Table Number:</strong> ${order.tableNumber}</p>` : ''}
          ${order.deliveryAddress ? `
            <p><strong>Delivery Address:</strong><br>
            ${order.deliveryAddress.street}<br>
            ${order.deliveryAddress.city}, ${order.deliveryAddress.zipCode}</p>
          ` : ''}
        </div>
      </div>
      
      <div style="text-align: center; background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #2E7D32;">
          ⏰ <strong>Estimated Ready Time:</strong> ${order.timing.estimatedReady ? 
            new Date(order.timing.estimatedReady).toLocaleTimeString() : '15-20 minutes'}
        </p>
      </div>
      
      ${order.specialInstructions ? `
        <p><strong>Special Instructions:</strong> ${order.specialInstructions}</p>
      ` : ''}
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666;">
        <p>Thank you for choosing our cafe!</p>
        <p>We'll notify you when your order is ready.</p>
      </div>
    </div>
  </div>
`;

const orderReadyTemplate = (order, user) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; text-align: center;">🎉 Your Order is Ready!</h1>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
      <p>Dear ${user.fullName || user.username},</p>
      <p>Great news! Your order <strong>${order.orderNumber}</strong> is now ready!</p>
      
      <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        ${order.orderType === 'dine-in' ? 
          `<p style="margin: 0; font-size: 1.1em;"><strong>Please proceed to Table ${order.tableNumber}</strong></p>` :
          order.orderType === 'delivery' ?
          `<p style="margin: 0; font-size: 1.1em;"><strong>Your order is out for delivery!</strong></p>` :
          `<p style="margin: 0; font-size: 1.1em;"><strong>Please come to the counter to collect your order</strong></p>`
        }
      </div>
      
      <p style="text-align: center; color: #666;">Thank you for your patience!</p>
    </div>
  </div>
`;

const orderCompletedTemplate = (order, user) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; text-align: center;">✅ Order Completed</h1>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
      <p>Dear ${user.fullName || user.username},</p>
      <p>Your order <strong>${order.orderNumber}</strong> has been completed.</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="margin: 0 0 10px 0;">We hope you enjoyed your meal!</p>
        <p style="margin: 0; color: #8B4513;">⭐ Please take a moment to rate your experience</p>
      </div>
      
      <p style="text-align: center; color: #666;">Thank you for choosing our cafe!</p>
    </div>
  </div>
`;

// Send email function
const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"Cafe Management" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    });
    console.log(`✅ Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};

// Export functions
module.exports = {
  sendOrderConfirmation: async (order, user) => {
    const html = orderConfirmationTemplate(order, user);
    return await sendEmail(user.email, `Order Confirmation - ${order.orderNumber}`, html);
  },

  sendOrderReady: async (order, user) => {
    const html = orderReadyTemplate(order, user);
    return await sendEmail(user.email, `Order Ready - ${order.orderNumber}`, html);
  },

  sendOrderCompleted: async (order, user) => {
    const html = orderCompletedTemplate(order, user);
    return await sendEmail(user.email, `Order Completed - ${order.orderNumber}`, html);
  }
};

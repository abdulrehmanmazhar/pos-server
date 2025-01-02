import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";

export const invoiceHTML = async (billData: any) => {
  const { order, customer, billPayment, subTotal, discount, instructionNote } = billData;
  const { name, address, contact, udhar } = customer;
  const { cart, total, payment, createdBy } = order;

  // Fetch the username of the creator
  let username = "Unknown";
  try {
    const user = await userModel.findById(createdBy);
    if (user?.name) username = user.name;
  } catch (error) {
    throw new ErrorHandler("Failed to retrieve user details.", 400);
  }

  // Calculate remaining credit
  const credit = Number(udhar) - (Number(subTotal) - Number(billPayment));

  // Generate table rows dynamically based on the cart
  const cartRows = cart
    .map((item: any, index: number) => {
      const { product, qty } = item;
      const totalPrice = qty * product.price; // Calculate total price for the row
      return `
        <tr>
          <td>${index + 1}</td> <!-- Serial Number -->
          <td>${product.name} (${product.category})</td> <!-- Product Name & Category -->
          <td>${qty}</td> <!-- Quantity -->
          <td>${product.price.toFixed(2)}</td> <!-- Price per Unit -->
          <td>${totalPrice.toFixed(2)}</td> <!-- Total Price -->
        </tr>
      `;
    })
    .join("");

  const formattedDate = new Date().toLocaleDateString("en-GB");

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f8f9fa;
      }
      .invoice-container {
        width: 80%;
        margin: 20px auto;
        background: #fff;
        border: 1px solid #ddd;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header img {
        max-width: 150px;
        margin-bottom: 10px;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .details-container {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .customer-details, .company-details {
        width: 48%;
      }
      .company-details {
        text-align: right;
      }
      .date {
        text-align: right;
        font-size: 14px;
        margin-bottom: 10px;
        font-weight: bold;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      .table th, .table td {
        border: 1px solid #ddd;
        text-align: left;
        padding: 8px;
      }
      .table th {
        background-color: #f2f2f2;
      }
      .total-row {
        text-align: right;
        font-weight: bold;
        padding: 10px 0;
      }
    </style>
  </head>
  <body>
    <div class="invoice-container">
      <div class="header">
        <h2>Invoice OG Cola Hafizabad</h2>
      </div>

      <div class="date">Date: ${formattedDate}</div>

      <div class="details-container">
        <!-- Customer Details -->
        <div class="customer-details">
          <h3>Customer Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>Contact:</strong> ${contact}</p>
          <p><strong>Previous Dues:</strong> ${credit.toFixed(2)} PKR</p>
        </div>

        <!-- Company Details -->
        <div class="company-details">
          <p><strong>Contact:</strong> 03436768695</p>
          <p><strong>Sales Manager:</strong> Talha Ahsan</p>
          <p><strong>Order Taker:</strong> ${username}</p>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price Per Unit</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          ${cartRows}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" class="total-row">Total:</td>
            <td>${total?.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="4" class="total-row">Discount:</td>
            <td>${discount?.toFixed(2)} PKR</td>
          </tr>
          <tr>
            <td colspan="4" class="total-row">Subtotal:</td>
            <td>${subTotal?.toFixed(2)} PKR</td>
          </tr>
          <tr>
            <td colspan="4" class="total-row">Payment:</td>
            <td>${billPayment?.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="4" class="total-row">Remaining:</td>
            <td>${(subTotal - billPayment + credit).toFixed(2)} PKR</td>
          </tr>
        </tfoot>
      </table>

      <!-- Instruction Note -->
      <p style="margin-top: 20px; font-style: italic; color: #555;">${instructionNote}</p>
    </div>
  </body>
  </html>
  `;
};

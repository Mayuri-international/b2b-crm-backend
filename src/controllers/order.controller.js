
import responseHandler from "../utils/responseHandler.js"

import responseHandler from "../utils/responseHandler.js";
import Order from "../models/orderModel.js";
import Quote from "../models/quoteModel.js";

const createNewOrder = async (req, res) => {
    try {
        const {
            clientId,
            quoteVersion,
            quoteId,
            transport,
            installation,
            gstAmount,
            totalPayable,
            // invoiceId,
            documents,
            deliveryStatus,
            deliverySummary,
        } = req.body;

        // 1. Fetch the finalized quote using clientId and quoteVersion
        const quote = await Quote.findOne({ clientId, quoteId:quoteId });

        if (!quote || quote.status !== "Finalized") {
            return responseHandler(res, 404, false, "Finalized quote not found for the client and version");
        }

        // 2. Build vendorAssignments from quote items
        const vendorAssignments = [];

        quote.items.forEach((item) => {
            item.vendors.forEach((vendor) => {
                vendorAssignments.push({
                    vendorId: vendor.vendorId,
                    itemRef: item.description,
                    assignedQty: vendor.quantity,
                    orderValue: vendor.quantity * vendor.costPerUnit,
                    advancePaid: vendor.advance,
                    finalPayment: (vendor.quantity * vendor.costPerUnit) - vendor.advance,
                    deliveryEstimate: vendor.deliveryDate,
                    status: "Pending",
                });
            });
        });

        // 3. Create the order
        const newOrder = new Order({
            clientId,
            quoteVersion,
            orderValue: quote.totalAmount,
            transport,
            installation,
            gstAmount,
            totalPayable,
            invoiceId,
            vendorAssignments,
            documents,
            deliveryStatus,
            deliverySummary,
        });

        const savedOrder = await newOrder.save();

        return responseHandler(res, 201, true, "Order created successfully", savedOrder);

    } catch (error) {
        console.error("Error creating order:", error);
        return responseHandler(res, 500, false, "Internal Server Error");
    }
};

export default createNewOrder;


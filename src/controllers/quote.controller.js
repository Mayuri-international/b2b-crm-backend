
import Quote from "../models/quote.model.js";

import responseHandler from "../utils/responseHandler.js";

import Client from "../models/clientEnquery.model.js";

import uploadImage from "../utils/upload.js";

// const vendorSplitSchema = new mongoose.Schema({
//     vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
//     quantity: Number,
//     costPerUnit: Number,
//     advance: Number,
//     deliveryDate: Date
// });

// const quoteItemSchema = new mongoose.Schema({
//     description: { type: String, required: true },
//     hsn: String,
//     unit: String,
//     quantity: Number,
//     finalUnitPrice: Number,
//     subtotal: Number,
//     vendors: [vendorSplitSchema]
// });



const createNewQuote = async (req, res) => {
  try {

    console.log("req body is ", req.body);

    const {
      clientId,
      items,
      taxPercent = 0,
      transport = 0,
      installation = 0,
      totalAmount,
      reason,
      notes,
      image,
    } = req.body;

    console.log("req.body",
      clientId,
      items,
      taxPercent,
      transport,
      installation,
      totalAmount,
      reason,
      notes,
      image
    );

    if (!clientId || !items || items.length === 0) {
      return responseHandler(res, 400, false, null, "Client ID and at least one quote item are required.");
    }

    // Check if client exists
    const clientExists = await Client.findById(clientId);
    if (!clientExists) {
      return responseHandler(res, 404, false, null, "Client not found.");
    }

    // upload image to the cloudinary 

    let uploadedImageUrl ="";

    
    try{

      const result = await uploadImage(image);

      uploadedImageUrl = result;

    }catch(error){

      console.log("image url is ",uploadedImageUrl);

      return responseHandler(res,400,false,"error occur while uplaodin the image ",null,error);

    }

    console.log("uploaded image url ",uploadedImageUrl);

    // Get latest quote version for the client
    const existingQuotes = await Quote.find({ clientId });
    const version = existingQuotes.length + 1;

    // Compute subtotal for each item and full quote total
    let grossSubtotal = 0;

    const processedItems = items.map(item => {
      const itemSubtotal = item.quantity * item.finalUnitPrice;
      grossSubtotal += itemSubtotal;

      return {
        ...item,
        subtotal: itemSubtotal,
      };
    });

    // Calculate tax
    const taxAmount = (grossSubtotal * taxPercent) / 100;

    const finalTotal = totalAmount || (grossSubtotal + taxAmount + Number(transport) + Number(installation));

    const newQuote = new Quote({
      clientId,
      version,
      items: processedItems,
      taxPercent,
      transport,
      installation,
      totalAmount: finalTotal,
      reason: version > 1 ? reason : undefined,
      notes,
      image:uploadedImageUrl,
      createdBy: req.user?._id || null, // assuming auth middleware
      status: 'Draft'
    });

    await newQuote.save();

    return responseHandler(res, 200, true, newQuote, "Quote created successfully.");
  } catch (error) {
    console.error("Quote creation error:", error);
    return responseHandler(res, 500, false, null, error.message);
  }
};



export default createNewQuote;



// update the  status of the quote 


export const updateQuoteStatus = async(req,res)=>{

  try{


  }catch(error){

    console.log("error is ",error);

    responseHandler()
  }
}


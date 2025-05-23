
import Quote from "../models/quote.model.js";

import responseHandler from "../utils/responseHandler.js";

import Client from "../models/clientEnquery.model.js";

import uploadImage from "../utils/upload.js";


// create an new quote for the specific enquery 

const createNewQuote = async (req, res) => {
  try {

    console.log("req body is ", JSON.parse(req.body?.data));


    const {
      clientId,
      items,
      // addedBy,
      taxPercent = 0,
      transport = 0,
      installation = 0,
      totalAmount,
      reason,
      notes,
      image,
    } = JSON.parse(req.body?.data);

    console.log("req.body",
      clientId,
      items,
      taxPercent,
      transport,
      installation,
      totalAmount,
      reason,
      notes,
  
    );

    console.log("image is ",req.files?.image);

    let imageFilePath = req.files?.image;

    // console.log("inside body image is ",req.body?.image);

    if(!clientId){

      return responseHandler(res, 400, false, null, "Client ID is required");
    }

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

      const result = await uploadImage(imageFilePath.tempFilePath);

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

    return responseHandler(res, 200, true,"Quote created successfully.", newQuote);
  } catch (error) {
    console.error("Quote creation error:", error);
    return responseHandler(res, 500, false, "some went wrong",null, error.message);
  }
};


// get the all the quote revisions for the specific enquery

const getAllQuoteRevisions = async (req, res) => {

  try{

    const {enqueryId} = req.params;

    if(!enqueryId){

      return responseHandler(res,400,false,"enquery id is required");

    }

    const quotes = await Quote.find({clientId:enqueryId}).populate("clientId");

    return responseHandler(res,200,true,"quotes fetched successfully",quotes);


  }catch(error){

    console.log("error is :",error);

    return responseHandler(res,500,false,"error occur while fetch the quotes",null,error);

  }
}


// update the  status of the quote 


export const updateQuoteStatus = async(req,res)=>{

  try{


  }catch(error){

    console.log("error is ",error);

    responseHandler()
  }
}



export {

  createNewQuote,
  getAllQuoteRevisions
}


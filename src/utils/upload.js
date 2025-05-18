import cloudinary from "../config/cloudinary.js";

const uploadImage = async (filePath) => {
    try {
        const response = await cloudinary.uploader.upload(filePath, {
            folder: "invoice",
            resource_type: "auto", // Allows any file type (PDF, images, etc.)
        });

        console.log("Uploaded File URL:", response.secure_url);
        return response.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return null;
    }
};

export default uploadImage;


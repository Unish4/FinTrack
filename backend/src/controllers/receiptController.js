import cloudinary from "../config/cloudinary.js";
import Transaction from "../models/Transaction.js";

export const uploadReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify the transaction exists and belongs to this user
    const transaction = await Transaction.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Multer puts the file here after parsing
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    if (transaction.receipt?.publicId) {
      await cloudinary.uploader.destroy(transaction.receipt.publicId);
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "fintrack/receipts", // organises files in Cloudinary
          resource_type: "image",

          transformation: [
            {
              width: 1200,
              height: 1200,
              crop: "limit",
              quality: "auto",
              fetch_format: "auto",
            },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      // Pipe the file buffer into the upload stream
      stream.end(req.file.buffer);
    });

    transaction.receipt = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      uploadedAt: new Date(),
    };

    await transaction.save();

    res.status(200).json({
      success: true,
      message: "Receipt uploaded successfully",
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    if (!transaction.receipt?.url) {
      return res.status(400).json({
        success: false,
        message: "This transaction has no receipt",
      });
    }

    // Delete from Cloudinary first
    if (transaction.receipt.publicId) {
      await cloudinary.uploader.destroy(transaction.receipt.publicId);
    }

    // Clear the receipt field on the document
    transaction.receipt = { url: null, publicId: null, uploadedAt: null };
    await transaction.save();

    res.status(200).json({
      success: true,
      message: "Receipt deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

import mongoose from 'mongoose';

export const isValidId = (paramName = 'contactId') => (req, res, next) => {
    const id = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            status: 400,
            message: "Invalid ID format",
            data: 'invalid id'
        });
    }
    next();
};

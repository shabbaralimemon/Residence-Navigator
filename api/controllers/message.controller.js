import Message from "../models/message.model.js";
import { errorHandler } from "../utils/error.js";

export const getMessage = async (req, res, next) => {
    const sender = req.query.sender || "";
    const receiver = req.query.receiver || "";

    if (req.user.id != sender) return next(errorHandler(401, "Token unauthorized"));

    try {
        const messages = await Message.find({
            $or: [
                { $and: [{ sender }, { receiver }] },
                { $and: [{ sender: receiver }, { receiver: sender }] },
            ],
        });
        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};

export const postMessage = async (req, res, next) => {
    if (req.user.id != req.body.sender)
        return next(errorHandler(401, "Token unauthorized"));
    try {
        const newMessage = new Message(req.body);
        await newMessage.save();
        res.status(201).json("Message sent seccessfully");
    } catch (error) {
        next(error);
    }
};

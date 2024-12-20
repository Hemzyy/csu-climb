import User from "../models/user.model.js";

//get top 3 from users collection accorindg to their rank
export const getTopThree = async (req, res) => {
    try {
        const topThree = await User.find().sort({ rank: 1 }).limit(3);
        res.status(200).json(topThree);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get the rest of the list from users collection
export const getRestOfList = async (req, res) => {
    try {
        const restOfList = await User.find().sort({ rank: 1 }).skip(3);
        res.status(200).json(restOfList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
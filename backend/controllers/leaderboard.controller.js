import User from "../models/user.model.js";

//get top 3 from users collection accorindg to their rank
// export const getTopThree = async (req, res) => {
//     try {
//         const topThree = await User.find().sort({ rank: 1 }).limit(3);
//         res.status(200).json(topThree);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// //get the rest of the list from users collection
// export const getRestOfList = async (req, res) => {
//     try {
//         const restOfList = await User.find().sort({ rank: 1 }).skip(3);
//         res.status(200).json(restOfList);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

//function get top three: sort users by leaderboardScore and get the top 3 while filtering out users who don't want to be shown on the leaderboard and who have 0 points
export const getTopThree = async (req, res) => {
    try {
        const topThree = await User.find({ showOnLeaderboard: true, leaderboardScore: { $gt: 0 } })
            .sort({ leaderboardScore: -1 })
            .limit(3);
        res.status(200).json(topThree);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// function get rest of list: same as getTopThree but skip the first 3 users
export const getRestOfList = async (req, res) => {
    try {
        const restOfList = await User.find({ showOnLeaderboard: true, leaderboardScore: { $gt: 0 } })
            .sort({ leaderboardScore: -1 })
            .skip(3);
        res.status(200).json(restOfList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//toggle visibility of the leaderboard
export const toggleVisibility = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.showOnLeaderboard = !user.showOnLeaderboard;
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};
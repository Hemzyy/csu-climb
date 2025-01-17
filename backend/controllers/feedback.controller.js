import Feedback from "../models/feedback.model.js";

export const createFeedback = async (req, res) => {
    try {
      const { feedbackText, userId, userName, type } = req.body;
  
      // Validate required fields
      if (!feedbackText || !userId || !userName || !type) {
        return res.status(400).json({ error: "All fields are required." });
      }
  
      // Adjust validation to match frontend
      const validTypes = ["bug", "idea", "generalMessage"];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ error: `Type must be one of: ${validTypes.join(", ")}.` });
      }
  
      // Create new feedback
      const feedback = new Feedback({
        feedbackText,
        userId,
        userName,
        type,
      });
  
      // Save feedback to the database
      await feedback.save();
  
      // Return success response
      res.status(201).json({ message: "Feedback created successfully", feedback });
    } catch (error) {
      console.error("Error in createFeedback function:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

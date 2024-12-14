import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false, // The name of the route (e.g., "The Dragon's Spine").
    unique: false,
  },
  grade: {
    type: String,
    required: true, // The climbing grade (e.g., "7a", "6b").
  },
  difficultyPoints: {
    type: Number,
    required: true, // The number of points awarded for climbing this route.
    default: 0,
  },
  setter: {
    type: mongoose.Schema.Types.Mixed, // Can hold a user ID (ObjectId) or a string
    required: false,
  },
  active: {
    type: Boolean, 
    default: true, // Whether the route is currently mounted or retired.
  },
  successfulClimbs: {
    type: Number, 
    default: 0, // Number of successful climbs by users.
  },
});

// Create and export the model
const Route = mongoose.model("Route", routeSchema);

export default Route;

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
    img:{
      type: String,
      required: false, // The URL of the image of the route.
      default: "",
    },
    thumbnail:{
      type: String,
      required: false, // The URL of the thumbnail of the route.
      default: "",
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
    sector: {
      type: String,
      required: true, // The sector of the route (e.g., "Secteur Gauche (G)", "Secteur Centre (C), "Secteur Droit (D)").
    },
    validatedBy: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: [],
      }
  ],
    
  }, { timestamps: true }
);

// Create and export the model
const Route = mongoose.model("Route", routeSchema);

export default Route;

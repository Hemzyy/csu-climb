import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
	{
		routeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Route",
            required: true,
        },
        routeName: {
            type: String,
            required: true,
        },
        grade: {
            type: String,
            required: true,
        },
		type: {
			type: String,
			required: true,
			enum: ["newRoute", "event"],
		},
		read: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);


// Create a model
const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
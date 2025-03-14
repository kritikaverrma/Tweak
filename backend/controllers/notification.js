const Notification = require("../models/notification")

const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ to: userId }).populate({
            path: "from",
            select: "username profileImg"
        })

        await Notification.updateMany({ to: userId }, { read: true });

        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getNotifications", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({ to: userId });

        res.status(200).json([]);
    } catch (error) {
        console.log("Error in deleteNotifications", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

const markAsRead = async (req, res) => {
    try {
        const userId = req.user._id;

        // Mark all notifications as read instead of deleting
        await Notification.updateMany({ to: userId, isRead: false }, { isRead: true });

        res.status(200).json({ message: "Notifications marked as read" });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;
        const unreadCount = await Notification.countDocuments({ to: userId, isRead: false });
    }
    catch (error) {
        console.error("Error fetching unread notifications count:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getNotifications,
    deleteNotifications,
    getUnreadCount,
}
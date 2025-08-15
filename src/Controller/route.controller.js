import router from "../Route/collectorRoutes.js";

// Create new route
export const createRoute = async (req, res) => {
    const { routeName, startLocation, endLocation, date, time } = req.body;
    try {
        const requiredFields = { routeName, startLocation, endLocation, date, time };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) return res.status(400).json({ message: `Missing required field: ${key}` });
        }
        const newRoute = new Route({
            routeName,
            startLocation,
            endLocation,
            date,
            time,
        });
        const savedRoute = await newRoute.save();
        return res.status(201).json({ message: "Route created successfully", route: savedRoute });
    } catch (error) {
        console.error("Error creating route:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get all routes
export const getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find({});
        return res.status(200).json({ message: "Routes retrieved successfully", routes });
    } catch (error) {
        console.error("Error retrieving routes:", error);
        return res.status(500).json({ message: "Internal server error" });
    }   
};

// Get route by ID
export const getRouteById = async (req, res) => {
    const { id } = req.params;
    try {
        const route = await Route.findById(id);
        if (!route) return res.status(404).json({ message: "Route not found" });
        return res.status(200).json({ message: "Route retrieved successfully", route });
    } catch (error) {
        console.error("Error retrieving route:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Update route by ID
export const updateRouteById = async (req, res) => {
    const { id } = req.params;
    const { routeName, startLocation, endLocation, date, time } = req.body;
    try {
        const updates = {};
        if (routeName) updates.routeName = routeName;
        if (startLocation) updates.startLocation = startLocation;
        if (endLocation) updates.endLocation = endLocation;
        if (date) updates.date = date;
        if (time) updates.time = time;
        const updatedRoute = await Route.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedRoute) return res.status(404).json({ message: "Route not found" });
        return res.status(200).json({ message: "Route updated successfully", route: updatedRoute });
    } catch (error) {
        console.error("Error updating route:", error);
        return res.status(500).json({ message: "Internal server error" });
    }   
};

// Delete route by ID
export const deleteRouteById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRoute = await Route.findByIdAndDelete(id);
        if (!deletedRoute) return res.status(404).json({ message: "Route not found" });
        return res.status(200).json({ message: "Route deleted successfully" });
    } catch (error) {
        console.error("Error deleting route:", error);
        return res.status(500).json({ message: "Internal server error" });
    }   
};

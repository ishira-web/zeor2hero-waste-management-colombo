import TimeTable from "../Model/timeTable.model.js";

// Create new time table entry
export const createTimeTable = async (req, res) => {
    const { collectorID, collectionDay, collectionTime, collectionLocation } = req.body;
    try {
        const requiredFields = { collectorID, collectionDay, collectionTime, collectionLocation };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) return res.status(400).json({ message: `Missing required field: ${key}` });
        } 
        const newTimeTable = new TimeTable({
            collectorID,
            collectionDay,
            collectionTime,
            collectionLocation,
            routeName: req.body.routeName,
            crewMembers: req.body.crewMembers || [],
        });
        const savedTimeTable = await newTimeTable.save();
        return res.status(201).json({ message: "Time table created successfully", timeTable: savedTimeTable });
    } catch (error) {
        console.error("Error creating time table:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get all time tables
export const getAllTimeTables = async (req, res) => {
    try {
        const timeTables = await TimeTable.find({}).populate('collectorID', 'fullName').populate('routeName', 'routeName');
        return res.status(200).json({ message: "Time tables retrieved successfully", timeTables });
    } catch (error) {
        console.error("Error retrieving time tables:", error);
        return res.status(500).json({ message: "Internal server error" });
    }   
};

// Get time table by ID
export const getTimeTableById = async (req, res) => {
    const { id } = req.params;
    try {
        const timeTable = await TimeTable.findById(id).populate('collectorID', 'fullName').populate('routeName', 'routeName');
        if (!timeTable) return res.status(404).json({ message: "Time table not found" });
        return res.status(200).json({ message: "Time table retrieved successfully", timeTable });
    } catch (error) {
        console.error("Error retrieving time table:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Update time table by ID
export const updateTimeTableById = async (req, res) => {
    const { id } = req.params;
    const { collectorID, collectionDay, collectionTime, collectionLocation, routeName, crewMembers } = req.body;
    try {
        const updates = {};
        if (collectorID) updates.collectorID = collectorID;
        if (collectionDay) updates.collectionDay = collectionDay;
        if (collectionTime) updates.collectionTime = collectionTime;
        if (collectionLocation) updates.collectionLocation = collectionLocation;
        if (routeName) updates.routeName = routeName;
        if (crewMembers) updates.crewMembers = crewMembers;
        const timeTable = await TimeTable.findByIdAndUpdate(id, updates, { new: true }).populate('collectorID', 'fullName').populate('routeName', 'routeName');
        if (!timeTable) return res.status(404).json({ message: "Time table not found" });
        return res.status(200).json({ message: "Time table updated successfully", timeTable });
    } catch (error) {
        console.error("Error updating time table:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Delete time table by ID
export const deleteTimeTableById = async (req, res) => {
    const { id } = req.params;
    try {
        const timeTable = await TimeTable.findByIdAndDelete(id);
        if (!timeTable) return res.status(404).json({ message: "Time table not found" });
        return res.status(200).json({ message: "Time table deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting time table:", error);
        return res.status(500).json({ message: "Internal server error" });
    }   
};

// Get time tables by collector ID
export const getTimeTablesByCollectorId = async (req, res) => {
    const { collectorId } = req.params;
    try {
        const timeTables = await TimeTable.find({ collectorID: collectorId }).populate('collectorID', 'fullName').populate('routeName', 'routeName');
        if (timeTables.length === 0) return res.status(404).json({ message: "No time tables found for this collector" });
        return res.status(200).json({ message: "Time tables retrieved successfully", timeTables });
    } catch (error) {
        console.error("Error retrieving time tables by collector ID:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get time tables by route ID
export const getTimeTablesByRouteId = async (req, res) => {
    const { routeId } = req.params;
    try {
        const timeTables = await TimeTable.find({ routeName: routeId }).populate('collectorID', 'fullName').populate('routeName', 'routeName');
        if (timeTables.length === 0) return res.status(404).json({ message: "No time tables found for this route" });
        return res.status(200).json({ message: "Time tables retrieved successfully", timeTables });
    }
    catch (error) {
        console.error("Error retrieving time tables by route ID:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get active time tables
export const getActiveTimeTables = async (req, res) => {
    try {
        const activeTimeTables = await TimeTable.find({ isActive: true }).populate('collectorID', 'fullName').populate('routeName', 'routeName');
        return res.status(200).json({ message: "Active time tables retrieved successfully", activeTimeTables });
    } catch (error) {
        console.error("Error retrieving active time tables:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
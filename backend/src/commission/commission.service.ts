import Commission from "./commission.schema";

/**
 * Retrieves all commission details.
*/

export const getAllCommissionsService = async () => {
    const commissions = await Commission.find().lean();
    return commissions;
};

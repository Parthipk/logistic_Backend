const { z } = require("zod");

const hubZodSchema = z.object({
    name: z.string().min(1, "Hub name is required"),
    code: z.string().min(1, "Hub code is required").toUpperCase(),
});



const createRouteZodSchema = z.object({
    from: z.string().min(1, "From is required"),
    to: z.string().min(1, "To is required"),

    distance: z
        .number()
        .nonnegative("Distance must be a positive number")
        .optional(),

    time: z
        .number()
        .nonnegative("Time must be a positive number")
        .optional(),

    fuelCost: z
        .number()
        .nonnegative("Fuel cost must be a positive number")
        .optional(),

    traffic: z
        .number()
        .min(0, "Traffic cannot be negative")
        .default(1),
});

module.exports = { createRouteZodSchema, hubZodSchema };
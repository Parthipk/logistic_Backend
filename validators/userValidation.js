const { z } = require('zod');

const userValidationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  number: z
    .string()
    .min(7, "Phone number is too short"),

  countryCode: z
    .string()
    .min(1, "Country code is required"),

  email: z
    .string()
    .email("Invalid email format"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

   
});
 

const emailSchema = z.object({ 

  email: z
    .string()
    .email("Invalid email format"), 
   
});



module.exports = { userValidationSchema , emailSchema};


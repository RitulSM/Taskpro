const z = require("zod");

const userSignupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long")
});

const userLoginSchema = z.object({
    username: z.string(),
    password: z.string()
});

module.exports = {
    userSignupSchema,
    userLoginSchema
};

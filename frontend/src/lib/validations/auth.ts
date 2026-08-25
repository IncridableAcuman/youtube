import * as z from "zod";

export const loginSchema = z.object({
    email: z.string().email("Tog'ri email kiriting"),
    password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
});

export const registerSchema = z.object({
    fullName: z.string().min(2, "Ismingiz kamida 2 ta belgidan iborat bo'lishi kerak"),
    username: z.string().min(3, "Username kamida 3 ta belgidan iborat bo'lishi kerak"),
    email: z.string().email("Tog'ri email kiriting"),
    password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
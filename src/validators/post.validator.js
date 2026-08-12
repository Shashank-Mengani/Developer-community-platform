import { z } from 'zod';

export const createPostSchema = z.object({
    content: z.string().min(1, "Content is required").max(1000, "content cannot exceed 1000 characters"),
    imageUrl: z.string().optional(),
});
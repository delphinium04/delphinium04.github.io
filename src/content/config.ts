import { z, defineCollection } from "astro:content";
const blogSchema = z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.string().optional(),
    heroImage: z.string().optional(),
    badge: z.string().optional(),
    tags: z.array(z.string()).refine(items => new Set(items).size === items.length, {
        message: 'tags must be unique',
    }).optional(),
});

const storeSchema = z.object({
    title: z.string(),
    description: z.string(),
    custom_link_label: z.string(),
    custom_link: z.string().optional(),
    updatedDate: z.coerce.date(),
    pricing: z.string().optional(),
    oldPricing: z.string().optional(),
    badge: z.string().optional(),
    checkoutUrl: z.string().optional(),
    heroImage: z.string().optional(),
});

export type BlogSchema = z.infer<typeof blogSchema>;
export type StoreSchema = z.infer<typeof storeSchema>;

const blogCollection = defineCollection({ schema: blogSchema });
const storeCollection = defineCollection({ schema: storeSchema });
const projectCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        period: z.string(),
        team: z.string(),
        role: z.string(),
        stack: z.array(z.string()),
        order: z.number(),
        heroImage: z.string().optional(),
        imageWidth: z.number().int().positive().optional(),
        imageHeight: z.number().int().positive().optional(),
        badge: z.string().optional(),
        links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
        videos: z.array(z.discriminatedUnion('type', [
            z.object({
                type: z.literal('youtube'),
                id: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
                title: z.string().min(1),
                unavailableReason: z.string().min(1).optional(),
            }),
            z.object({
                type: z.literal('file'),
                src: z.string().min(1),
                title: z.string().min(1),
                poster: z.string().optional(),
            }),
        ])).default([]),
    }),
});

export const collections = {
    'blog': blogCollection,
    'store': storeCollection,
    'projects': projectCollection,
}

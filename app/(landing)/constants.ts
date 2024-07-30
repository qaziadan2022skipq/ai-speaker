import * as z from "zod";

export const formSchema = z.object({
    prompt: z.string().min(1, {
        message: "Image prompt is required"
    }),
    language: z.string().min(1, {
        message: "Image prompt is required"
    }),
})

export const formSchemaGenerateSpeech = z.object({
    prompt: z.string(),
    voice: z.string()
})


export const voiceOptions = [
    {
        value: "alloy",
        label: "Alloy"
    },
    {
        value: "echo",
        label: "Echo"
    },
    {
        value: "fable",
        label: "Fable"
    },
    {
        value: "onyx",
        label: "Onyx"
    },
    {
        value: "nova",
        label: "Nova"
    },
    {
        value: "shimmer",
        label: "Shimmer"
    }
]
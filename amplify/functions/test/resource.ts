import { defineFunction } from "@aws-amplify/backend";

export const testTickle = defineFunction({
    entry: './handler.ts'
})
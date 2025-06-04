import { defineFunction } from "@aws-amplify/backend";

export const testTickle = defineFunction({
    name: 'testTickle',
    entry: './handler.ts'
})
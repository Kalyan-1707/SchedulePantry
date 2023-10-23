import { schedule } from "@netlify/functions";
const { SchedulePantry } = require("../../SchedulePantry");

export const handler = schedule("*/10 * * * *", async () => {
    SchedulePantry();
})
import { schedule } from "@netlify/functions";
const { SchedulePantry } = require("../../SchedulePantry");


schedule("*/10 * * * *", async () => {
    SchedulePantry();
})
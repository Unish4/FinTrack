import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),

    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR", "CATEGORY:PREVIEW"],
    }),

    tokenBucket({
      mode: "LIVE",
      characteristics: ["userId"], // rate limit per Clerk user ID
      refillRate: 10,
      interval: "10s",
      capacity: 20,
    }),
  ],
});

export default aj;

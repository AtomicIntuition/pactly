import { describe, it, expect } from "vitest";
import {
  PLANS,
  GENERATION_STEPS,
  APP_NAME,
} from "@/lib/constants";

describe("PLANS", () => {
  it("has free, pro, and agency keys", () => {
    expect(PLANS).toHaveProperty("free");
    expect(PLANS).toHaveProperty("pro");
    expect(PLANS).toHaveProperty("agency");
  });

  it("free plan has a price of 0", () => {
    expect(PLANS.free.price_monthly).toBe(0);
  });

  it("free plan allows 5 proposals per month", () => {
    expect(PLANS.free.proposals_per_month).toBe(5);
  });

  it("pro plan allows 50 proposals per month", () => {
    expect(PLANS.pro.proposals_per_month).toBe(50);
  });

  it("pro plan has a price of 2900 (cents)", () => {
    expect(PLANS.pro.price_monthly).toBe(2900);
  });

  it("agency plan has proposals_per_month set to -1 (unlimited)", () => {
    expect(PLANS.agency.proposals_per_month).toBe(-1);
  });

  it("agency plan has a price of 9900 (cents)", () => {
    expect(PLANS.agency.price_monthly).toBe(9900);
  });

  it("each plan has a non-empty features array", () => {
    for (const key of Object.keys(PLANS) as Array<keyof typeof PLANS>) {
      expect(PLANS[key].features.length).toBeGreaterThan(0);
    }
  });
});

describe("GENERATION_STEPS", () => {
  it("has exactly 7 items", () => {
    expect(GENERATION_STEPS).toHaveLength(7);
  });

  it("starts with analyzing the client brief", () => {
    expect(GENERATION_STEPS[0]).toBe("Analyzing client brief");
  });

  it("ends with finalizing the proposal", () => {
    expect(GENERATION_STEPS[GENERATION_STEPS.length - 1]).toBe(
      "Finalizing proposal",
    );
  });
});

describe("APP_NAME", () => {
  it("equals 'Overture'", () => {
    expect(APP_NAME).toBe("Overture");
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GenerationProgress } from "../generation-progress";
import { GENERATION_STEPS } from "@/lib/constants";
import type { GenerationMetadata } from "@/types";

// Mock supabase client to prevent real polling
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null }),
        }),
      }),
    }),
  }),
}));

// Capture router mock so we can assert on it
const mockRouterRefresh = vi.fn();
const mockRouterPush = vi.fn();

vi.mock("next/navigation", async () => {
  return {
    useRouter: () => ({
      push: mockRouterPush,
      replace: vi.fn(),
      refresh: mockRouterRefresh,
      back: vi.fn(),
      prefetch: vi.fn(),
    }),
    usePathname: () => "/proposals/generating",
    useSearchParams: () => new URLSearchParams(),
    redirect: vi.fn(),
    notFound: vi.fn(),
  };
});

describe("GenerationProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the generating heading and progress bar", () => {
    render(
      <GenerationProgress
        proposal={{ id: "p-1", generation_metadata: null }}
      />
    );

    expect(screen.getByText("Generating your proposal...")).toBeInTheDocument();
    expect(screen.getByText("5%")).toBeInTheDocument();
    expect(screen.getByText("Usually takes 30-60 seconds")).toBeInTheDocument();
  });

  it("renders all generation steps", () => {
    render(
      <GenerationProgress
        proposal={{ id: "p-1", generation_metadata: null }}
      />
    );

    for (const step of GENERATION_STEPS) {
      // The current step gets "..." appended, others show as-is.
      // With null metadata, currentStep defaults to "Starting..." which
      // doesn't match any GENERATION_STEPS, so all steps render plain.
      expect(screen.getByText(step)).toBeInTheDocument();
    }
  });

  it("shows the current step with trailing ellipsis", () => {
    const metadata: GenerationMetadata = {
      current_step: "Analyzing client brief",
      completed_steps: [],
      progress: 10,
    };

    render(
      <GenerationProgress
        proposal={{ id: "p-1", generation_metadata: metadata }}
      />
    );

    expect(screen.getByText("Analyzing client brief...")).toBeInTheDocument();
  });

  it("marks completed steps and shows progress percentage", () => {
    const metadata: GenerationMetadata = {
      current_step: "Creating timeline",
      completed_steps: [
        "Analyzing client brief",
        "Researching client company",
        "Drafting scope of work",
      ],
      progress: 55,
    };

    render(
      <GenerationProgress
        proposal={{ id: "p-1", generation_metadata: metadata }}
      />
    );

    // Completed steps render without "..."
    expect(screen.getByText("Analyzing client brief")).toBeInTheDocument();
    expect(screen.getByText("Researching client company")).toBeInTheDocument();
    expect(screen.getByText("Drafting scope of work")).toBeInTheDocument();

    // Current step has "..."
    expect(screen.getByText("Creating timeline...")).toBeInTheDocument();

    // Progress percentage displayed
    expect(screen.getByText("55%")).toBeInTheDocument();
  });

  it("renders the error state with error message and try again button", () => {
    const metadata: GenerationMetadata = {
      current_step: "Drafting scope of work",
      completed_steps: ["Analyzing client brief", "Researching client company"],
      progress: 30,
      error: "AI generation timed out. Please try again.",
    };

    render(
      <GenerationProgress
        proposal={{ id: "p-1", generation_metadata: metadata }}
      />
    );

    expect(screen.getByText("Generation failed")).toBeInTheDocument();
    expect(
      screen.getByText("AI generation timed out. Please try again.")
    ).toBeInTheDocument();

    const tryAgainButton = screen.getByRole("button", { name: /try again/i });
    expect(tryAgainButton).toBeInTheDocument();
  });

  it("calls router.refresh when the try again button is clicked", async () => {
    const user = userEvent.setup();
    const metadata: GenerationMetadata = {
      current_step: "Analyzing client brief",
      completed_steps: [],
      progress: 5,
      error: "Something went wrong",
    };

    render(
      <GenerationProgress
        proposal={{ id: "p-1", generation_metadata: metadata }}
      />
    );

    const tryAgainButton = screen.getByRole("button", { name: /try again/i });
    await user.click(tryAgainButton);

    expect(mockRouterRefresh).toHaveBeenCalledTimes(1);
  });
});

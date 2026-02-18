import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Anthropic
const mockCreate = vi.fn();
vi.mock("@anthropic-ai/sdk", () => {
  return {
    default: class MockAnthropic {
      messages = { create: mockCreate };
    },
  };
});

import { promptClaude } from "@/lib/ai/client";

describe("promptClaude", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ANTHROPIC_API_KEY = "sk-ant-test-key";
  });

  it("returns text from standard response", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: "Generated proposal content" }],
    });

    const result = await promptClaude("You are a helper.", "Write a proposal.");
    expect(result).toBe("Generated proposal content");
  });

  it("returns text from extended thinking response", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        { type: "thinking", thinking: "Let me analyze this..." },
        { type: "text", text: "Thought-out proposal content" },
      ],
    });

    const result = await promptClaude("You are a helper.", "Write a proposal.", {
      useExtendedThinking: true,
    });
    expect(result).toBe("Thought-out proposal content");
  });

  it("returns empty string when no text block", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "thinking", thinking: "Only thinking..." }],
    });

    const result = await promptClaude("You are a helper.", "Write a proposal.", {
      useExtendedThinking: true,
    });
    expect(result).toBe("");
  });

  it("passes correct model for standard requests (claude-sonnet-4-5-20250929)", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: "Response" }],
    });

    await promptClaude("System prompt", "User prompt");

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "claude-sonnet-4-5-20250929",
      })
    );
  });

  it("passes correct model for extended thinking (claude-opus-4-6)", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: "Response" }],
    });

    await promptClaude("System prompt", "User prompt", {
      useExtendedThinking: true,
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "claude-opus-4-6",
      })
    );
  });

  it("uses default maxTokens of 4096 for standard requests", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: "Response" }],
    });

    await promptClaude("System prompt", "User prompt");

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        max_tokens: 4096,
      })
    );
  });

  it("passes custom maxTokens for standard requests", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: "Response" }],
    });

    await promptClaude("System prompt", "User prompt", {
      maxTokens: 8192,
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        max_tokens: 8192,
      })
    );
  });

  it("passes system prompt and user message correctly for standard requests", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: "Response" }],
    });

    await promptClaude("Be a helpful assistant.", "Hello there.");

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        system: "Be a helpful assistant.",
        messages: [{ role: "user", content: "Hello there." }],
      })
    );
  });

  it("combines system and user prompt for extended thinking requests", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: "Response" }],
    });

    await promptClaude("Be a helper.", "Do the thing.", {
      useExtendedThinking: true,
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: [{ role: "user", content: "Be a helper.\n\nDo the thing." }],
      })
    );
  });

  it("handles API error", async () => {
    mockCreate.mockRejectedValueOnce(new Error("API rate limit exceeded"));

    await expect(
      promptClaude("System prompt", "User prompt")
    ).rejects.toThrow("API rate limit exceeded");
  });
});

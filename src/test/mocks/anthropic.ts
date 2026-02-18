import { vi } from "vitest";

export const mockAnthropicResponse = {
  id: "msg_test",
  type: "message" as const,
  role: "assistant" as const,
  content: [
    {
      type: "text" as const,
      text: "Mock AI response content",
    },
  ],
  model: "claude-sonnet-4-5-20250929",
  stop_reason: "end_turn" as const,
  usage: { input_tokens: 100, output_tokens: 50 },
};

export const mockAnthropicThinkingResponse = {
  ...mockAnthropicResponse,
  content: [
    {
      type: "thinking" as const,
      thinking: "Let me analyze this brief...",
    },
    {
      type: "text" as const,
      text: '{"title": "Test Proposal", "executive_summary": "Summary"}',
    },
  ],
};

export function createMockAnthropicClient() {
  return {
    messages: {
      create: vi.fn().mockResolvedValue(mockAnthropicResponse),
    },
  };
}

export function mockAnthropicModule() {
  const client = createMockAnthropicClient();
  vi.mock("@anthropic-ai/sdk", () => ({
    default: vi.fn(() => client),
    Anthropic: vi.fn(() => client),
  }));
  return client;
}

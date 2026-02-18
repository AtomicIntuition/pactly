import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Resend client module
const mockSend = vi.fn();
vi.mock("@/lib/email/client", () => ({
  getResendClient: vi.fn(),
}));

// Mock the config module
vi.mock("@/lib/config", () => ({
  serverEnv: vi.fn(() => ({
    EMAIL_FROM: "Overture <noreply@useoverture.com>",
  })),
}));

import { getResendClient } from "@/lib/email/client";
import { sendProposalEmail, sendResponseNotification } from "@/lib/email/send";

const mockGetResendClient = vi.mocked(getResendClient);

describe("sendProposalEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends with correct to, subject, and html", async () => {
    mockGetResendClient.mockReturnValue({
      emails: { send: mockSend },
    } as unknown as ReturnType<typeof getResendClient>);
    mockSend.mockResolvedValueOnce({ id: "email_123" });

    const result = await sendProposalEmail({
      to: "client@example.com",
      proposalTitle: "Website Redesign",
      senderName: "John Doe",
      senderCompany: "Acme Corp",
      viewUrl: "https://app.example.com/share/abc123",
    });

    expect(result).toBe(true);
    expect(mockSend).toHaveBeenCalledOnce();

    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.from).toBe("Overture <noreply@useoverture.com>");
    expect(callArgs.to).toBe("client@example.com");
    expect(callArgs.subject).toBe("Proposal: Website Redesign");
    expect(callArgs.html).toContain("John Doe");
    expect(callArgs.html).toContain("Acme Corp");
    expect(callArgs.html).toContain("https://app.example.com/share/abc123");
  });

  it("returns false when Resend is not configured (getResendClient returns null)", async () => {
    mockGetResendClient.mockReturnValue(null);

    const result = await sendProposalEmail({
      to: "client@example.com",
      proposalTitle: "Website Redesign",
      senderName: "John Doe",
      senderCompany: "Acme Corp",
      viewUrl: "https://app.example.com/share/abc123",
    });

    expect(result).toBe(false);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns false on send error", async () => {
    mockGetResendClient.mockReturnValue({
      emails: { send: mockSend },
    } as unknown as ReturnType<typeof getResendClient>);
    mockSend.mockRejectedValueOnce(new Error("Network error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await sendProposalEmail({
      to: "client@example.com",
      proposalTitle: "Website Redesign",
      senderName: "John Doe",
      senderCompany: "Acme Corp",
      viewUrl: "https://app.example.com/share/abc123",
    });

    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to send proposal email:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("email contains Overture branding", async () => {
    mockGetResendClient.mockReturnValue({
      emails: { send: mockSend },
    } as unknown as ReturnType<typeof getResendClient>);
    mockSend.mockResolvedValueOnce({ id: "email_123" });

    await sendProposalEmail({
      to: "client@example.com",
      proposalTitle: "Test Proposal",
      senderName: "Jane",
      senderCompany: "Agency",
      viewUrl: "https://example.com/share/xyz",
    });

    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.html).toContain("Overture");
  });
});

describe("sendResponseNotification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends with accepted status", async () => {
    mockGetResendClient.mockReturnValue({
      emails: { send: mockSend },
    } as unknown as ReturnType<typeof getResendClient>);
    mockSend.mockResolvedValueOnce({ id: "email_456" });

    const result = await sendResponseNotification({
      to: "freelancer@example.com",
      proposalTitle: "Website Redesign",
      clientName: "Alice Smith",
      accepted: true,
    });

    expect(result).toBe(true);
    expect(mockSend).toHaveBeenCalledOnce();

    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.from).toBe("Overture <noreply@useoverture.com>");
    expect(callArgs.to).toBe("freelancer@example.com");
    expect(callArgs.subject).toBe("Proposal accepted: Website Redesign");
    expect(callArgs.html).toContain("accepted");
    expect(callArgs.html).toContain("Alice Smith");
    expect(callArgs.html).toContain("Website Redesign");
  });

  it("sends with declined status", async () => {
    mockGetResendClient.mockReturnValue({
      emails: { send: mockSend },
    } as unknown as ReturnType<typeof getResendClient>);
    mockSend.mockResolvedValueOnce({ id: "email_789" });

    const result = await sendResponseNotification({
      to: "freelancer@example.com",
      proposalTitle: "Mobile App Build",
      clientName: "Bob Jones",
      accepted: false,
    });

    expect(result).toBe(true);
    expect(mockSend).toHaveBeenCalledOnce();

    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.subject).toBe("Proposal declined: Mobile App Build");
    expect(callArgs.html).toContain("declined");
    expect(callArgs.html).toContain("Bob Jones");
  });

  it("returns false when Resend is not configured", async () => {
    mockGetResendClient.mockReturnValue(null);

    const result = await sendResponseNotification({
      to: "freelancer@example.com",
      proposalTitle: "Test Proposal",
      clientName: "Client",
      accepted: true,
    });

    expect(result).toBe(false);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("email contains Overture branding", async () => {
    mockGetResendClient.mockReturnValue({
      emails: { send: mockSend },
    } as unknown as ReturnType<typeof getResendClient>);
    mockSend.mockResolvedValueOnce({ id: "email_branding" });

    await sendResponseNotification({
      to: "freelancer@example.com",
      proposalTitle: "Test",
      clientName: "Client",
      accepted: true,
    });

    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.html).toContain("Overture");
  });
});

import { getResendClient } from "./client";
import { serverEnv } from "@/lib/config";

interface ProposalEmailParams {
  to: string;
  proposalTitle: string;
  senderName: string;
  senderCompany: string;
  viewUrl: string;
}

interface ResponseNotificationParams {
  to: string;
  proposalTitle: string;
  clientName: string;
  accepted: boolean;
}

export async function sendProposalEmail({
  to,
  proposalTitle,
  senderName,
  senderCompany,
  viewUrl,
}: ProposalEmailParams): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) return false;

  try {
    const env = serverEnv();
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to,
      subject: `Proposal: ${proposalTitle}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <p style="font-size: 15px; color: #292524; line-height: 1.6;">
            ${senderName} from <strong>${senderCompany}</strong> has sent you a proposal.
          </p>
          <h2 style="font-size: 20px; color: #0f172a; margin: 24px 0 16px;">${proposalTitle}</h2>
          <p style="font-size: 14px; color: #78716c; line-height: 1.6;">
            Review the full proposal, then accept or decline directly from the link below.
          </p>
          <div style="margin: 32px 0;">
            <a href="${viewUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
              View Proposal
            </a>
          </div>
          <p style="font-size: 12px; color: #a8a29e; margin-top: 40px;">
            Sent via Pactly
          </p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error("Failed to send proposal email:", err);
    return false;
  }
}

export async function sendResponseNotification({
  to,
  proposalTitle,
  clientName,
  accepted,
}: ResponseNotificationParams): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) return false;

  try {
    const env = serverEnv();
    const status = accepted ? "accepted" : "declined";
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to,
      subject: `Proposal ${status}: ${proposalTitle}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="font-size: 20px; color: #0f172a; margin-bottom: 16px;">
            Proposal ${status}
          </h2>
          <p style="font-size: 15px; color: #292524; line-height: 1.6;">
            <strong>${clientName || "Your client"}</strong> has <strong>${status}</strong> the proposal
            &ldquo;${proposalTitle}&rdquo;.
          </p>
          <p style="font-size: 12px; color: #a8a29e; margin-top: 40px;">
            Sent via Pactly
          </p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error("Failed to send response notification:", err);
    return false;
  }
}

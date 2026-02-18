import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

const styles = {
  body: {
    backgroundColor: "#1a1a1e",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  container: {
    margin: "0 auto",
    padding: "40px 20px",
    maxWidth: "560px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#fafafa",
    marginBottom: "16px",
  },
  text: {
    fontSize: "14px",
    lineHeight: "24px",
    color: "#e4e4e7",
  },
  muted: {
    fontSize: "14px",
    lineHeight: "24px",
    color: "#a1a1aa",
  },
  button: {
    backgroundColor: "#d4a853",
    color: "#09090b",
    padding: "12px 24px",
    borderRadius: "6px",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "14px",
    fontWeight: "600",
  },
  footer: {
    fontSize: "12px",
    color: "#71717a",
    marginTop: "32px",
    borderTop: "1px solid #27272a",
    paddingTop: "16px",
  },
};

// ─── Welcome Email ────────────────────────────────────────

export function WelcomeEmail({ name }: { name: string }): React.ReactElement {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Overture — start creating proposals!</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Welcome to Overture</Heading>
          <Text style={styles.text}>Hi {name},</Text>
          <Text style={styles.text}>
            Thanks for signing up! You&apos;re ready to start creating professional proposals
            powered by AI. Here&apos;s how to get started:
          </Text>
          <Text style={styles.text}>
            1. Paste a client brief or inquiry email{"\n"}
            2. Let our AI generate a tailored proposal{"\n"}
            3. Edit, polish, and send to your client
          </Text>
          <Section style={{ marginTop: "24px", marginBottom: "24px" }}>
            <Button style={styles.button} href={`${process.env.NEXT_PUBLIC_APP_URL}/proposals/new`}>
              Create Your First Proposal
            </Button>
          </Section>
          <Text style={styles.muted}>
            You have 5 free proposals to get started. Upgrade anytime for more.
          </Text>
          <Text style={styles.footer}>
            Overture — AI-powered proposals that close deals
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Proposal Shared Email ────────────────────────────────

export function ProposalSharedEmail({
  proposalTitle,
  senderName,
  senderCompany,
  viewUrl,
}: {
  proposalTitle: string;
  senderName: string;
  senderCompany: string;
  viewUrl: string;
}): React.ReactElement {
  return (
    <Html>
      <Head />
      <Preview>{senderCompany} has sent you a proposal</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>You have a new proposal</Heading>
          <Text style={styles.text}>
            {senderName} from {senderCompany} has sent you a proposal:
          </Text>
          <Text style={{ ...styles.text, fontWeight: "600", fontSize: "16px" }}>
            {proposalTitle}
          </Text>
          <Section style={{ marginTop: "24px", marginBottom: "24px" }}>
            <Button style={styles.button} href={viewUrl}>
              View Proposal
            </Button>
          </Section>
          <Text style={styles.muted}>
            Click the button above to review the proposal and respond.
          </Text>
          <Text style={styles.footer}>
            Sent via Overture
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Proposal Viewed Email ────────────────────────────────

export function ProposalViewedEmail({
  proposalTitle,
  clientName,
  viewCount,
}: {
  proposalTitle: string;
  clientName: string;
  viewCount: number;
}): React.ReactElement {
  return (
    <Html>
      <Head />
      <Preview>{clientName} viewed your proposal</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Your proposal was viewed</Heading>
          <Text style={styles.text}>
            {clientName} just viewed your proposal &quot;{proposalTitle}&quot;.
            {viewCount > 1 && ` This is view #${viewCount}.`}
          </Text>
          <Section style={{ marginTop: "24px", marginBottom: "24px" }}>
            <Button style={styles.button} href={`${process.env.NEXT_PUBLIC_APP_URL}/proposals`}>
              View Your Proposals
            </Button>
          </Section>
          <Text style={styles.footer}>
            Overture — AI-powered proposals that close deals
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Proposal Responded Email ─────────────────────────────

export function ProposalRespondedEmail({
  proposalTitle,
  clientName,
  accepted,
}: {
  proposalTitle: string;
  clientName: string;
  accepted: boolean;
}): React.ReactElement {
  return (
    <Html>
      <Head />
      <Preview>
        {clientName} {accepted ? "accepted" : "declined"} your proposal
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>
            Proposal {accepted ? "Accepted" : "Declined"}
          </Heading>
          <Text style={styles.text}>
            {clientName} has {accepted ? "accepted" : "declined"} your proposal &quot;
            {proposalTitle}&quot;.
          </Text>
          {accepted && (
            <Text style={styles.text}>
              Congratulations! Time to get to work. You can manage this proposal from your
              dashboard.
            </Text>
          )}
          <Section style={{ marginTop: "24px", marginBottom: "24px" }}>
            <Button style={styles.button} href={`${process.env.NEXT_PUBLIC_APP_URL}/proposals`}>
              View Proposal
            </Button>
          </Section>
          <Text style={styles.footer}>
            Overture — AI-powered proposals that close deals
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

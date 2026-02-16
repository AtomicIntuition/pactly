import { NextResponse, type NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { createClient } from "@/lib/supabase/server";
import { getProposal, getProfile } from "@/lib/supabase/queries";
import { ProposalPdf } from "@/lib/pdf/proposal-template";
import { resolveProposalLayout } from "@/lib/templates";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [proposal, profile] = await Promise.all([
    getProposal(supabase, id),
    getProfile(supabase, user.id),
  ]);

  if (!proposal || !profile) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (proposal.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const layout = resolveProposalLayout(proposal);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfElement = React.createElement(ProposalPdf, { proposal, profile, layout }) as any;
    const buffer = await renderToBuffer(pdfElement);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(proposal.title)}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}

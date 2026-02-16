"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Plus, MoreVertical, Mail, Globe, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ClientForm } from "@/components/clients/client-form";
import { deleteClientAction } from "@/actions/clients";
import type { Client } from "@/types";

interface ClientsContentProps {
  clients: Client[];
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function ClientsContent({ clients }: ClientsContentProps): React.ReactElement {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async (): Promise<void> => {
    if (!deleteId) return;
    const result = await deleteClientAction(deleteId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Client deleted");
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Manage your client database. Clients are automatically created when you generate proposals."
      >
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditClient(null);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-1.5 h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editClient ? "Edit Client" : "Add Client"}</DialogTitle>
            </DialogHeader>
            <ClientForm
              client={editClient}
              onSuccess={() => {
                setDialogOpen(false);
                setEditClient(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </PageHeader>

      {clients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No clients yet"
          description="Add clients manually or they'll be created automatically when you generate proposals."
          actionLabel="Add Client"
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Link key={client.id} href={`/clients/${client.id}`}>
              <Card className="rounded-xl border bg-card p-6 shadow-sm hover:bg-muted/50 transition-colors duration-150 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{client.name}</p>
                    {client.company && (
                      <p className="truncate text-xs text-muted-foreground">{client.company}</p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={(e) => e.preventDefault()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          setEditClient(client);
                          setDialogOpen(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          setDeleteId(client.id);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-2">
                  {client.email && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.website && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Globe className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{client.website}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-4 border-t pt-4 text-xs text-muted-foreground">
                  <span>{client.proposal_count} proposals</span>
                  {client.total_value_cents > 0 && (
                    <span className="font-mono tabular-nums">
                      {formatCurrency(client.total_value_cents)}
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete client?"
        description="This won't delete their proposals, but the client record will be removed."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadLogoAction, deleteLogoAction } from "@/actions/settings";

interface LogoUploadProps {
  currentLogoUrl: string | null;
}

export function LogoUpload({ currentLogoUrl }: LogoUploadProps): React.ReactElement {
  const [logoUrl, setLogoUrl] = useState(currentLogoUrl);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadLogoAction(formData);
    setUploading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      setLogoUrl(result.logoUrl ?? null);
      toast.success("Logo uploaded");
    }

    // Reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDelete = async (): Promise<void> => {
    setDeleting(true);
    const result = await deleteLogoAction();
    setDeleting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      setLogoUrl(null);
      toast.success("Logo removed");
    }
  };

  return (
    <div className="flex items-center gap-4">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="Company logo"
          className="h-12 w-12 rounded-lg object-contain border bg-white"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25">
          <Upload className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : null}
          {logoUrl ? "Replace" : "Upload"}
        </Button>

        {logoUrl && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="text-muted-foreground"
          >
            {deleting ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : <X className="mr-1.5 h-3 w-3" />}
            Remove
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}

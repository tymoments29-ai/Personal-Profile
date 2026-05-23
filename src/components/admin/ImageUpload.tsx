"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string | null;
  onChange: (value: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Upload Image" }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert(`${file.name} exceeds 4MB limit`);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blog-thumbnails"); // Optional categorization

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await res.json();
      onChange(data.url);
    } catch (error: any) {
      alert(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2 w-full">
      {value ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border group">
          <Image src={value} alt="Uploaded preview" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onChange("")}
            >
              <X className="w-4 h-4 mr-2" />
              Remove Image
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-colors ${
            isUploading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
          } ${
            isDragging ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
          }`}
          onDragOver={(e) => {
            if (isUploading) return;
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFile(e.target.files[0]);
              }
            }}
          />
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
            {isUploading ? (
              <>
                <div className="w-10 h-10 mb-3 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="mb-2 text-sm font-medium text-primary">Uploading to Vercel Blob...</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-10 h-10 mb-3" />
                <p className="mb-2 text-sm font-medium">
                  <span className="text-primary font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs">PNG, JPG or WEBP (Max 4MB)</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

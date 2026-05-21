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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        // Create canvas to resize image
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to base64 jpeg
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        onChange(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
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
          className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-colors cursor-pointer bg-muted/50 ${
            isDragging ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFile(e.target.files[0]);
              }
            }}
          />
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
            <UploadCloud className="w-10 h-10 mb-3" />
            <p className="mb-2 text-sm font-medium">
              <span className="text-primary font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs">PNG, JPG or WEBP (Max. 1200x1200px)</p>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Star } from "lucide-react";
import Image from "next/image";

interface MultiImageUploadProps {
  images: string[];
  coverImage: string | null;
  onChange: (images: string[], coverImage: string | null) => void;
  label?: string;
}

export function MultiImageUpload({ images = [], coverImage, onChange, label = "Upload Images" }: MultiImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert(`${file.name} exceeds 2MB limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "portfolio-gallery");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.error || "Failed to upload image");
        }
        const data = await res.json();
        uploadedUrls.push(data.url);
      }

      const newImages = [...images, ...uploadedUrls];
      // Automatically set the first uploaded image as cover if none exists
      const newCover = coverImage ? coverImage : (newImages.length > 0 ? newImages[0] : null);
      onChange(newImages, newCover);
    } catch (error: any) {
      alert(error.message || "Failed to upload images");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (urlToRemove: string) => {
    const newImages = images.filter(url => url !== urlToRemove);
    // If the removed image was the cover, pick the first available one as the new cover
    let newCover = coverImage;
    if (coverImage === urlToRemove) {
      newCover = newImages.length > 0 ? newImages[0] : null;
    }
    onChange(newImages, newCover);
  };

  const setAsCover = (url: string) => {
    onChange(images, url);
  };

  return (
    <div className="space-y-4 w-full">
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative w-full aspect-video rounded-xl overflow-hidden border border-border group">
              <Image src={url} alt={`Gallery image ${index + 1}`} fill className="object-cover" />
              
              {/* Cover Badge */}
              {coverImage === url && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md flex items-center shadow-md">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Cover
                </div>
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                {coverImage !== url && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setAsCover(url)}
                    className="h-8"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Set as Cover
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(url)}
                  className="h-8"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-colors ${
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
          multiple
          className="hidden"
          disabled={isUploading}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
            }
          }}
        />
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
          {isUploading ? (
            <>
              <div className="w-8 h-8 mb-3 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="mb-2 text-sm font-medium text-primary">Uploading images...</p>
            </>
          ) : (
            <>
              <UploadCloud className="w-8 h-8 mb-3" />
              <p className="mb-2 text-sm font-medium text-center px-4">
                <span className="text-primary font-semibold">Click to upload</span> or drag and drop multiple images
              </p>
              <p className="text-xs">PNG, JPG or WEBP (Max 2MB each)</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

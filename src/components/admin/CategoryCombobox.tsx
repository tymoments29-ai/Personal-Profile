"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryCombobox({ value, onChange }: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch categories from DB on mount
  useEffect(() => {
    fetch("/api/blog/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() =>
        setCategories(["General", "DevOps", "Linux", "Docker", "Kubernetes", "CI/CD", "Cloud", "Security"])
      )
      .finally(() => setLoading(false));
  }, []);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setInputValue("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = categories.filter((cat) =>
    cat.toLowerCase().includes(inputValue.toLowerCase())
  );

  const canCreate =
    inputValue.trim().length > 0 &&
    !categories.some((c) => c.toLowerCase() === inputValue.trim().toLowerCase());

  const handleSelect = (cat: string) => {
    onChange(cat);
    setOpen(false);
    setInputValue("");
  };

  const handleCreate = () => {
    const newCat = inputValue.trim();
    if (!newCat) return;
    const updated = [...categories, newCat].sort();
    setCategories(updated);
    onChange(newCat);
    setOpen(false);
    setInputValue("");
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between h-12 px-3 rounded-md border border-border bg-muted text-sm text-foreground hover:bg-muted/80 transition-colors"
      >
        <span className={cn("truncate", !value && "text-muted-foreground")}>
          {value || "Pilih atau ketik kategori baru..."}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-border">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (canCreate) handleCreate();
                  else if (filtered.length === 1) handleSelect(filtered[0]);
                }
                if (e.key === "Escape") {
                  setOpen(false);
                  setInputValue("");
                }
              }}
              placeholder="Cari atau ketik kategori baru..."
              className="w-full text-sm px-2 py-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>

          {/* Options */}
          <div className="max-h-52 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">Memuat...</div>
            ) : filtered.length === 0 && !canCreate ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">Tidak ada hasil.</div>
            ) : (
              <>
                {filtered.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleSelect(cat)}
                    className={cn(
                      "w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-accent transition-colors",
                      value === cat && "bg-accent"
                    )}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0 text-primary",
                        value === cat ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {cat}
                  </button>
                ))}

                {/* Create new */}
                {canCreate && (
                  <button
                    type="button"
                    onClick={handleCreate}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-primary hover:bg-accent transition-colors border-t border-border"
                  >
                    <Plus className="h-4 w-4 shrink-0" />
                    Buat &quot;{inputValue.trim()}&quot;
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

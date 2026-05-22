"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CategoryComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryCombobox({ value, onChange }: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch categories from DB on mount
  useEffect(() => {
    fetch("/api/blog/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories || []);
      })
      .catch(() => {
        setCategories(["General", "DevOps", "Linux", "Docker", "Kubernetes", "CI/CD", "Cloud", "Security"]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Focus input when popover opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setInputValue("");
    }
  }, [open]);

  const filtered = categories.filter((cat) =>
    cat.toLowerCase().includes(inputValue.toLowerCase())
  );

  const canCreate =
    inputValue.trim() &&
    !categories.some((c) => c.toLowerCase() === inputValue.trim().toLowerCase());

  const handleSelect = (cat: string) => {
    onChange(cat);
    setOpen(false);
  };

  const handleCreate = () => {
    const newCat = inputValue.trim();
    if (!newCat) return;
    setCategories((prev) => [...prev, newCat].sort());
    onChange(newCat);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 bg-muted border-border text-foreground hover:bg-muted/80 font-normal"
        >
          <span className={value ? "text-foreground" : "text-muted-foreground"}>
            {value || "Pilih atau tambah kategori..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        {/* Search input */}
        <div className="p-2 border-b border-border">
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canCreate) handleCreate();
            }}
            placeholder="Cari atau ketik kategori baru..."
            className="w-full text-sm px-2 py-1.5 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>

        {/* Options list */}
        <div className="max-h-52 overflow-y-auto py-1">
          {loading ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">Memuat...</div>
          ) : filtered.length === 0 && !canCreate ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">Tidak ada kategori.</div>
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
                    className={cn("h-4 w-4 shrink-0 text-primary", value === cat ? "opacity-100" : "opacity-0")}
                  />
                  {cat}
                </button>
              ))}

              {/* Create new category option */}
              {canCreate && (
                <button
                  type="button"
                  onClick={handleCreate}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-primary hover:bg-accent transition-colors border-t border-border mt-1"
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  Buat &quot;{inputValue.trim()}&quot;
                </button>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

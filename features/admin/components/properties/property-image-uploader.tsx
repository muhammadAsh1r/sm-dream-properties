"use client";

import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ImageItem = {
  url: string;
  alt?: string;
  order: number;
};

type PropertyImageUploaderProps = {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
};

function SortableImage({
  image,
  index,
  onRemove,
}: {
  image: ImageItem;
  index: number;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: image.url });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted",
        isDragging && "z-10 opacity-80 shadow-lg"
      )}
    >
      <Image src={image.url} alt={image.alt ?? ""} fill className="object-cover" sizes="200px" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-black/40 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          className="cursor-grab text-white active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical className="size-4" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-white hover:text-red-300"
          aria-label="Remove image"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      {index === 0 && (
        <span className="absolute bottom-2 left-2 rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-secondary">
          COVER
        </span>
      )}
    </div>
  );
}

export function PropertyImageUploader({ images, onChange }: PropertyImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      setUploading(true);
      const newImages: ImageItem[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          newImages.push({ url: data.url, order: images.length + newImages.length });
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Upload failed");
        }
      }

      if (newImages.length) {
        onChange([...images, ...newImages].map((img, i) => ({ ...img, order: i })));
        toast.success(`${newImages.length} image(s) uploaded`);
      }
      setUploading(false);
    },
    [images, onChange]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((i) => i.url === active.id);
    const newIndex = images.findIndex((i) => i.url === over.id);
    onChange(arrayMove(images, oldIndex, newIndex).map((img, i) => ({ ...img, order: i })));
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 transition-colors hover:border-primary/40 hover:bg-primary/5"
      >
        <Upload className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="mt-3 text-sm font-medium text-foreground">
          Drag & drop images here
        </p>
        <p className="mt-1 text-xs text-muted-foreground">WebP, JPG, PNG — max 10MB each</p>
        <label className="mt-4 cursor-pointer">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            onChange={(e) => e.target.files && uploadFiles(e.target.files)}
            disabled={uploading}
          />
          <span className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-muted">
            {uploading ? "Uploading..." : "Browse Files"}
          </span>
        </label>
      </div>

      {images.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map((i) => i.url)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((image, index) => (
                <SortableImage
                  key={image.url}
                  image={image}
                  index={index}
                  onRemove={() =>
                    onChange(
                      images.filter((i) => i.url !== image.url).map((img, i) => ({ ...img, order: i }))
                    )
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

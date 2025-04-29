import React, { useState, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ThumbnailUploaderProps {
  initialThumbnail?: string;
  onChange: (thumbnailSrc: string) => void;
  onFileSelect: (file: File | null) => void;
}

const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({
  initialThumbnail = "/placeholder.svg",
  onChange,
  onFileSelect,
}) => {
  const [thumbnailSrc, setThumbnailSrc] = useState<string>(initialThumbnail);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setThumbnailSrc(result);
      };
      reader.readAsDataURL(file);
      onFileSelect(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = () => {
    const defaultThumbnail = "/placeholder.svg";
    setThumbnailSrc(defaultThumbnail);
    onChange(defaultThumbnail);
    onFileSelect(null);
  };

  return (
    <div className="mb-8">
      <Label
        htmlFor="thumbnail"
        className="text-base font-semibold flex items-center gap-2 mb-2"
      >
        <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
          <Upload size={16} className="text-white" />
        </div>
        Course Thumbnail
      </Label>
      <div className="border-2 rounded-lg overflow-hidden bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="relative aspect-square w-full">
            <Image
              src={thumbnailSrc}
              alt="Course thumbnail"
              className="object-cover"
              fill
            />
          </div>

          <div className="p-4 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium mb-1">Thumbnail Image</p>
              <p className="text-xs text-gray-500 mb-3">
                Upload a high-quality image that represents your course content
              </p>
              <ul className="text-xs text-gray-500 list-disc pl-5 space-y-1">
                <li>Recommended size: 1280x720px</li>
                <li>Maximum file size: 5MB</li>
                <li>Formats: JPG, PNG, SVG</li>
              </ul>
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                
                variant="outline"
                size="sm"
                onClick={triggerFileInput}
                className="text-xs flex-1"
              >
                Replace Image
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-red-500 hover:text-red-600 hover:bg-red-100 bg-red-50"
                onClick={handleRemove}
              >
                Remove
              </Button>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailUploader;

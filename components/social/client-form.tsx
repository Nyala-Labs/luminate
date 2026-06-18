"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash, Loader2, FileText } from "lucide-react";
import {
  deletePostMedia,
  uploadPostMedia,
} from "@/app/dashboard/social/actions";

export function NewPostForm({
  postId,
  initialMedia = [],
}: {
  postId: string;
  initialMedia?: {
    id: string;
    driveFileId: string;
    name?: string;
    mimeType?: string;
    thumbnailLink?: string;
    webViewLink?: string;
  }[];
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingMedia, setExistingMedia] = useState(initialMedia);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [captions, setCaptions] = useState({
    instagram: "",
    linkedin: "",
    facebook: "",
  });
  const [activePlatform, setActivePlatform] = useState<
    "instagram" | "linkedin" | "facebook"
  >("instagram");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);

      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingMedia = async (mediaId: string) => {
    await deletePostMedia(mediaId);
    setExistingMedia((prev) => prev.filter((m) => m.id !== mediaId));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      await uploadPostMedia(postId, formData);
      alert("Media uploaded successfully");
      window.location.reload();
    } catch (error) {
      alert("Error uploading media");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
        />

        {/* Existing + Preview Grid view */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {existingMedia.map((media) => (
            <div
              key={media.id}
              className="relative group rounded-md overflow-hidden bg-zinc-900 border border-zinc-800 p-2 flex flex-col items-center justify-center"
            >
              {media.thumbnailLink ? (
                <img
                  src={`/api/social/media/${media.driveFileId}`}
                  alt={media.name}
                  className="w-full h-24 object-cover"
                />
              ) : (
                <FileText size={32} className="text-zinc-600 mb-2" />
              )}
              <span className="text-xs text-zinc-500 truncate w-full text-center mt-2">
                {media.name || "File"}
              </span>
              <button
                onClick={() => removeExistingMedia(media.id)}
                className="absolute top-1 right-1 bg-red-500/80 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative group rounded-md overflow-hidden"
            >
              <img
                src={preview}
                alt="preview"
                className="w-full h-32 object-cover"
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-red-500/80 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>

        <Button
          onClick={handleUpload}
          disabled={files.length === 0 || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Media"
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {/* ... captions code ... */}
        <div className="flex gap-2">
          {(["instagram", "linkedin", "facebook"] as const).map((platform) => (
            <Button
              key={platform}
              variant={activePlatform === platform ? "default" : "outline"}
              onClick={() => setActivePlatform(platform)}
            >
              {platform}
            </Button>
          ))}
        </div>
        <Textarea
          value={captions[activePlatform]}
          onChange={(e) =>
            setCaptions((prev) => ({
              ...prev,
              [activePlatform]: e.target.value,
            }))
          }
          placeholder={`Caption for ${activePlatform}`}
          rows={5}
        />
      </div>

      <Button
        className="w-full"
        disabled={
          (files.length === 0 && existingMedia.length === 0) || isUploading
        }
      >
        Submit / Schedule
      </Button>
    </div>
  );
}

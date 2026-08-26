"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import styles from "./PhotoUploadField.module.css";

const MAX_DIMENSION = 500;
const JPEG_QUALITY = 0.85;

function resizeToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not read image."));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported."));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function PhotoUploadField({ name, required }: { name: string; required?: boolean }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be under 8MB.");
      return;
    }
    try {
      const dataUrl = await resizeToDataUrl(file);
      setPreview(dataUrl);
    } catch {
      setError("Could not process that image. Please try another file.");
    }
  }

  return (
    <div className={styles.wrap}>
      <input type="hidden" name={name} value={preview ?? ""} />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        type="button"
        className={preview ? `${styles.dropzone} ${styles.dropzoneFilled}` : styles.dropzone}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Passport photo preview" className={styles.previewImg} />
        ) : (
          <>
            <Icon name="user" size={26} color="#A85F1E" />
            <span className={styles.dropzoneLabel}>Upload a photo</span>
          </>
        )}
        {preview ? <span className={styles.changeOverlay}>Change</span> : null}
      </button>
      {required && !preview ? <div className={styles.hint}>A photo is required.</div> : null}
      {error ? <div className={styles.error}>{error}</div> : null}
    </div>
  );
}

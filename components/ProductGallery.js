"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { imageUrl } from "@/lib/api";
import { TEST_IDS } from "./testIds";

// Determines if media item is a video based on type, keys, or file extension
function isVideoItem(item) {
  if (!item) return false;
  if (item.type === "video" || item.media_type === "video" || item.is_video) {
    return true;
  }
  const path =
    typeof item === "string"
      ? item
      : item.video_url || item.image_path || item.url || "";
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(path);
}

// Generates an offscreen canvas snapshot from a video URL at a specific second
function generateVideoSnapshot(sourceUrl, atTime = 0.5) {
  return new Promise((resolve, reject) => {
    if (!sourceUrl || typeof window === "undefined") {
      return reject(new Error("Invalid environment or URL"));
    }

    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    };

    video.src = sourceUrl;

    video.addEventListener("loadedmetadata", () => {
      video.currentTime = Math.min(atTime, Math.max(0, video.duration - 0.1));
    });

    video.addEventListener("seeked", () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        cleanup();
        resolve(dataUrl);
      } catch (err) {
        cleanup();
        reject(err);
      }
    });

    video.addEventListener("error", () => {
      cleanup();
      reject(new Error("Unable to capture video snapshot"));
    });
  });
}

// Play icon overlay badge for video thumbnails
function VideoPlayBadge() {
  return (
    <span
      className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center bg-dark bg-opacity-75 text-white rounded-circle shadow-sm"
      style={{ width: "24px", height: "24px", pointerEvents: "none" }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        width="12"
        height="12"
        style={{ marginLeft: "2px" }}
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

export default function ProductGallery({
  images = [],
  videos = [],
  title = "Product",
}) {
  const [i, setI] = useState(0);
  const [snapshots, setSnapshots] = useState({});
  const strip = useRef(null);

  // Normalize images and optional videos into one unified media list
  const mediaList = useMemo(() => {
    const formattedImages = images.map((img, idx) => {
      const isVid = isVideoItem(img);
      return {
        id: img.id ?? `img-${idx}`,
        type: isVid ? "video" : "image",
        src:
          img.image_path ||
          img.src ||
          img.url ||
          (typeof img === "string" ? img : ""),
        poster: img.poster || img.thumbnail || "",
      };
    });

    const formattedVideos = videos.map((vid, idx) => ({
      id: vid.id ?? `vid-${idx}`,
      type: "video",
      src:
        vid.video_url ||
        vid.src ||
        vid.image_path ||
        (typeof vid === "string" ? vid : ""),
      poster: vid.poster || vid.thumbnail || "",
    }));

    return [...formattedImages, ...formattedVideos];
  }, [images, videos]);

  // Automatically generate snapshots for any video lacking a poster image
  useEffect(() => {
    mediaList.forEach((item) => {
      if (item.type === "video" && !item.poster && !snapshots[item.src]) {
        const fullSrc = imageUrl(item.src);
        generateVideoSnapshot(fullSrc, 0.5)
          .then((snapshotUrl) => {
            setSnapshots((prev) => ({
              ...prev,
              [item.src]: snapshotUrl,
            }));
          })
          .catch((err) => {
            console.warn("Snapshot fallback active:", err.message);
          });
      }
    });
  }, [mediaList, snapshots]);

  const selectMedia = (index) => {
    if (!mediaList.length) return;
    setI((index + mediaList.length) % mediaList.length);
  };

  // Keep selected thumbnail in view inside the scroll strip
  useEffect(() => {
    const el = strip.current?.children[i];
    if (el && strip.current) {
      strip.current.scrollTo({
        left: el.offsetLeft - strip.current.offsetLeft - 8,
        behavior: "smooth",
      });
    }
  }, [i]);

  if (!mediaList.length) {
    return (
      <div
        className="gallery__main skeleton"
        role="img"
        aria-label="No media available"
      />
    );
  }

  const activeMedia = mediaList[i] || mediaList[0];
  const activeSrc = imageUrl(activeMedia.src);
  const activePoster = activeMedia.poster
    ? imageUrl(activeMedia.poster)
    : snapshots[activeMedia.src] || undefined;

  return (
    <div
      className="gallery"
      role="group"
      aria-label={`${title} product gallery`}
    >
      {/* Main Preview: Video Player or Image */}
      <div className="gallery__stage position-relative overflow-hidden rounded-2">
        {activeMedia.type === "video" ? (
          <video
            key={activeSrc}
            className="gallery__main gallery__main--video rounded-2 w-100"
            controls
            playsInline
            poster={activePoster}
            style={{
              maxHeight: "500px",
              objectFit: "contain",
              backgroundColor: "#000",
            }}
          >
            <source src={activeSrc} />
            Your browser does not support playing this video.
          </video>
        ) : (
          <img
            className="gallery__main rounded-2 w-100"
            src={activeSrc}
            alt={`${title} - image ${i + 1}`}
            style={{ maxHeight: "500px", objectFit: "contain" }}
          />
        )}
      </div>

      {/* Thumbnails Horizontal Strip */}
      {mediaList.length > 1 && (
        <div className="gallery__strip mt-2 position-relative">
          <div className="gallery__thumbs d-flex gap-2" ref={strip}>
            {mediaList.map((m, idx) => {
              const effectiveThumb = m.poster
                ? imageUrl(m.poster)
                : snapshots[m.src] ||
                  (m.type === "image" ? imageUrl(m.src) : "");

              const isCurrent = idx === i;

              return (
                <button
                  key={m.id}
                  type="button"
                  className={`gallery__thumb position-relative border rounded-2 p-0 overflow-hidden ${
                    isCurrent
                      ? "is-active border-primary"
                      : "border-secondary-subtle"
                  }`}
                  onClick={() => selectMedia(idx)}
                  aria-label={`Show ${m.type} ${idx + 1}`}
                  aria-current={isCurrent ? "true" : undefined}
                  data-testid={
                    TEST_IDS?.productGalleryThumbnail
                      ? TEST_IDS.productGalleryThumbnail(idx)
                      : undefined
                  }
                  style={{ width: "64px", height: "64px", flexShrink: 0 }}
                >
                  {effectiveThumb ? (
                    <>
                      <img
                        src={effectiveThumb}
                        alt=""
                        loading="lazy"
                        className="w-100 h-100 object-fit-cover"
                      />
                      {m.type === "video" && <VideoPlayBadge />}
                    </>
                  ) : (
                    <div className="w-100 h-100 bg-dark d-flex align-items-center justify-content-center text-white">
                      <VideoPlayBadge />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <button
            className="gallery__arrow gallery__arrow--previous"
            type="button"
            onClick={() => selectMedia(i - 1)}
            aria-label="Previous product media"
            data-testid={TEST_IDS?.productGalleryPrevious}
          >
            ‹
          </button>
          <button
            className="gallery__arrow gallery__arrow--next"
            type="button"
            onClick={() => selectMedia(i + 1)}
            aria-label="Next product media"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

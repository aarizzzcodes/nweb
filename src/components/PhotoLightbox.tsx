import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Maximize2, ShieldCheck, ChevronLeft, ChevronRight, FileImage } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  sensorName: string;
  sensorModel: string;
  photos: string[];
  initialIndex?: number;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  isOpen,
  onClose,
  sensorName,
  sensorModel,
  photos,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomLevel(1);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos.length]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];
  const filename = currentPhoto.split('/').pop() || currentPhoto;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    setZoomLevel(1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    setZoomLevel(1);
  };

  const zoomIn = () => setZoomLevel((z) => Math.min(z + 0.35, 3.0));
  const zoomOut = () => setZoomLevel((z) => Math.max(z - 0.35, 0.65));
  const resetZoom = () => setZoomLevel(1);

  return (
    <AnimatePresence>
      <div className="photo-lightbox-backdrop" onClick={onClose}>
        <motion.div
          className="photo-lightbox-modal"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="photo-lightbox-header">
            <div className="photo-lightbox-title-area">
              <span className="photo-badge">
                <ShieldCheck size={14} color="#10b981" /> Verified Hardware Archive
              </span>
              <h3>
                {sensorName} <span className="model-chip">{sensorModel}</span>
              </h3>
              <p className="photo-filename-label">
                <FileImage size={13} /> Hardware Inspection • Angle {currentIndex + 1} of {photos.length}
              </p>
            </div>

            {/* Toolbar Controls */}
            <div className="photo-lightbox-actions">
              <div className="zoom-controls-group">
                <button className="lightbox-tool-btn" onClick={zoomOut} title="Zoom out">
                  <ZoomOut size={16} />
                </button>
                <span className="zoom-level-text">{Math.round(zoomLevel * 100)}%</span>
                <button className="lightbox-tool-btn" onClick={zoomIn} title="Zoom in">
                  <ZoomIn size={16} />
                </button>
                <button className="lightbox-tool-btn" onClick={resetZoom} title="Reset zoom">
                  <RotateCcw size={15} />
                </button>
              </div>

              <button className="lightbox-close-btn" onClick={onClose} title="Close inspector (Esc)">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Photo Display Viewport */}
          <div className="photo-lightbox-viewport">
            <motion.img
              key={currentPhoto}
              src={currentPhoto}
              alt={`${sensorName} hardware capture`}
              className="photo-lightbox-img"
              style={{
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)',
                cursor: zoomLevel > 1 ? 'grab' : 'zoom-in',
              }}
              onClick={() => {
                if (zoomLevel === 1) zoomIn();
                else resetZoom();
              }}
            />

            {/* Previous / Next Navigation Arrows */}
            {photos.length > 1 && (
              <>
                <button className="lightbox-nav-arrow left" onClick={handlePrev} title="Previous photo">
                  <ChevronLeft size={28} />
                </button>
                <button className="lightbox-nav-arrow right" onClick={handleNext} title="Next photo">
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>

          {/* Footer Gallery Selector */}
          {photos.length > 1 && (
            <div className="photo-lightbox-footer">
              <div className="photo-thumbs-strip">
                {photos.map((p, idx) => {
                  const thumbName = decodeURIComponent(p.split('/').pop() || `Photo ${idx + 1}`);
                  return (
                    <button
                      key={p}
                      className={`lightbox-thumb-btn ${idx === currentIndex ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setZoomLevel(1);
                      }}
                    >
                      <img src={p} alt={`Thumbnail ${idx + 1}`} />
                      <span>{thumbName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

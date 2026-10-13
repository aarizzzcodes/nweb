import React, { useState } from 'react';
import {
  X,
  Cpu,
  Zap,
  Activity,
  Code2,
  Copy,
  CheckCircle2,
  Upload,
  Video,
  FileImage,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SensorItem } from '../types';
import { resolveMediaPath } from '../utils/media';

interface SensorMediaItem {
  url: string;
  type: 'image' | 'video';
  label?: string;
}

interface SensorDetailModalProps {
  sensor: SensorItem | null;
  onClose: () => void;
  customMediaList?: SensorMediaItem[];
  onAttachMedia?: (sensorId: string, url: string, type: 'image' | 'video', slotIndex?: number) => void;
}

export const SensorDetailModal: React.FC<SensorDetailModalProps> = ({
  sensor,
  onClose,
  customMediaList = [],
  onAttachMedia,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [simValue, setSimValue] = useState<number | boolean>(
    sensor?.simulation?.initialValue ?? 0
  );
  const [triggerPulse, setTriggerPulse] = useState(false);

  if (!sensor) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sensor.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    slotIndex: number = 0
  ) => {
    const file = e.target.files?.[0];
    if (!file || !onAttachMedia) return;

    const isVideo = file.type.startsWith('video');
    const url = URL.createObjectURL(file);
    onAttachMedia(sensor.id, url, isVideo ? 'video' : 'image', slotIndex);
    setActivePhotoIdx(slotIndex);
  };

  const handleTrigger = () => {
    setTriggerPulse(true);
    setTimeout(() => setTriggerPulse(false), 1200);
  };

  // Compile active gallery items (from customMediaList or sensor defaults)
  const galleryItems: SensorMediaItem[] = [...customMediaList];

  // If no custom media, populate with sensor suggested photos
  if (galleryItems.length === 0) {
    if (sensor.userUploadedFilename1) {
      galleryItems.push({
        url: resolveMediaPath(`media/sensors/${sensor.userUploadedFilename1}`),
        type: 'image',
        label: `Photo 1 (${sensor.userUploadedFilename1})`,
      });
    } else if (sensor.recommendedPhoto) {
      galleryItems.push({
        url: resolveMediaPath(sensor.recommendedPhoto),
        type: 'image',
        label: 'Photo 1',
      });
    }

    if (sensor.userUploadedFilename2) {
      galleryItems.push({
        url: resolveMediaPath(`media/sensors/${sensor.userUploadedFilename2}`),
        type: 'image',
        label: `Photo 2 (${sensor.userUploadedFilename2})`,
      });
    } else if (sensor.recommendedPhoto2) {
      galleryItems.push({
        url: resolveMediaPath(sensor.recommendedPhoto2),
        type: 'image',
        label: 'Photo 2',
      });
    }
  }

  const currentItem = galleryItems[activePhotoIdx] || galleryItems[0];

  return (
    <AnimatePresence>
      <div className="sensor-modal-backdrop" onClick={onClose}>
        <motion.div
          className="sensor-detail-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 25 }}
          transition={{ duration: 0.25 }}
        >
          {/* Header */}
          <div className="sensor-modal-header">
            <div>
              <div className="sensor-meta-pills">
                <span className="badge category-pill">{sensor.categoryLabel}</span>
                <span className="badge model-pill">{sensor.model}</span>
                <span className="badge volt-pill">
                  <Zap size={12} /> {sensor.voltage}
                </span>
                {galleryItems.length > 1 && (
                  <span className="badge count-pill">
                    <FileImage size={12} /> {galleryItems.length} Photos in Gallery
                  </span>
                )}
              </div>
              <h2>{sensor.name}</h2>
            </div>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close sensor details">
              <X size={20} />
            </button>
          </div>

          <div className="sensor-detail-body">
            {/* Multi-Photo Gallery Showcase Section */}
            <div className="sensor-media-section">
              <div className="media-gallery-container">
                {/* Main Display Window */}
                <div className="media-player-wrapper">
                  {currentItem?.type === 'video' ? (
                    <video
                      key={currentItem.url}
                      src={currentItem.url}
                      controls
                      autoPlay
                      muted
                      loop
                      className="sensor-media-box"
                    />
                  ) : (
                    <img
                      key={currentItem?.url}
                      src={currentItem?.url}
                      alt={`${sensor.name} - Photo ${activePhotoIdx + 1}`}
                      className="sensor-media-box"
                      onError={(e) => {
                        // If file not yet placed in public, show styled placeholder
                        (e.target as HTMLElement).style.display = 'none';
                        const parent = (e.target as HTMLElement).parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.media-fallback-view');
                          if (fallback) (fallback as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  )}

                  {/* Fallback View when local file hasn't been placed yet */}
                  <div className="media-fallback-view" style={{ display: 'none' }}>
                    <div className="fallback-card-inner">
                      <Cpu size={36} className="circuit-icon" />
                      <h4>Photo Slot Ready ({activePhotoIdx === 0 ? sensor.userUploadedFilename1 || 'Photo 1' : sensor.userUploadedFilename2 || 'Photo 2'})</h4>
                      <p>
                        Drop <code>{activePhotoIdx === 0 ? sensor.userUploadedFilename1 || sensor.recommendedPhoto : sensor.userUploadedFilename2 || sensor.recommendedPhoto2}</code> into <code>public/media/sensors/</code> or attach it now:
                      </p>
                      <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                        <Upload size={16} /> Attach This Photo Now
                        <input
                          type="file"
                          accept="image/*,video/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileUpload(e, activePhotoIdx)}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Navigation Arrows if multiple photos */}
                  {galleryItems.length > 1 && (
                    <div className="gallery-nav-arrows">
                      <button
                        className="arrow-nav-btn left"
                        onClick={() =>
                          setActivePhotoIdx((prev) =>
                            prev === 0 ? galleryItems.length - 1 : prev - 1
                          )
                        }
                        aria-label="Previous photo"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        className="arrow-nav-btn right"
                        onClick={() =>
                          setActivePhotoIdx((prev) =>
                            prev === 0 ? 1 : (prev + 1) % galleryItems.length
                          )
                        }
                        aria-label="Next photo"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}

                  {/* Active Photo Badge */}
                  <div className="media-attached-badge">
                    <span>
                      Photo {activePhotoIdx + 1} of {galleryItems.length || 1}
                    </span>
                    {sensor.userUploadedFilename1 && (
                      <span className="filename-tag">
                        • {activePhotoIdx === 0 ? sensor.userUploadedFilename1 : sensor.userUploadedFilename2 || 'Photo 2'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Photo 1 & Photo 2 Thumbnail Switcher / Upload Bar */}
                <div className="gallery-thumbnail-toolbar">
                  <div className="thumbnails-list">
                    {/* Slot 1 */}
                    <div
                      className={`thumbnail-card ${activePhotoIdx === 0 ? 'active' : ''}`}
                      onClick={() => setActivePhotoIdx(0)}
                    >
                      <span className="thumb-slot-num">1</span>
                      <div className="thumb-info">
                        <span className="thumb-name">
                          {sensor.userUploadedFilename1 || 'Photo 1'}
                        </span>
                        <span className="thumb-status">
                          {customMediaList[0] ? '✓ Uploaded' : 'Slot 1'}
                        </span>
                      </div>
                      <label
                        className="thumb-replace-btn"
                        title="Upload/Change Photo 1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Upload size={13} />
                        <input
                          type="file"
                          accept="image/*,video/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileUpload(e, 0)}
                        />
                      </label>
                    </div>

                    {/* Slot 2 */}
                    <div
                      className={`thumbnail-card ${activePhotoIdx === 1 ? 'active' : ''}`}
                      onClick={() => setActivePhotoIdx(1)}
                    >
                      <span className="thumb-slot-num">2</span>
                      <div className="thumb-info">
                        <span className="thumb-name">
                          {sensor.userUploadedFilename2 || 'Photo 2'}
                        </span>
                        <span className="thumb-status">
                          {customMediaList[1] ? '✓ Uploaded' : 'Slot 2'}
                        </span>
                      </div>
                      <label
                        className="thumb-replace-btn"
                        title="Upload/Change Photo 2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Upload size={13} />
                        <input
                          type="file"
                          accept="image/*,video/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileUpload(e, 1)}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Add Extra Media Button */}
                  <label className="btn btn-secondary add-extra-photo-btn">
                    <Plus size={15} /> Upload More Photos
                    <input
                      type="file"
                      accept="image/*,video/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, galleryItems.length)}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="specs-quad-grid">
              <div className="spec-item">
                <span className="spec-label">Operating Voltage</span>
                <span className="spec-val">{sensor.voltage}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Output Protocol</span>
                <span className="spec-val">{sensor.interfaceType}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Module Architecture</span>
                <span className="spec-val">{sensor.model}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Pin Count</span>
                <span className="spec-val">{sensor.pins.length} Pins</span>
              </div>
            </div>

            {/* Interactive Simulation Sandbox */}
            {sensor.simulation && (
              <div className="simulation-sandbox-card">
                <div className="sim-header">
                  <div className="sim-title">
                    <Activity size={18} className="pulse-icon" />
                    <h4>Interactive Telemetry Simulator</h4>
                  </div>
                  <span className="sim-badge">Live Hardware Sandbox</span>
                </div>

                <div className="sim-control-wrapper">
                  {sensor.simulation.type === 'slider' && (
                    <div className="slider-container">
                      <div className="slider-label-row">
                        <span>{sensor.simulation.label}</span>
                        <span className="slider-val-badge">
                          {simValue} {sensor.simulation.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={sensor.simulation.min}
                        max={sensor.simulation.max}
                        value={Number(simValue)}
                        onChange={(e) => setSimValue(Number(e.target.value))}
                        className="custom-range-slider"
                      />
                    </div>
                  )}

                  {sensor.simulation.type === 'toggle' && (
                    <div className="toggle-container">
                      <span>{sensor.simulation.label}</span>
                      <button
                        className={`sim-toggle-btn ${simValue ? 'active' : ''}`}
                        onClick={() => setSimValue(!simValue)}
                      >
                        <span className="toggle-indicator" />
                        {simValue ? 'SIGNAL HIGH (ACTIVE)' : 'SIGNAL LOW (IDLE)'}
                      </button>
                    </div>
                  )}

                  {sensor.simulation.type === 'trigger' && (
                    <div className="trigger-container">
                      <span>{sensor.simulation.label}</span>
                      <button
                        className={`btn btn-primary sim-trigger-btn ${triggerPulse ? 'pulse' : ''}`}
                        onClick={handleTrigger}
                      >
                        <Sparkles size={16} />
                        {triggerPulse ? 'PULSE RECEIVED (INTERRUPT)' : 'DISPATCH SENSOR EVENT'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Working Principle */}
            <div className="detail-section">
              <h3 className="section-subheading">
                <Layers size={18} /> Working Principle & Signal Flow
              </h3>
              <p className="working-principle-text">{sensor.workingPrinciple}</p>
            </div>

            {/* Pinout Table */}
            <div className="detail-section">
              <h3 className="section-subheading">
                <Cpu size={18} /> Hardware Pinout Configuration
              </h3>
              <div className="pinout-table-wrapper">
                <table className="pinout-table">
                  <thead>
                    <tr>
                      <th>Pin Identifier</th>
                      <th>Signal Class</th>
                      <th>Functional Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensor.pins.map((pin, i) => (
                      <tr key={i}>
                        <td>
                          <code className="pin-code">{pin.name}</code>
                        </td>
                        <td>
                          <span className={`pin-type-pill type-${pin.type.toLowerCase()}`}>
                            {pin.type}
                          </span>
                        </td>
                        <td>{pin.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Real World Applications */}
            <div className="detail-section">
              <h3 className="section-subheading">
                <Activity size={18} /> Real-World Applications & Implementations
              </h3>
              <div className="app-tags-grid">
                {sensor.applications.map((app, i) => (
                  <div key={i} className="app-tag-item">
                    <CheckCircle2 size={16} color="#00f2fe" />
                    <span>{app}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Snippet */}
            <div className="detail-section">
              <div className="code-header-bar">
                <h3 className="section-subheading" style={{ margin: 0 }}>
                  <Code2 size={18} /> Microcontroller Driver Firmware (Arduino / C++)
                </h3>
                <button className="copy-code-btn" onClick={handleCopyCode}>
                  {copiedCode ? <CheckCircle2 size={15} color="#10b981" /> : <Copy size={15} />}
                  {copiedCode ? 'Copied to Clipboard!' : 'Copy Code'}
                </button>
              </div>
              <pre className="sensor-code-pre">
                <code>{sensor.codeSnippet}</code>
              </pre>
            </div>
          </div>

          {/* Footer */}
          <div className="sensor-modal-footer">
            <span className="footer-tip">
              Files: <code>public/media/sensors/{sensor.userUploadedFilename1 || sensor.recommendedPhoto}</code>
              {sensor.userUploadedFilename2 && (
                <> & <code>public/media/sensors/{sensor.userUploadedFilename2}</code></>
              )}
            </span>
            <button className="btn btn-secondary" onClick={onClose}>
              Close Inspector
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

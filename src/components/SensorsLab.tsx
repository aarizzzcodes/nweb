import React, { useState } from 'react';
import {
  Cpu,
  Search,
  FolderOpen,
  ArrowRight,
  Zap,
  Activity,
  Layers,
  Upload,
  CheckCircle2,
  Sliders,
  FileImage,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TiltCard } from './TiltCard';
import { SensorDetailModal } from './SensorDetailModal';
import { SensorGuideModal } from './SensorGuideModal';
import { SENSORS_DATA } from '../data/sensorsData';
import { SensorCategory, SensorItem } from '../types';
import { resolveMediaPath } from '../utils/media';

interface CustomMediaItem {
  url: string;
  type: 'image' | 'video';
  label?: string;
}

export const SensorsLab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<SensorCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSensor, setActiveSensor] = useState<SensorItem | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);

  // Multi-photo custom attachments stored by sensorId
  const [customMedia, setCustomMedia] = useState<
    Record<string, { photos: CustomMediaItem[] }>
  >({});

  // Active thumbnail index for cards with 2+ photos
  const [cardPhotoIndexes, setCardPhotoIndexes] = useState<Record<string, number>>({});

  const handleAttachMedia = (
    sensorId: string,
    url: string,
    type: 'image' | 'video',
    slotIndex: number = 0
  ) => {
    setCustomMedia((prev) => {
      const existing = prev[sensorId]?.photos ? [...prev[sensorId].photos] : [];
      existing[slotIndex] = { url, type, label: `Photo ${slotIndex + 1}` };
      return {
        ...prev,
        [sensorId]: { photos: existing },
      };
    });
  };

  const handleCardFileUpload = (
    sensorId: string,
    slotIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video');
    const url = URL.createObjectURL(file);
    handleAttachMedia(sensorId, url, isVideo ? 'video' : 'image', slotIndex);
  };

  const toggleCardPhoto = (sensorId: string, total: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardPhotoIndexes((prev) => ({
      ...prev,
      [sensorId]: ((prev[sensorId] || 0) + 1) % total,
    }));
  };

  const filteredSensors = SENSORS_DATA.filter((sensor) => {
    const matchesCategory =
      selectedCategory === 'all' || sensor.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      sensor.name.toLowerCase().includes(q) ||
      sensor.model.toLowerCase().includes(q) ||
      sensor.categoryLabel.toLowerCase().includes(q) ||
      sensor.interfaceType.toLowerCase().includes(q) ||
      sensor.summary.toLowerCase().includes(q) ||
      (sensor.userUploadedFilename1 && sensor.userUploadedFilename1.toLowerCase().includes(q)) ||
      (sensor.userUploadedFilename2 && sensor.userUploadedFilename2.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const categories: { key: SensorCategory; label: string; count: number }[] = [
    { key: 'all', label: 'All Modules', count: SENSORS_DATA.length },
    {
      key: 'environmental',
      label: 'Environmental',
      count: SENSORS_DATA.filter((s) => s.category === 'environmental').length,
    },
    {
      key: 'motion',
      label: 'Distance & Motion',
      count: SENSORS_DATA.filter((s) => s.category === 'motion').length,
    },
    {
      key: 'optical',
      label: 'Optical & Light',
      count: SENSORS_DATA.filter((s) => s.category === 'optical').length,
    },
    {
      key: 'physical',
      label: 'Physical / Tilt',
      count: SENSORS_DATA.filter((s) => s.category === 'physical').length,
    },
    {
      key: 'magnetic',
      label: 'Magnetic & Hall',
      count: SENSORS_DATA.filter((s) => s.category === 'magnetic').length,
    },
    {
      key: 'acoustic',
      label: 'Acoustic Sound',
      count: SENSORS_DATA.filter((s) => s.category === 'acoustic').length,
    },
    {
      key: 'electrical',
      label: 'Electrical & Power',
      count: SENSORS_DATA.filter((s) => s.category === 'electrical').length,
    },
  ];

  return (
    <div className="sensors-lab-section">
      {/* Sensors Lab Banner */}
      <div className="sensors-hero-card">
        <div className="sensors-hero-content">
          <div className="status-pill" style={{ marginBottom: '1rem' }}>
            <span className="pulse-dot" />
            <span>Hardware Bench & Microcontroller Telemetry</span>
          </div>

          <h3 className="sensors-hero-title">
            IoT & Hardware <span className="gradient-text">Sensors Laboratory</span>
          </h3>

          <p className="sensors-hero-desc">
            Explore 22 physical sensor modules calibrated and programmed on Arduino Uno & ESP32. Sensors can feature <strong>multiple workbench photos</strong> (Photo 1 & Photo 2) for circuit views and testing in action.
          </p>

          <div className="sensors-hero-actions">
            <button className="btn btn-primary" onClick={() => setGuideOpen(true)}>
              <FolderOpen size={18} /> Upload Your 10 Sensor Photos Guide
            </button>
            <span className="sensors-count-tag">
              <Cpu size={16} /> 22 Sensor Modules Documented
            </span>
          </div>
        </div>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="sensors-toolbar">
        <div className="sensor-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by sensor model (e.g. DHT11, Ultrasonic, Tilt, Hall, temp hum, ir2)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              Clear
            </button>
          )}
        </div>

        <div className="sensor-category-pills">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`sensor-cat-btn ${selectedCategory === cat.key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              <span>{cat.label}</span>
              <span className="cat-count">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="sensors-grid">
        <AnimatePresence mode="popLayout">
          {filteredSensors.map((sensor, idx) => {
            // Determine active photos list
            const customPhotos = customMedia[sensor.id]?.photos || [];
            const hasMultiplePhotos =
              customPhotos.length > 1 || Boolean(sensor.userUploadedFilename2) || Boolean(sensor.recommendedPhoto2);
            const totalPhotos = customPhotos.length > 0 ? customPhotos.length : (hasMultiplePhotos ? 2 : 1);
            const activePhotoIdx = (cardPhotoIndexes[sensor.id] || 0) % (totalPhotos || 1);

            const activeCustomMedia = customPhotos[activePhotoIdx];
            const rawPhoto =
              activePhotoIdx === 0
                ? (sensor.userUploadedFilename1 ? `media/sensors/${sensor.userUploadedFilename1}` : sensor.recommendedPhoto)
                : (sensor.userUploadedFilename2 ? `media/sensors/${sensor.userUploadedFilename2}` : sensor.recommendedPhoto2 || sensor.recommendedPhoto);
            const defaultPhotoUrl = resolveMediaPath(rawPhoto);

            return (
              <motion.div
                layout
                key={sensor.id}
                initial={{ opacity: 0, scale: 0.9, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{
                  duration: 0.35,
                  delay: Math.min(idx * 0.04, 0.4),
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
              >
                <TiltCard className="sensor-card">
                  {/* Card Header */}
                  <div className="sensor-card-top">
                    <span className="badge category-badge">{sensor.categoryLabel}</span>
                    <span className="badge sensor-model-badge">{sensor.model}</span>
                  </div>

                  {/* Media Preview Window */}
                  <div
                    className="sensor-card-media-preview"
                    onClick={() => setActiveSensor(sensor)}
                  >
                    {activeCustomMedia ? (
                      activeCustomMedia.type === 'video' ? (
                        <video src={activeCustomMedia.url} autoPlay muted loop className="preview-thumb" />
                      ) : (
                        <img src={activeCustomMedia.url} alt={sensor.name} className="preview-thumb" />
                      )
                    ) : (
                      <img
                        src={defaultPhotoUrl}
                        alt={sensor.name}
                        className="preview-thumb"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                          const parent = (e.target as HTMLElement).parentElement;
                          if (parent) {
                            const placeholder = parent.querySelector('.preview-placeholder-graphic');
                            if (placeholder) (placeholder as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                    )}

                    {/* Fallback Graphic */}
                    <div
                      className="preview-placeholder-graphic"
                      style={{ display: activeCustomMedia ? 'none' : 'flex' }}
                    >
                      <Cpu size={36} className="circuit-icon" />
                      <span className="preview-hint">
                        {sensor.userUploadedFilename1 ? `Ready for: ${sensor.userUploadedFilename1}` : 'Click to inspect & attach photo'}
                      </span>
                    </div>

                    {/* Multiple Photos Switcher Pills */}
                    {hasMultiplePhotos && (
                      <div
                        className="card-gallery-pill-btn"
                        onClick={(e) => toggleCardPhoto(sensor.id, totalPhotos, e)}
                        title="Click to view other photo"
                      >
                        <FileImage size={11} /> Photo {activePhotoIdx + 1}/{totalPhotos} (Click to Flip)
                      </div>
                    )}

                    {/* User Filename Label */}
                    {sensor.userUploadedFilename1 && (
                      <span className="attached-indicator-pill">
                        <CheckCircle2 size={11} color="#10b981" />
                        {activePhotoIdx === 0 ? sensor.userUploadedFilename1 : sensor.userUploadedFilename2 || sensor.userUploadedFilename1}
                      </span>
                    )}
                  </div>

                  {/* Sensor Content */}
                  <div className="sensor-card-info">
                    <h4 className="sensor-title" onClick={() => setActiveSensor(sensor)}>
                      {sensor.name}
                    </h4>
                    <p className="sensor-summary">{sensor.summary}</p>
                  </div>

                  {/* Hardware Chips */}
                  <div className="sensor-chips-row">
                    <span className="chip">
                      <Zap size={12} /> {sensor.voltage}
                    </span>
                    <span className="chip">
                      <Layers size={12} /> {sensor.interfaceType.split(' ')[0]}
                    </span>
                    <span className="chip">
                      <Sliders size={12} /> {sensor.pins.length} Pins
                    </span>
                    {hasMultiplePhotos && (
                      <span className="chip" style={{ color: '#00f2fe' }}>
                        <FileImage size={12} /> 2 Photos Support
                      </span>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="sensor-card-actions">
                    <button
                      className="btn btn-secondary sensor-inspect-btn"
                      onClick={() => setActiveSensor(sensor)}
                    >
                      Inspect Specs & 2-Photo Gallery <ArrowRight size={16} />
                    </button>

                    <label
                      className="icon-btn upload-icon-btn"
                      title={`Upload photo for ${sensor.name} (${activePhotoIdx === 0 ? 'Photo 1' : 'Photo 2'})`}
                    >
                      <Upload size={16} />
                      <input
                        type="file"
                        accept="image/*,video/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleCardFileUpload(sensor.id, activePhotoIdx, e)}
                      />
                    </label>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredSensors.length === 0 && (
        <div className="sensors-empty-state">
          <p>No sensors match your query "{searchQuery}".</p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Sensor Detail Inspector Modal (with 2-photo gallery support) */}
      <SensorDetailModal
        sensor={activeSensor}
        onClose={() => setActiveSensor(null)}
        customMediaList={activeSensor ? customMedia[activeSensor.id]?.photos || [] : []}
        onAttachMedia={handleAttachMedia}
      />

      {/* Guide Modal */}
      <SensorGuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
        onMediaUploaded={handleAttachMedia}
      />
    </div>
  );
};

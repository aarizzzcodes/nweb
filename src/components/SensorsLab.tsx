import React, { useState } from 'react';
import {
  Cpu,
  Search,
  FolderOpen,
  ArrowRight,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  Sliders,
  FileImage,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Maximize2,
  ZoomIn,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TiltCard } from './TiltCard';
import { SensorDetailModal } from './SensorDetailModal';
import { SensorGuideModal } from './SensorGuideModal';
import { PhotoLightbox } from './PhotoLightbox';
import { SensorSchematicGraphic } from './SensorSchematicGraphic';
import { SENSORS_DATA } from '../data/sensorsData';
import { SensorCategory, SensorItem } from '../types';
import { resolveMediaPath } from '../utils/media';

export const SensorsLab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<SensorCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSensor, setActiveSensor] = useState<SensorItem | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);

  // Active thumbnail index for cards with 2+ photos
  const [cardPhotoIndexes, setCardPhotoIndexes] = useState<Record<string, number>>({});

  // Lightbox state for full HD inspection
  const [lightboxSensor, setLightboxSensor] = useState<SensorItem | null>(null);
  const [lightboxInitialIdx, setLightboxInitialIdx] = useState(0);

  const toggleCardPhoto = (sensorId: string, total: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardPhotoIndexes((prev) => ({
      ...prev,
      [sensorId]: ((prev[sensorId] || 0) + 1) % total,
    }));
  };

  const openLightbox = (sensor: SensorItem, photoIdx: number = 0, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLightboxSensor(sensor);
    setLightboxInitialIdx(photoIdx);
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

          <h2 className="section-title">
            Sensor Architecture & <span className="text-gradient">Hardware Lab</span>
          </h2>

          <p className="section-lead">
            Interactive engineering documentation for 22 sensor and transducer modules.
            Every module includes operating physics, pinout specifications, recommended voltage
            rails, live telemetry simulations, verified Arduino C++ drivers, and real hardware bench captures.
          </p>

          <div className="repo-source-badge-row">
            <span className="repo-storage-tag">
              <ShieldCheck size={14} color="#10b981" />
              <span>Verified Hardware Lab Archive • 22 Sensor Modules</span>
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
            // Check real photos
            const sensorPhotos = sensor.photos || [];
            const hasRealPhotos = sensorPhotos.length > 0;
            const resolvedPhotos = sensorPhotos.map((p) => resolveMediaPath(p));
            const totalPhotos = resolvedPhotos.length;
            const hasMultiplePhotos = totalPhotos > 1;
            const activePhotoIdx = (cardPhotoIndexes[sensor.id] || 0) % (totalPhotos || 1);
            const currentPhotoUrl = resolvedPhotos[activePhotoIdx];

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
                  <div className="sensor-card-media-preview">
                    {hasRealPhotos ? (
                      <div className="sensor-photo-container">
                        <img
                          src={currentPhotoUrl}
                          alt={`${sensor.name} - hardware capture`}
                          className="preview-thumb"
                          loading="lazy"
                          onError={(e) => {
                            // If an image fails to load, gracefully hide and show schematic fallback
                            (e.target as HTMLElement).style.display = 'none';
                            const parent = (e.target as HTMLElement).parentElement;
                            if (parent) {
                              const fallback = parent.querySelector('.photo-schematic-fallback');
                              if (fallback) (fallback as HTMLElement).style.display = 'block';
                            }
                          }}
                        />

                        {/* Interactive Zoom Overlay */}
                        <div
                          className="preview-zoom-overlay"
                          onClick={(e) => openLightbox(sensor, activePhotoIdx, e)}
                          title="Click to inspect in Full HD Lightbox"
                        >
                          <span className="zoom-overlay-chip">
                            <ZoomIn size={14} /> Inspect Full HD
                          </span>
                        </div>

                        {/* Hidden Schematic Fallback in case of asset 404 */}
                        <div className="photo-schematic-fallback" style={{ display: 'none', width: '100%', height: '100%' }}>
                          <SensorSchematicGraphic
                            sensorId={sensor.id}
                            name={sensor.name}
                            model={sensor.model}
                            category={sensor.category}
                            voltage={sensor.voltage}
                            interfaceType={sensor.interfaceType}
                            pins={sensor.pins}
                          />
                        </div>
                      </div>
                    ) : (
                      // Clean vector schematic blueprint for sensors awaiting hardware capture
                      <SensorSchematicGraphic
                        sensorId={sensor.id}
                        name={sensor.name}
                        model={sensor.model}
                        category={sensor.category}
                        voltage={sensor.voltage}
                        interfaceType={sensor.interfaceType}
                        pins={sensor.pins}
                      />
                    )}

                    {/* Multiple Photos Switcher Pills */}
                    {hasMultiplePhotos && (
                      <button
                        className="card-gallery-pill-btn"
                        onClick={(e) => toggleCardPhoto(sensor.id, totalPhotos, e)}
                        title="Click to toggle alternate angle"
                      >
                        <FileImage size={11} /> Angle {activePhotoIdx + 1}/{totalPhotos} (Flip)
                      </button>
                    )}

                    {/* Hardware Capture Label */}
                    {hasRealPhotos && (
                      <span className="attached-indicator-pill">
                        <CheckCircle2 size={11} color="#10b981" />
                        Hardware Capture
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
                      <span className="chip highlight-chip">
                        <FileImage size={12} /> {totalPhotos} Real Photos
                      </span>
                    )}
                  </div>

                  {/* Card Actions (Pure Read-Only Inspection - No uploads!) */}
                  <div className="sensor-card-actions">
                    <button
                      className="btn btn-secondary sensor-inspect-btn"
                      onClick={() => setActiveSensor(sensor)}
                    >
                      Inspect Specs & Driver <ArrowRight size={16} />
                    </button>

                    {hasRealPhotos && (
                      <button
                        className="icon-btn hd-inspect-btn"
                        title="Inspect full resolution hardware photo"
                        onClick={(e) => openLightbox(sensor, activePhotoIdx, e)}
                      >
                        <Maximize2 size={15} />
                      </button>
                    )}
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredSensors.length === 0 && (
        <div className="sensors-empty-state">
          <Cpu size={48} className="empty-icon" />
          <h3>No sensor modules match &ldquo;{searchQuery}&rdquo;</h3>
          <p>Try searching for other terms like DHT11, Tilt, Hall, Ultrasonic, IR, or Soil Moisture.</p>
          <button className="btn btn-secondary" onClick={() => setSearchQuery('')}>
            Reset Search
          </button>
        </div>
      )}

      {/* Sensor Detail Modal (Read-Only Specs & Interactive Simulator) */}
      {activeSensor && (
        <SensorDetailModal
          sensor={activeSensor}
          onClose={() => setActiveSensor(null)}
          onOpenLightbox={(photoIdx) => openLightbox(activeSensor, photoIdx)}
        />
      )}

      {/* Media Architecture Guide Modal */}
      {guideOpen && <SensorGuideModal onClose={() => setGuideOpen(false)} />}

      {/* Full HD Photo Lightbox / Inspector */}
      {lightboxSensor && (
        <PhotoLightbox
          isOpen={Boolean(lightboxSensor)}
          onClose={() => setLightboxSensor(null)}
          sensorName={lightboxSensor.name}
          sensorModel={lightboxSensor.model}
          photos={(lightboxSensor.photos || []).map((p) => resolveMediaPath(p))}
          initialIndex={lightboxInitialIdx}
        />
      )}
    </div>
  );
};

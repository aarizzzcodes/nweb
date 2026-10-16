import React, { useState, useMemo } from 'react';
import {
  Camera,
  Cpu,
  Search,
  ZoomIn,
  Sparkles,
  ShieldCheck,
  Maximize2,
  Sliders,
  Layers,
  ArrowRight,
  ExternalLink,
  Code2,
  Activity,
  Zap,
  Tag,
  Grid,
  Columns3,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TiltCard } from './TiltCard';
import { PhotoLightbox } from './PhotoLightbox';
import { SensorDetailModal } from './SensorDetailModal';
import { SENSORS_DATA } from '../data/sensorsData';
import { SensorItem } from '../types';
import { resolveMediaPath } from '../utils/media';

export interface GalleryPhotoItem {
  id: string;
  sensorId: string;
  title: string;
  sensorName: string;
  sensorModel: string;
  filename: string;
  imagePath: string;
  category: 'environmental' | 'motion' | 'optical' | 'physical' | 'magnetic' | 'soil';
  categoryLabel: string;
  angleDescription: string;
  aspectRatio: 'landscape' | 'portrait' | 'square';
  voltage: string;
  interfaceType: string;
  highlights: string[];
  keyComponents: string[];
}

export const SENSOR_GALLERY_PHOTOS: GalleryPhotoItem[] = [
  {
    id: 'photo-dht11-1',
    sensorId: 'dht11',
    title: 'DHT11 Temp & Humidity Sensor — Primary Macro',
    sensorName: 'DHT11 Temperature & Humidity Sensor',
    sensorModel: 'DHT11',
    filename: 'temp hum.JPG',
    imagePath: '/media/sensors/temp hum.JPG',
    category: 'environmental',
    categoryLabel: 'Environmental',
    angleDescription: 'Primary PCB top-down view showing polymer humidity substrate and NTC thermistor inside blue vented housing.',
    aspectRatio: 'landscape',
    voltage: '3.3V – 5.5V DC',
    interfaceType: '1-Wire Digital Signal',
    highlights: ['Single-bus digital output', 'High humidity calibration', 'Long-term stability'],
    keyComponents: ['Capacitive RH element', 'NTC thermistor', '8-bit OTP MCU onboard'],
  },
  {
    id: 'photo-dht11-2',
    sensorId: 'dht11',
    title: 'DHT11 Digital Module — Oblique Close-Up',
    sensorName: 'DHT11 Temperature & Humidity Sensor',
    sensorModel: 'DHT11',
    filename: 'temp hu.JPG',
    imagePath: '/media/sensors/temp hu.JPG',
    category: 'environmental',
    categoryLabel: 'Environmental',
    angleDescription: 'Oblique angle highlighting 4-pin header (VCC, DATA, NC, GND) and protective slotted grill casing.',
    aspectRatio: 'portrait',
    voltage: '3.3V – 5.5V DC',
    interfaceType: '1-Wire Digital Signal',
    highlights: ['Pin spacing 2.54mm pitch', 'Pre-calibrated digital bus', 'Fast thermal response'],
    keyComponents: ['Perforated grill', 'Single-wire pull-up', 'Telemetry interface'],
  },
  {
    id: 'photo-ultrasonic-1',
    sensorId: 'hc-sr04',
    title: 'HC-SR04 Ultrasonic Sonar Module — Front Transducers',
    sensorName: 'HC-SR04 Ultrasonic Ranging Module',
    sensorModel: 'HC-SR04',
    filename: 'ultrasonic.JPG',
    imagePath: '/media/sensors/ultrasonic.JPG',
    category: 'motion',
    categoryLabel: 'Distance & Sonar',
    angleDescription: 'Frontal macro capture of dual 40kHz piezo acoustic transducers (T=Transmitter, R=Receiver) and crystal oscillator.',
    aspectRatio: 'landscape',
    voltage: '5.0V DC',
    interfaceType: 'TTL Trigger / Echo Pulse',
    highlights: ['2cm to 400cm range', '3mm precision resolution', 'Non-contact acoustic echolocation'],
    keyComponents: ['40kHz Piezo emitter', '40kHz Piezo receiver', 'MAX232/LM324 signal conditioning'],
  },
  {
    id: 'photo-ir-1',
    sensorId: 'tcrt5000',
    title: 'Infrared Reflective Optical Sensor — Macro Angle A',
    sensorName: 'TCRT5000 / Infrared Optical Avoidance Module',
    sensorModel: 'TCRT5000 / LM393',
    filename: 'ir.jpg',
    imagePath: '/media/sensors/ir.jpg',
    category: 'optical',
    categoryLabel: 'Infrared & Optical',
    angleDescription: 'High-clarity optical angle showcasing dual phototransistor and IR emitter diodes with onboard LM393 voltage comparator.',
    aspectRatio: 'landscape',
    voltage: '3.3V – 5.0V DC',
    interfaceType: 'Digital D0 + Analog A0',
    highlights: ['Multi-turn threshold potentiometer', 'Dual power & trigger indicator LEDs', 'Millimeter line-tracking'],
    keyComponents: ['GaAs IR LED (950nm)', 'Phototransistor receiver', 'LM393 dual comparator'],
  },
  {
    id: 'photo-ir-2',
    sensorId: 'tcrt5000',
    title: 'Infrared Optical Sensor — Perspective Angle B',
    sensorName: 'TCRT5000 / Infrared Optical Avoidance Module',
    sensorModel: 'TCRT5000 / LM393',
    filename: 'ir2.JPG',
    imagePath: '/media/sensors/ir2.JPG',
    category: 'optical',
    categoryLabel: 'Infrared & Optical',
    angleDescription: 'Detailed angle capture emphasizing surface-mount telemetry traces, filtering capacitors, and 4-pin DuPont header.',
    aspectRatio: 'portrait',
    voltage: '3.3V – 5.0V DC',
    interfaceType: 'Digital D0 + Analog A0',
    highlights: ['Ambient light daylight rejection', 'Adjustable sensitivity trimmer', 'High-speed switching (<2μs)'],
    keyComponents: ['Threshold trimmer (10kΩ)', 'SMD decoupling caps', 'Status LED bank'],
  },
  {
    id: 'photo-tilt-1',
    sensorId: 'tilt-switch',
    title: 'Angle Tilt Switch Sensor — Macro Alignment A',
    sensorName: 'SW-520D Ball Tilt Switch Module',
    sensorModel: 'SW-520D',
    filename: 'angle tilt.JPG',
    imagePath: '/media/sensors/angle tilt.JPG',
    category: 'physical',
    categoryLabel: 'Physical / Tilt',
    angleDescription: 'Close-up macro of gold-plated metallic cylinder containing micro rolling balls for omnidirectional inclination detection.',
    aspectRatio: 'landscape',
    voltage: '3.3V – 5.0V DC',
    interfaceType: 'Digital Switching Signal',
    highlights: ['Hermetically sealed gold barrel', 'Anti-oxidation contact pins', 'Vibration & orientation trigger'],
    keyComponents: ['Metallic rolling sphere', 'Gold-plated lead frame', 'Debounce filter network'],
  },
  {
    id: 'photo-tilt-2',
    sensorId: 'tilt-switch',
    title: 'Angle Tilt Switch Sensor — Lateral Elevation B',
    sensorName: 'SW-520D Ball Tilt Switch Module',
    sensorModel: 'SW-520D',
    filename: 'angle tilt (2).JPG',
    imagePath: '/media/sensors/angle tilt (2).JPG',
    category: 'physical',
    categoryLabel: 'Physical / Tilt',
    angleDescription: 'Elevation perspective showing tilt cylinder mounting orientation relative to the comparator board and pin headers.',
    aspectRatio: 'portrait',
    voltage: '3.3V – 5.0V DC',
    interfaceType: 'Digital Switching Signal',
    highlights: ['Compact PCB footprint', 'Instantaneous state transition', 'Low power standby (<10μA)'],
    keyComponents: ['SW-520D sensor cylinder', 'Comparator LM393 circuit', 'Indicator telemetry LED'],
  },
  {
    id: 'photo-hall-1',
    sensorId: 'ky-024-hall',
    title: 'Linear Hall Effect Magnetic Sensor — Telemetry Focus',
    sensorName: 'Linear Hall Effect Magnetic Flux Sensor',
    sensorModel: 'KY-024 / 49E Hall',
    filename: 'magnetuc hallineear.JPG',
    imagePath: '/media/sensors/magnetuc hallineear.JPG',
    category: 'magnetic',
    categoryLabel: 'Magnetic & Hall',
    angleDescription: 'Precision focus on 49E Hall IC element sensitive to Gauss magnetic flux density with analog and digital output stages.',
    aspectRatio: 'landscape',
    voltage: '3.3V – 5.0V DC',
    interfaceType: 'Analog AO (Linear Flux) + Digital DO',
    highlights: ['Gauss magnetic polarity detection', 'Non-contact rotational RPM sensing', 'Linear output voltage response'],
    keyComponents: ['49E Linear Hall element', 'Precision reference trimmer', 'LM393 Schmitt comparator'],
  },
  {
    id: 'photo-soil-1',
    sensorId: 'soil-moisture',
    title: 'Soil Moisture Hygrometer — Dual Probe Angle A',
    sensorName: 'Soil Moisture & Humidity Detection Sensor',
    sensorModel: 'YL-69 / LM393',
    filename: 'soil moisture.JPG',
    imagePath: '/media/sensors/soil moisture.JPG',
    category: 'soil',
    categoryLabel: 'Soil Moisture',
    angleDescription: 'Full hardware shot of gold-plated immersion fork probes connected via ribbon cable to signal conditioning comparator.',
    aspectRatio: 'landscape',
    voltage: '3.3V – 5.0V DC',
    interfaceType: 'Analog AO (Volumetric) + Digital DO',
    highlights: ['Electrolytic corrosion resistant gold coating', 'Direct soil volumetric reading', 'Digital alarm threshold'],
    keyComponents: ['Dual fork conductive trace', '10kΩ sensitivity potentiometer', 'Dual output terminal header'],
  },
  {
    id: 'photo-soil-2',
    sensorId: 'soil-moisture',
    title: 'Soil Moisture Hygrometer — Probe Tip Inspection B',
    sensorName: 'Soil Moisture & Humidity Detection Sensor',
    sensorModel: 'YL-69 / LM393',
    filename: 'soil moistture.JPG',
    imagePath: '/media/sensors/soil moistture.JPG',
    category: 'soil',
    categoryLabel: 'Soil Moisture',
    angleDescription: 'Macro capture focused on the fork tip geometry and spacing designed to measure electrical resistivity in plant substrate.',
    aspectRatio: 'portrait',
    voltage: '3.3V – 5.0V DC',
    interfaceType: 'Analog AO + Digital DO',
    highlights: ['Substrate conductivity measurement', 'High sensitivity analog ramp', 'Greenhouse telemetry ready'],
    keyComponents: ['Wide-surface capacitive/resistive area', 'Durable FR-4 substrate', 'Insulated trace neck'],
  },
  {
    id: 'photo-soil-3',
    sensorId: 'soil-moisture',
    title: 'Soil Moisture Hygrometer — Laboratory Bench Capture C',
    sensorName: 'Soil Moisture & Humidity Detection Sensor',
    sensorModel: 'YL-69 / LM393',
    filename: 'soilmoisture.JPG',
    imagePath: '/media/sensors/soilmoisture.JPG',
    category: 'soil',
    categoryLabel: 'Soil Moisture',
    angleDescription: 'Detailed laboratory capture displaying the full setup bench including sensor leads, comparator daughterboard, and indicators.',
    aspectRatio: 'landscape',
    voltage: '3.3V – 5.0V DC',
    interfaceType: 'Analog AO + Digital DO',
    highlights: ['Clean laboratory bench capture', 'Verified electrical continuity', 'Full sensor kit configuration'],
    keyComponents: ['Comparator board', 'Fork sensor probe', 'Jumper wire interface'],
  },
];

type CategoryFilter = 'all' | 'environmental' | 'motion' | 'optical' | 'physical' | 'magnetic' | 'soil';
type ViewLayout = 'grid' | 'cards';

export const SensorPhotoGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState<ViewLayout>('grid');

  // Lightbox modal state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxTitle, setLightboxTitle] = useState('');
  const [lightboxModel, setLightboxModel] = useState('');

  // Sensor detail modal state
  const [activeSensorDetail, setActiveSensorDetail] = useState<SensorItem | null>(null);

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    return SENSOR_GALLERY_PHOTOS.filter((photo) => {
      const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        photo.title.toLowerCase().includes(q) ||
        photo.sensorName.toLowerCase().includes(q) ||
        photo.sensorModel.toLowerCase().includes(q) ||
        photo.categoryLabel.toLowerCase().includes(q) ||
        photo.filename.toLowerCase().includes(q) ||
        photo.highlights.some((h) => h.toLowerCase().includes(q)) ||
        photo.keyComponents.some((c) => c.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handle opening lightbox from a specific photo in the list
  const handleOpenLightbox = (photo: GalleryPhotoItem) => {
    // Collect all resolved URLs in the filtered gallery
    const allUrls = filteredPhotos.map((p) => resolveMediaPath(p.imagePath));
    const targetIdx = filteredPhotos.findIndex((p) => p.id === photo.id);
    setLightboxPhotos(allUrls);
    setLightboxIndex(Math.max(0, targetIdx));
    setLightboxTitle(photo.sensorName);
    setLightboxModel(photo.sensorModel);
    setLightboxOpen(true);
  };

  // Open sensor telemetry modal
  const handleOpenSensorTelemetry = (sensorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const sensor = SENSORS_DATA.find((s) => s.id === sensorId);
    if (sensor) {
      setActiveSensorDetail(sensor);
    }
  };

  const categories: { key: CategoryFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All Photos', count: SENSOR_GALLERY_PHOTOS.length },
    {
      key: 'environmental',
      label: 'Environmental (DHT11)',
      count: SENSOR_GALLERY_PHOTOS.filter((p) => p.category === 'environmental').length,
    },
    {
      key: 'motion',
      label: 'Ultrasonic Sonar',
      count: SENSOR_GALLERY_PHOTOS.filter((p) => p.category === 'motion').length,
    },
    {
      key: 'optical',
      label: 'Infrared & Optical',
      count: SENSOR_GALLERY_PHOTOS.filter((p) => p.category === 'optical').length,
    },
    {
      key: 'physical',
      label: 'Tilt & Vibration',
      count: SENSOR_GALLERY_PHOTOS.filter((p) => p.category === 'physical').length,
    },
    {
      key: 'magnetic',
      label: 'Hall Magnetic Flux',
      count: SENSOR_GALLERY_PHOTOS.filter((p) => p.category === 'magnetic').length,
    },
    {
      key: 'soil',
      label: 'Soil Moisture',
      count: SENSOR_GALLERY_PHOTOS.filter((p) => p.category === 'soil').length,
    },
  ];

  return (
    <section className="sensor-gallery-section" id="gallery">
      <div className="section-container">
        {/* Gallery Hero Header */}
        <div className="gallery-header-card">
          <div className="gallery-header-badge">
            <span className="gallery-badge-pulse" />
            <Camera size={14} className="badge-icon" />
            <span>High-Definition Laboratory Photometry Archive</span>
          </div>

          <h2 className="section-title">
            Hardware Bench <span className="text-gradient">Photo Gallery</span>
          </h2>

          <p className="section-lead">
            High-resolution bench captures of Aariz’s physical microcontroller sensor and transducer modules.
            Every photo highlights real PCB topography, sensor components, pinout headers, and analog comparator daughterboards.
          </p>

          {/* Stats Bar */}
          <div className="gallery-stats-bar">
            <div className="gallery-stat-item">
              <span className="stat-number">11</span>
              <span className="stat-label">Uploaded Lab Captures</span>
            </div>
            <div className="gallery-stat-divider" />
            <div className="gallery-stat-item">
              <span className="stat-number">6</span>
              <span className="stat-label">Sensor Domains</span>
            </div>
            <div className="gallery-stat-divider" />
            <div className="gallery-stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Physical Bench Tested</span>
            </div>
            <div className="gallery-stat-divider" />
            <div className="gallery-stat-item">
              <span className="stat-number">HD</span>
              <span className="stat-label">Full Lightbox Inspection</span>
            </div>
          </div>
        </div>

        {/* Toolbar: Category Filters, Search, and Layout Toggle */}
        <div className="gallery-toolbar">
          {/* Search Box */}
          <div className="gallery-search-wrap">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search captures by sensor model, chip, or tag (e.g. DHT11, Ultrasonic, LM393, tilt, hall)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search sensor gallery photos"
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Mode Buttons */}
          <div className="gallery-view-mode-group">
            <button
              className={`view-mode-btn ${layoutMode === 'grid' ? 'active' : ''}`}
              onClick={() => setLayoutMode('grid')}
              title="Showcase Masonry Grid View"
              aria-label="Grid layout"
            >
              <Grid size={15} />
              <span className="view-mode-text">Grid</span>
            </button>
            <button
              className={`view-mode-btn ${layoutMode === 'cards' ? 'active' : ''}`}
              onClick={() => setLayoutMode('cards')}
              title="Detailed Hardware Cards View"
              aria-label="Cards layout"
            >
              <Columns3 size={15} />
              <span className="view-mode-text">Detailed Cards</span>
            </button>
          </div>
        </div>

        {/* Category Pills Row */}
        <div className="gallery-category-pills">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`gallery-cat-pill ${selectedCategory === cat.key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              <span>{cat.label}</span>
              <span className="cat-pill-count">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Active Filter Notice */}
        <div className="gallery-filter-status">
          <span>
            Showing <strong>{filteredPhotos.length}</strong> of {SENSOR_GALLERY_PHOTOS.length} high-resolution captures
          </span>
          {searchQuery && (
            <span className="search-active-chip">
              Filtered by "{searchQuery}"
            </span>
          )}
        </div>

        {/* Photo Gallery Display Grid */}
        <div className={`gallery-display-${layoutMode}`}>
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, index) => {
              const resolvedUrl = resolveMediaPath(photo.imagePath);

              return (
                <motion.div
                  layout
                  key={photo.id}
                  initial={{ opacity: 0, y: 25, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 15 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.045, 0.45),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="gallery-photo-card-wrapper"
                >
                  <TiltCard className="gallery-photo-card">
                    {/* Photo Visual Box */}
                    <div
                      className="photo-card-media-box"
                      onClick={() => handleOpenLightbox(photo)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleOpenLightbox(photo);
                      }}
                      title="Click to inspect in Full HD Lightbox (Zoom, Pan, Details)"
                    >
                      <img
                        src={resolvedUrl}
                        alt={photo.title}
                        loading="lazy"
                        className="gallery-main-img"
                      />

                      {/* Glass Gradient Scrim */}
                      <div className="photo-card-overlay-scrim" />

                      {/* Top Badges */}
                      <div className="photo-top-badges">
                        <span className="photo-model-badge">
                          <Cpu size={12} />
                          <span>{photo.sensorModel}</span>
                        </span>
                        <span className="photo-verified-badge">
                          <ShieldCheck size={12} color="#10b981" />
                          <span>Verified Bench</span>
                        </span>
                      </div>

                      {/* Hover Quick Action Buttons */}
                      <div className="photo-hover-actions">
                        <button
                          className="hover-action-btn primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenLightbox(photo);
                          }}
                          title="Open HD Lightbox"
                        >
                          <ZoomIn size={15} />
                          <span>Inspect HD</span>
                        </button>

                        <button
                          className="hover-action-btn secondary"
                          onClick={(e) => handleOpenSensorTelemetry(photo.sensorId, e)}
                          title="Open Sensor Specifications & Simulation"
                        >
                          <Sliders size={15} />
                          <span>Telemetry</span>
                        </button>
                      </div>

                      {/* Bottom Micro Tag in Grid mode */}
                      <div className="photo-corner-tag">
                        <span>{photo.filename}</span>
                      </div>
                    </div>

                    {/* Card Content & Metadata */}
                    <div className="photo-card-content">
                      <div className="photo-card-category-row">
                        <span className="photo-cat-tag">
                          <Tag size={11} /> {photo.categoryLabel}
                        </span>
                        <span className="photo-voltage-tag">
                          <Zap size={11} /> {photo.voltage}
                        </span>
                      </div>

                      <h3
                        className="photo-card-title"
                        onClick={() => handleOpenLightbox(photo)}
                      >
                        {photo.sensorName}
                      </h3>

                      <p className="photo-angle-text">{photo.angleDescription}</p>

                      {/* Component Chips */}
                      <div className="photo-components-row">
                        {photo.keyComponents.map((comp, cIdx) => (
                          <span key={`${comp}-${cIdx}`} className="component-chip">
                            {comp}
                          </span>
                        ))}
                      </div>

                      {/* Bottom Footer Actions */}
                      <div className="photo-card-footer">
                        <span className="photo-interface-info">
                          <Activity size={12} /> {photo.interfaceType}
                        </span>

                        <div className="card-footer-btns">
                          <button
                            className="card-telemetry-btn"
                            onClick={(e) => handleOpenSensorTelemetry(photo.sensorId, e)}
                            title="Open verified Arduino code and live interactive simulation"
                          >
                            <Code2 size={13} />
                            <span>Driver & Logic</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty Search State */}
        {filteredPhotos.length === 0 && (
          <div className="gallery-empty-state">
            <Search size={36} className="empty-icon" />
            <h3>No Captures Found</h3>
            <p>No photos match your current search query "{searchQuery}".</p>
            <button
              className="reset-filters-btn"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Quick Link to Full 22-Module Sensor Hardware Lab */}
        <div className="gallery-bottom-cta-banner">
          <div className="cta-banner-content">
            <div className="cta-banner-text">
              <span className="cta-badge">
                <Sparkles size={13} /> Comprehensive Telemetry Lab
              </span>
              <h3>Want to explore all 22 Sensors with Circuit Drivers?</h3>
              <p>
                Access live sensor simulation sliders, pinout wiring guides, and verified C++ firmware drivers in the complete Hardware Bench.
              </p>
            </div>
            <a href="#sensors-lab" className="cta-bench-btn">
              <span>Enter 22-Sensor Lab</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* High Definition Photo Lightbox Modal */}
      <PhotoLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        photos={lightboxPhotos}
        initialIndex={lightboxIndex}
        sensorName={lightboxTitle}
        sensorModel={lightboxModel}
      />

      {/* Sensor Detail & Telemetry Modal */}
      {activeSensorDetail && (
        <SensorDetailModal
          sensor={activeSensorDetail}
          onClose={() => setActiveSensorDetail(null)}
          onOpenLightbox={(photoIdx) => {
            const photos = (activeSensorDetail.photos || []).map((p) => resolveMediaPath(p));
            setLightboxPhotos(photos);
            setLightboxIndex(photoIdx);
            setLightboxTitle(activeSensorDetail.name);
            setLightboxModel(activeSensorDetail.model);
            setLightboxOpen(true);
          }}
        />
      )}
    </section>
  );
};

export default SensorPhotoGallery;

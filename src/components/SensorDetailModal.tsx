import React, { useState } from 'react';
import {
  X,
  Cpu,
  Zap,
  Activity,
  Code2,
  Copy,
  CheckCircle2,
  FileImage,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Maximize2,
  ZoomIn,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SensorItem } from '../types';
import { resolveMediaPath } from '../utils/media';
import { SensorSchematicGraphic } from './SensorSchematicGraphic';

interface SensorDetailModalProps {
  sensor: SensorItem;
  onClose: () => void;
  onOpenLightbox?: (photoIdx: number) => void;
}

export const SensorDetailModal: React.FC<SensorDetailModalProps> = ({
  sensor,
  onClose,
  onOpenLightbox,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'driver' | 'pinout' | 'simulation'>('overview');

  // Simulation state
  const [sliderVal, setSliderVal] = useState<number>(
    sensor.simulation?.type === 'slider' && typeof sensor.simulation.initialValue === 'number'
      ? sensor.simulation.initialValue
      : 0
  );
  const [toggleVal, setToggleVal] = useState<boolean>(
    sensor.simulation?.type === 'toggle'
      ? Boolean(sensor.simulation.initialValue)
      : false
  );
  const [triggered, setTriggered] = useState<boolean>(false);

  // Real photos resolution
  const sensorPhotos = sensor.photos || [];
  const hasPhotos = sensorPhotos.length > 0;
  const resolvedPhotos = sensorPhotos.map((p) => resolveMediaPath(p));
  const currentPhoto = resolvedPhotos[activePhotoIdx] || resolvedPhotos[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sensor.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTrigger = () => {
    setTriggered(true);
    setTimeout(() => setTriggered(false), 800);
  };

  return (
    <AnimatePresence>
      <div className="sensor-modal-backdrop" onClick={onClose}>
        <motion.div
          className="sensor-detail-modal"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sensor-modal-header">
            <div>
              <div className="modal-category-row">
                <span className="badge category-badge">{sensor.categoryLabel}</span>
                <span className="badge sensor-model-badge">{sensor.model}</span>
                <span className="badge backend-badge">
                  <ShieldCheck size={12} color="#10b981" /> Backend Lab Verified
                </span>
              </div>
              <h2>{sensor.name}</h2>
            </div>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close sensor details">
              <X size={20} />
            </button>
          </div>

          <div className="sensor-detail-body">
            {/* Gallery Showcase Section */}
            <div className="sensor-media-section">
              <div className="media-gallery-container">
                {/* Main Display Window */}
                <div className="media-player-wrapper">
                  {hasPhotos && currentPhoto ? (
                    <div className="modal-photo-stage">
                      <img
                        key={currentPhoto}
                        src={currentPhoto}
                        alt={`${sensor.name} - hardware photo ${activePhotoIdx + 1}`}
                        className="sensor-media-box"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                          const parent = (e.target as HTMLElement).parentElement;
                          if (parent) {
                            const fallback = parent.querySelector('.modal-schematic-fallback');
                            if (fallback) (fallback as HTMLElement).style.display = 'block';
                          }
                        }}
                      />

                      {/* Fullscreen Lightbox Trigger Button */}
                      <button
                        className="modal-lightbox-expand-btn"
                        onClick={() => onOpenLightbox && onOpenLightbox(activePhotoIdx)}
                        title="Inspect full resolution in interactive lightbox"
                      >
                        <Maximize2 size={15} /> Expand HD (Zoom & Pan)
                      </button>

                      {/* Schematic Fallback if image fails to load */}
                      <div className="modal-schematic-fallback" style={{ display: 'none', width: '100%', height: '320px' }}>
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
                    // Crisp schematic graphic for sensors awaiting hardware capture
                    <div style={{ width: '100%', height: '320px' }}>
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
                  )}

                  {/* Navigation Arrows if multiple photos */}
                  {resolvedPhotos.length > 1 && (
                    <div className="gallery-nav-arrows">
                      <button
                        className="arrow-nav-btn left"
                        onClick={() =>
                          setActivePhotoIdx((prev) =>
                            prev === 0 ? resolvedPhotos.length - 1 : prev - 1
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
                            (prev + 1) % resolvedPhotos.length
                          )
                        }
                        aria-label="Next photo"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}

                  {/* Photo Counter Badge (Clean Read-Only) */}
                  {hasPhotos && resolvedPhotos.length > 1 && (
                    <div className="media-attached-badge">
                      <span>
                        Photo {activePhotoIdx + 1} of {resolvedPhotos.length}
                      </span>
                    </div>
                  )}
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
                <span className="spec-label">Interface Protocol</span>
                <span className="spec-val">{sensor.interfaceType}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Module Category</span>
                <span className="spec-val">{sensor.categoryLabel}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Hardware Architecture</span>
                <span className="spec-val">{sensor.model}</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="modal-tabs-nav">
              <button
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview & Physics
              </button>
              <button
                className={`tab-btn ${activeTab === 'driver' ? 'active' : ''}`}
                onClick={() => setActiveTab('driver')}
              >
                Arduino C++ Driver
              </button>
              <button
                className={`tab-btn ${activeTab === 'pinout' ? 'active' : ''}`}
                onClick={() => setActiveTab('pinout')}
              >
                Pinout & Wiring Map
              </button>
              <button
                className={`tab-btn ${activeTab === 'simulation' ? 'active' : ''}`}
                onClick={() => setActiveTab('simulation')}
              >
                Live Simulator
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="tab-pane">
                <div className="modal-section-card">
                  <h3>Working Principle & Physics</h3>
                  <p className="working-principle-text">{sensor.workingPrinciple}</p>
                </div>

                <div className="modal-section-card">
                  <h3>Practical Engineering Applications</h3>
                  <ul className="applications-list">
                    {sensor.applications.map((app, i) => (
                      <li key={i}>
                        <CheckCircle2 size={15} color="var(--accent-cyan)" />
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Arduino C++ Driver */}
            {activeTab === 'driver' && (
              <div className="tab-pane">
                <div className="modal-section-card">
                  <div className="code-header-bar">
                    <span className="code-title">
                      <Code2 size={16} /> Arduino C++ Firmware Driver
                    </span>
                    <button className="copy-code-btn" onClick={handleCopyCode}>
                      {copiedCode ? <CheckCircle2 size={14} color="#10b981" /> : <Copy size={14} />}
                      {copiedCode ? 'Copied to Clipboard' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="code-block">
                    <code>{sensor.codeSnippet}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Tab 3: Pinout Map */}
            {activeTab === 'pinout' && (
              <div className="tab-pane">
                <div className="modal-section-card">
                  <h3>Pinout & Wiring Map</h3>
                  <div className="pinout-table-wrapper">
                    <table className="pinout-table">
                      <thead>
                        <tr>
                          <th>Pin Label</th>
                          <th>Type</th>
                          <th>Signal Function</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sensor.pins.map((pin, i) => (
                          <tr key={i}>
                            <td className="pin-name-cell">
                              <code>{pin.name}</code>
                            </td>
                            <td>
                              <span className={`pin-type-tag ${pin.type.toLowerCase()}`}>
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
              </div>
            )}

            {/* Tab 4: Live Simulator */}
            {activeTab === 'simulation' && (
              <div className="tab-pane">
                <div className="modal-section-card simulation-card">
                  <h3>Interactive Hardware Telemetry Simulator</h3>
                  <p className="simulation-lead">
                    Simulate real-world electrical response of the {sensor.model} microcontroller pinout.
                  </p>

                  {sensor.simulation?.type === 'slider' && (
                    <div className="simulation-control-box">
                      <div className="slider-label-row">
                        <span>{sensor.simulation.label}</span>
                        <span className="telemetry-readout">
                          {sliderVal} {sensor.simulation.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={sensor.simulation.min}
                        max={sensor.simulation.max}
                        value={sliderVal}
                        onChange={(e) => setSliderVal(Number(e.target.value))}
                        className="sim-range-input"
                      />
                      <div className="range-bounds-row">
                        <span>{sensor.simulation.min} {sensor.simulation.unit}</span>
                        <span>{sensor.simulation.max} {sensor.simulation.unit}</span>
                      </div>
                    </div>
                  )}

                  {sensor.simulation?.type === 'toggle' && (
                    <div className="simulation-control-box">
                      <div className="toggle-label-row">
                        <span>{sensor.simulation.label}</span>
                        <span className={`telemetry-state-pill ${toggleVal ? 'active' : ''}`}>
                          {toggleVal ? 'HIGH (VCC Alert)' : 'LOW (Idle 0V)'}
                        </span>
                      </div>
                      <button
                        className={`sim-toggle-btn ${toggleVal ? 'active' : ''}`}
                        onClick={() => setToggleVal((prev) => !prev)}
                      >
                        <Zap size={16} /> Toggle Physical Input State
                      </button>
                    </div>
                  )}

                  {sensor.simulation?.type === 'trigger' && (
                    <div className="simulation-control-box">
                      <div className="trigger-label-row">
                        <span>{sensor.simulation.label}</span>
                        <span className={`telemetry-state-pill ${triggered ? 'active' : ''}`}>
                          {triggered ? 'PULSE DETECTED' : 'Awaiting Signal'}
                        </span>
                      </div>
                      <button
                        className={`sim-pulse-btn ${triggered ? 'pulsing' : ''}`}
                        onClick={handleTrigger}
                      >
                        <Activity size={16} /> Send 38kHz Trigger Pulse
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

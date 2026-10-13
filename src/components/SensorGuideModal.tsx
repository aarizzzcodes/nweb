import React, { useState } from 'react';
import {
  X,
  Folder,
  FileImage,
  Video,
  CheckCircle2,
  Copy,
  Sparkles,
  Upload,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SensorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMediaUploaded?: (
    sensorId: string,
    url: string,
    type: 'image' | 'video',
    slotIndex?: number
  ) => void;
}

export const SensorGuideModal: React.FC<SensorGuideModalProps> = ({
  isOpen,
  onClose,
  onMediaUploaded,
}) => {
  const [copiedPath, setCopiedPath] = useState(false);
  const [selectedSensorId, setSelectedSensorId] = useState('dht11');
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'video'>('image');

  const copyPath = () => {
    navigator.clipboard.writeText('public/media/sensors/');
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video');
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreviewType(isVideo ? 'video' : 'image');

    if (onMediaUploaded) {
      onMediaUploaded(selectedSensorId, url, isVideo ? 'video' : 'image', selectedSlot);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="sensor-modal-backdrop" onClick={onClose}>
        <motion.div
          className="sensor-guide-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
        >
          {/* Modal Header */}
          <div className="sensor-modal-header">
            <div className="modal-title-group">
              <span className="modal-tag">Sensor Photos Upload & 2-Photo Gallery Guide</span>
              <h2>Uploading Your 10 Sensor Workbench Photos</h2>
            </div>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close guide">
              <X size={20} />
            </button>
          </div>

          <div className="guide-content-body">
            {/* Step 1: Your 10 Photos Mapped to Each Sensor */}
            <div className="guide-step-card highlight">
              <div className="step-badge">
                <Sparkles size={16} />
              </div>
              <div className="step-details">
                <h3>Your 10 Photos Mapped to Their Sensors (2 Photos per Sensor Supported!)</h3>
                <p>
                  Here is where each of the 10 photos from your folder belongs. Sensors like Temperature & Humidity, Tilt Switch, and Infrared have <strong>2 photos each</strong>:
                </p>

                <div className="naming-table-container">
                  <table className="naming-table">
                    <thead>
                      <tr>
                        <th>Sensor Name</th>
                        <th>Your Photo 1 Filename</th>
                        <th>Your Photo 2 Filename</th>
                        <th>Target Sensor in Website</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>DHT11 Temperature & Humidity</strong>
                        </td>
                        <td>
                          <code className="highlight-code">temp hum.JPG</code> (IDE & circuit)
                        </td>
                        <td>
                          <code className="highlight-code">temp hu.JPG</code> (Close-up)
                        </td>
                        <td>
                          <span className="badge category-pill">Environmental</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>HC-SR04 Ultrasonic Sensor</strong>
                        </td>
                        <td>
                          <code className="highlight-code">ultrasonic.JPG</code> (Breadboard & Uno)
                        </td>
                        <td>
                          <span className="badge count-pill">Add later anytime</span>
                        </td>
                        <td>
                          <span className="badge category-pill">Distance & Motion</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>SW-520D Angle Tilt Switch</strong>
                        </td>
                        <td>
                          <code className="highlight-code">angle tilt.JPG</code> (Module hand)
                        </td>
                        <td>
                          <code className="highlight-code">angle tilt (2).JPG</code> (Breadboard setup)
                        </td>
                        <td>
                          <span className="badge category-pill">Physical / Tilt</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>KY-022 Infrared (IR) Sensor</strong>
                        </td>
                        <td>
                          <code className="highlight-code">ir.jpg</code> (Testing with remote)
                        </td>
                        <td>
                          <code className="highlight-code">ir2.JPG</code> (Arduino Uno rig)
                        </td>
                        <td>
                          <span className="badge category-pill">Optical & Light</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Soil Moisture Hygrometer</strong>
                        </td>
                        <td>
                          <code className="highlight-code">soil moisture.JPG</code> (Sensor probe)
                        </td>
                        <td>
                          <span className="badge count-pill">Add later anytime</span>
                        </td>
                        <td>
                          <span className="badge category-pill">Environmental</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>KY-024 Linear Magnetic Hall</strong>
                        </td>
                        <td>
                          <code className="highlight-code">magnetuc hallineear.JPG</code> (With magnet)
                        </td>
                        <td>
                          <span className="badge count-pill">Add later anytime</span>
                        </td>
                        <td>
                          <span className="badge category-pill">Magnetic & Hall</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Step 2: The Two Easy Ways to Add Them */}
            <div className="guide-step-card">
              <div className="step-badge">2</div>
              <div className="step-details">
                <h3>Two Easy Ways to Add Your Photos</h3>

                <div className="two-methods-grid">
                  <div className="method-box">
                    <h4>Method A: In-Browser Instant Upload (Easiest)</h4>
                    <p>
                      Open any sensor in the Sensors Lab and click the <strong>"Attach Photo 1"</strong> or <strong>"Attach Photo 2"</strong> button to pick the image file directly from your computer. The photos are instantly displayed in the 2-photo gallery carousel and saved!
                    </p>
                  </div>
                  <div className="method-box">
                    <h4>Method B: Copy Files to Repository Folder</h4>
                    <p>
                      Copy your photos directly into the project folder:
                    </p>
                    <div className="code-box-row" style={{ marginTop: '0.4rem' }}>
                      <code>public/media/sensors/</code>
                      <button className="copy-btn" onClick={copyPath} title="Copy path">
                        {copiedPath ? <CheckCircle2 size={16} color="#10b981" /> : <Copy size={16} />}
                        {copiedPath ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p className="step-note">
                      Keep the exact filenames (e.g. <code>temp hum.JPG</code>, <code>angle tilt.JPG</code>, <code>ultrasonic.JPG</code>) and Vite will serve them automatically!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Live Quick Photo Attacher */}
            <div className="guide-step-card">
              <div className="step-badge">3</div>
              <div className="step-details">
                <h3>Quick Photo Test & Attach Tool</h3>
                <p>
                  Attach your photos right now to see them live:
                </p>

                <div className="test-upload-bar">
                  <select
                    className="sensor-select"
                    value={selectedSensorId}
                    onChange={(e) => setSelectedSensorId(e.target.value)}
                  >
                    <option value="dht11">DHT11 Temp & Humidity (temp hum.JPG)</option>
                    <option value="hc-sr04">HC-SR04 Ultrasonic (ultrasonic.JPG)</option>
                    <option value="tilt-switch">Angle Tilt Switch (angle tilt.JPG)</option>
                    <option value="ky022">KY-022 Infrared (ir.jpg)</option>
                    <option value="soil-moisture">Soil Moisture (soil moisture.JPG)</option>
                    <option value="ky024">KY-024 Linear Hall (magnetuc hallineear.JPG)</option>
                    <option value="sr501">HC-SR501 PIR Motion</option>
                    <option value="bmp280">GY-BMP280 Barometric Pressure</option>
                    <option value="ky008">KY-008 Laser Transmitter</option>
                    <option value="ttp223b">TTP223B Touch Switch</option>
                    <option value="sw420">SW-420 Vibration Switch</option>
                    <option value="voltage-sensor">Voltage Sensor (0-25V)</option>
                  </select>

                  <select
                    className="sensor-select"
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(Number(e.target.value))}
                  >
                    <option value={0}>Photo 1 Slot</option>
                    <option value={1}>Photo 2 Slot</option>
                  </select>

                  <label className="btn btn-primary upload-label-btn">
                    <Upload size={16} /> Choose Image File
                    <input
                      type="file"
                      accept="image/*,video/*"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {previewUrl && (
                  <div className="preview-container">
                    <span className="preview-status">
                      <CheckCircle2 size={16} color="#10b981" /> Attached photo to {selectedSensorId} (Slot {selectedSlot + 1})!
                    </span>
                    <img src={previewUrl} alt="Sensor Preview" className="media-preview-box" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sensor-modal-footer">
            <span className="footer-tip">
              You can also add photos for all other 16 sensors later anytime!
            </span>
            <button className="btn btn-primary" onClick={onClose}>
              Ready, View Sensors Lab!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

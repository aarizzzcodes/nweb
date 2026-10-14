import React, { useState } from 'react';
import {
  X,
  Folder,
  CheckCircle2,
  Copy,
  Sparkles,
  ShieldCheck,
  Server,
  Terminal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SensorGuideModalProps {
  onClose: () => void;
}

export const SensorGuideModal: React.FC<SensorGuideModalProps> = ({ onClose }) => {
  const [copiedPath, setCopiedPath] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const copyPath = () => {
    navigator.clipboard.writeText('public/media/sensors/');
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2500);
  };

  const copyCmd = () => {
    navigator.clipboard.writeText('git add public/media/sensors/ && git commit -m "Add sensor photos" && git push');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
  };

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
              <span className="modal-tag">
                <ShieldCheck size={13} color="#10b981" /> Backend Architecture Specification
              </span>
              <h2>Hardware Media Storage & Catalog Directory</h2>
            </div>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close guide">
              <X size={20} />
            </button>
          </div>

          <div className="guide-content-body">
            {/* Security Notice: Strict Backend Only */}
            <div className="guide-security-banner">
              <div className="security-icon-circle">
                <Server size={20} color="#00f2fe" />
              </div>
              <div>
                <h4>Read-Only Security Protocol: Backend Uploads Only</h4>
                <p>
                  To preserve laboratory integrity and prevent unauthorized modifications,{' '}
                  <strong>visitor uploads are permanently disabled</strong> across the entire website.
                  All sensor media files are committed directly into the backend storage directory
                  and served as verified static assets.
                </p>
              </div>
            </div>

            {/* Current Active Hardware Photos Mapped to Each Sensor */}
            <div className="guide-step-card highlight">
              <div className="step-badge">
                <Sparkles size={16} />
              </div>
              <div className="step-details">
                <h3>Backend Hardware Captures Currently Configured</h3>
                <p>
                  The following bench photos are actively deployed in the repository and mapped to their corresponding sensor datasheets:
                </p>

                <div className="naming-table-container">
                  <table className="naming-table">
                    <thead>
                      <tr>
                        <th>Sensor Module</th>
                        <th>Workbench Angle 1</th>
                        <th>Close-Up Angle 2</th>
                        <th>Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>DHT11 Temp & Humidity</strong>
                        </td>
                        <td>
                          <code className="highlight-code">temp hum.JPG</code>
                        </td>
                        <td>
                          <code className="highlight-code">temp hu.JPG</code>
                        </td>
                        <td>
                          <span className="badge category-pill">Environmental</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>HC-SR04 Ultrasonic</strong>
                        </td>
                        <td>
                          <code className="highlight-code">ultrasonic.JPG</code>
                        </td>
                        <td>
                          <span className="badge count-pill">Single capture</span>
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
                          <code className="highlight-code">angle tilt.JPG</code>
                        </td>
                        <td>
                          <code className="highlight-code">angle tilt (2).JPG</code>
                        </td>
                        <td>
                          <span className="badge category-pill">Physical / Tilt</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>KY-022 Infrared Receiver</strong>
                        </td>
                        <td>
                          <code className="highlight-code">ir.jpg</code>
                        </td>
                        <td>
                          <code className="highlight-code">ir2.JPG</code>
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
                          <code className="highlight-code">soil moisture.JPG</code>
                        </td>
                        <td>
                          <code className="highlight-code">soil moistture.JPG</code>
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
                          <code className="highlight-code">magnetuc hallineear.JPG</code>
                        </td>
                        <td>
                          <span className="badge count-pill">Single capture</span>
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

            {/* How to add new sensor photos from backend */}
            <div className="guide-step-card">
              <div className="step-badge">
                <Folder size={16} />
              </div>
              <div className="step-details">
                <h3>Backend Asset Placement Instructions</h3>
                <p>
                  To add or update photos for any of the 22 sensor modules, place the image files directly into the repository media path:
                </p>

                <div className="code-box-row" style={{ marginTop: '0.6rem' }}>
                  <code>public/media/sensors/</code>
                  <button className="copy-btn" onClick={copyPath} title="Copy path">
                    {copiedPath ? <CheckCircle2 size={16} color="#10b981" /> : <Copy size={16} />}
                    {copiedPath ? 'Copied Path!' : 'Copy'}
                  </button>
                </div>

                <p className="step-note" style={{ marginTop: '0.8rem' }}>
                  Once files are copied, push to your Git repository:
                </p>

                <div className="code-box-row" style={{ marginTop: '0.4rem' }}>
                  <code>git add public/media/sensors/ && git commit -m &quot;Update sensor photos&quot;</code>
                  <button className="copy-btn" onClick={copyCmd} title="Copy Git command">
                    {copiedCmd ? <CheckCircle2 size={16} color="#10b981" /> : <Terminal size={16} />}
                    {copiedCmd ? 'Copied Command!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

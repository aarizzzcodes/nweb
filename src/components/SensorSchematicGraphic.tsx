import React from 'react';
import { Cpu, Zap, Activity, Radio, Sun, Compass, Shield } from 'lucide-react';

interface SensorSchematicGraphicProps {
  sensorId: string;
  name: string;
  model: string;
  category: string;
  voltage: string;
  interfaceType: string;
  pins: Array<{ name: string; type: string }>;
  accentColor?: string;
}

export const SensorSchematicGraphic: React.FC<SensorSchematicGraphicProps> = ({
  name,
  model,
  voltage,
  interfaceType,
  pins,
  accentColor = '#00f2fe',
}) => {
  return (
    <div
      className="sensor-schematic-blueprint"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1rem',
        background: 'radial-gradient(ellipse at center, rgba(14, 23, 42, 0.95) 0%, rgba(5, 8, 14, 1) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Grid Lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Cpu size={14} color={accentColor} />
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: accentColor, fontWeight: 700, textTransform: 'uppercase' }}>
            PCB SCHEMATIC
          </span>
        </div>
        <span
          style={{
            fontSize: '0.68rem',
            padding: '2px 6px',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '4px',
            color: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {voltage}
        </span>
      </div>

      {/* Center Simulated Hardware IC Block */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 'auto 0',
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: 'relative',
            padding: '0.75rem 1.2rem',
            background: 'rgba(10, 15, 26, 0.9)',
            border: `1.5px solid ${accentColor}`,
            boxShadow: `0 0 15px ${accentColor}25, inset 0 0 10px ${accentColor}15`,
            borderRadius: '6px',
            textAlign: 'center',
            maxWidth: '85%',
          }}
        >
          {/* IC Chip notch */}
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '12px',
              height: '4px',
              background: '#07090e',
              border: `1px solid ${accentColor}`,
              borderRadius: '0 0 4px 4px',
            }}
          />
          <span
            style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: '#ffffff',
              fontFamily: 'monospace',
            }}
          >
            {model}
          </span>
          <span
            style={{
              display: 'block',
              fontSize: '0.68rem',
              color: 'rgba(255, 255, 255, 0.65)',
              marginTop: '2px',
            }}
          >
            {interfaceType.split(' ')[0]} Engine
          </span>
        </div>

        {/* Pinout Trace Bus */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '0.8rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {pins.map((pin) => (
            <div
              key={pin.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <div
                style={{
                  width: '2px',
                  height: '8px',
                  background: accentColor,
                  opacity: 0.7,
                }}
              />
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                {pin.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer Details */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.65rem',
          color: 'rgba(255, 255, 255, 0.45)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '6px',
          zIndex: 1,
        }}
      >
        <span>AARIZ HARDWARE LAB</span>
        <span style={{ color: accentColor, fontWeight: 600 }}>DOCS VERIFIED</span>
      </div>
    </div>
  );
};

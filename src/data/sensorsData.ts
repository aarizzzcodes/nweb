import { SensorItem } from '../types';

export const SENSORS_DATA: SensorItem[] = [
  {
    id: 'dht11',
    name: 'DHT11 Temperature & Humidity Sensor',
    model: 'DHT11',
    category: 'environmental',
    categoryLabel: 'Environmental',
    voltage: '3.3V – 5.5V DC',
    interfaceType: '1-Wire Digital Signal',
    summary: 'Measures ambient atmospheric temperature and relative humidity with single-bus digital communication.',
    workingPrinciple:
      'Utilizes a capacitive humidity sensing element and a thermistor connected to a high-performance 8-bit microcontroller to output calibrated digital temperature and relative humidity readings.',
    pins: [
      { name: 'VCC', type: 'Power', description: '3.3V to 5V DC power supply' },
      { name: 'DATA', type: 'Digital', description: 'Bi-directional single-bus serial data output' },
      { name: 'NC', type: 'Signal', description: 'Not connected' },
      { name: 'GND', type: 'Ground', description: 'Circuit ground (0V)' },
    ],
    applications: [
      'Weather station telemetry nodes',
      'HVAC climate control automation',
      'Dehumidifier trigger circuits',
      'Indoor greenhouse monitoring',
    ],
    codeSnippet: `// Arduino DHT11 Readout
#include <DHT.h>
#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  Serial.print("Temp: "); Serial.print(t); Serial.print("°C | Hum: "); Serial.print(h); Serial.println("%");
  delay(2000);
}`,
    recommendedPhoto: '/media/sensors/dht11.jpg',
    recommendedPhoto2: '/media/sensors/dht11-2.jpg',
    userUploadedFilename1: 'temp hum.JPG',
    userUploadedFilename2: 'temp hu.JPG',
    photos: ['/media/sensors/temp hum.JPG', '/media/sensors/temp hu.JPG'],
    recommendedVideo: '/media/sensors/dht11-demo.mp4',
    simulation: {
      type: 'slider',
      label: 'Simulated Ambient Temp',
      unit: '°C',
      min: 15,
      max: 45,
      initialValue: 27,
    },
  },
  {
    id: 'hc-sr04',
    name: 'HC-SR04 Ultrasonic Distance Sensor',
    model: 'HC-SR04',
    category: 'motion',
    categoryLabel: 'Distance & Motion',
    voltage: '5V DC',
    interfaceType: 'Digital Trigger / Echo Pulses',
    summary: 'Measures non-contact target distances from 2cm to 400cm with 3mm precision using high-frequency 40kHz ultrasound.',
    workingPrinciple:
      'Transmits an 8-cycle sonic burst at 40kHz upon receiving a 10µs trigger pulse. Listens for the reflected wave on the echo pin; distance is calculated by elapsed transit time divided by sound velocity.',
    pins: [
      { name: 'VCC', type: 'Power', description: '+5V Power source' },
      { name: 'TRIG', type: 'Digital', description: 'Trigger pulse input (10µs minimum)' },
      { name: 'ECHO', type: 'Digital', description: 'High pulse output proportional to wave transit time' },
      { name: 'GND', type: 'Ground', description: 'Ground' },
    ],
    applications: [
      'Obstacle detection for autonomous rovers',
      'Liquid storage tank level monitoring',
      'Digital parking assist alert radar',
      'Contactless hand height gesture sensors',
    ],
    codeSnippet: `// HC-SR04 Distance Measurement
const int trigPin = 9;
const int echoPin = 10;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(trigPin, LOW); delayMicroseconds(2);
  digitalWrite(trigPin, HIGH); delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH);
  float distance = duration * 0.034 / 2; // in cm
  Serial.print("Target Distance: "); Serial.print(distance); Serial.println(" cm");
  delay(100);
}`,
    recommendedPhoto: '/media/sensors/hc-sr04.jpg',
    userUploadedFilename1: 'ultrasonic.JPG',
    photos: ['/media/sensors/ultrasonic.JPG'],
    recommendedVideo: '/media/sensors/hc-sr04-demo.mp4',
    simulation: {
      type: 'slider',
      label: 'Object Proximity',
      unit: 'cm',
      min: 2,
      max: 300,
      initialValue: 45,
    },
  },
  {
    id: 'sr501',
    name: 'HC-SR501 PIR Infrared Motion Sensor',
    model: 'HC-SR501',
    category: 'motion',
    categoryLabel: 'Distance & Motion',
    voltage: '4.5V – 20V DC',
    interfaceType: 'Digital High (3.3V) / Low (0V)',
    summary: 'Detects presence and motion of human bodies or infrared-emitting objects over a 120° cone up to 7 meters.',
    workingPrinciple:
      'Equipped with a dual-element pyroelectric sensor behind a Fresnel lens. As human body infrared patterns (approx. 9.4µm) sweep across the split sensor slots, a differential voltage triggers an output pulse.',
    pins: [
      { name: 'VCC', type: 'Power', description: '4.5V–20V input' },
      { name: 'OUT', type: 'Digital', description: 'Digital signal out (3.3V active high)' },
      { name: 'GND', type: 'Ground', description: 'Ground' },
    ],
    applications: [
      'Automated corridor occupancy lighting',
      'Burglar alarm intruder detection',
      'Smart energy saver screen switches',
      'IoT security surveillance perimeter',
    ],
    codeSnippet: `// HC-SR501 PIR Motion Alert
const int pirPin = 7;
const int ledPin = 13;

void setup() {
  pinMode(pirPin, INPUT);
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int motion = digitalRead(pirPin);
  if (motion == HIGH) {
    digitalWrite(ledPin, HIGH);
    Serial.println(">>> MOTION DETECTED! INTRUSION ALERT <<<");
  } else {
    digitalWrite(ledPin, LOW);
  }
  delay(200);
}`,
    recommendedPhoto: '/media/sensors/sr501-pir.jpg',
    recommendedVideo: '/media/sensors/sr501-pir-demo.mp4',
    simulation: {
      type: 'toggle',
      label: 'Motion Trigger State',
      initialValue: false,
    },
  },
  {
    id: 'bmp280',
    name: 'GY-BMP280 Barometric Pressure & Temp Sensor',
    model: 'BMP280',
    category: 'environmental',
    categoryLabel: 'Environmental',
    voltage: '1.8V – 3.6V (3.3V Module)',
    interfaceType: 'I2C / SPI Bus Protocol',
    summary: 'High-accuracy barometric pressure, temperature, and calculated altitude sensor based on Bosch piezo-resistive MEMS.',
    workingPrinciple:
      'Piezo-resistive micromachined pressure sensing cell converts atmospheric pressure to electrical resistance, sampled by an ultra-low noise 24-bit internal ADC with calibrated factory offsets.',
    pins: [
      { name: 'VCC', type: 'Power', description: '3.3V power pin' },
      { name: 'GND', type: 'Ground', description: 'Ground reference' },
      { name: 'SCL', type: 'I2C', description: 'I2C clock line (SCK)' },
      { name: 'SDA', type: 'I2C', description: 'I2C serial data line (SDI)' },
      { name: 'CSB', type: 'Digital', description: 'Chip select (default I2C pullup)' },
      { name: 'SDO', type: 'Digital', description: 'I2C address select bit' },
    ],
    applications: [
      'Altimeter for drone flight controllers & rockets',
      'Micro-climate meteorological forecasting',
      'Indoor stair/floor elevator altitude tracking',
      'Sports smartwatch barometers',
    ],
    codeSnippet: `// BMP280 Altitude and Pressure
#include <Wire.h>
#include <Adafruit_BMP280.h>

Adafruit_BMP280 bmp;

void setup() {
  Serial.begin(9600);
  if (!bmp.begin(0x76)) {
    Serial.println("BMP280 connection failed!");
    while(1);
  }
}

void loop() {
  Serial.print("Pressure: "); Serial.print(bmp.readPressure() / 100.0F); Serial.println(" hPa");
  Serial.print("Altitude: "); Serial.print(bmp.readAltitude(1013.25)); Serial.println(" m");
  delay(1000);
}`,
    recommendedPhoto: '/media/sensors/bmp280.jpg',
    recommendedVideo: '/media/sensors/bmp280-demo.mp4',
    simulation: {
      type: 'slider',
      label: 'Atmospheric Pressure',
      unit: 'hPa',
      min: 950,
      max: 1050,
      initialValue: 1013,
    },
  },
  {
    id: 'soil-moisture',
    name: 'Soil Moisture Hygrometer Sensor',
    model: 'Soil Probe + LM393',
    category: 'environmental',
    categoryLabel: 'Environmental',
    voltage: '3.3V – 5V DC',
    interfaceType: 'Analog Voltage (AO) & Digital Switch (DO)',
    summary: 'Monitors volumetric water content in soil by measuring electrical resistance between corrosion-resistant probes.',
    workingPrinciple:
      'Dry soil presents high electrical resistance resulting in high analog output, whereas moist soil conducts electrical current across the conductive pads, dropping voltage output proportionally.',
    pins: [
      { name: 'VCC', type: 'Power', description: '3.3V - 5V power supply' },
      { name: 'GND', type: 'Ground', description: 'Power ground' },
      { name: 'DO', type: 'Digital', description: 'Digital threshold trigger output' },
      { name: 'AO', type: 'Analog', description: 'Continuous analog voltage (0V-5V)' },
    ],
    applications: [
      'Automated agricultural irrigation valve controllers',
      'Smart potted plant hydration monitors',
      'Botanical garden greenhouse moisture telemetry',
      'Soil hydrology research rigs',
    ],
    codeSnippet: `// Soil Moisture Auto-Watering Check
const int sensorPin = A0;
const int pumpRelayPin = 8;

void setup() {
  pinMode(pumpRelayPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int sensorValue = analogRead(sensorPin);
  Serial.print("Moisture Level: "); Serial.println(sensorValue);
  // Lower value indicates wetter soil
  if (sensorValue > 600) {
    digitalWrite(pumpRelayPin, HIGH); // Turn on water pump
    Serial.println("Soil dry! Activating pump...");
  } else {
    digitalWrite(pumpRelayPin, LOW);
  }
  delay(1000);
}`,
    recommendedPhoto: '/media/sensors/soilmoisture.JPG',
    recommendedPhoto2: '/media/sensors/soil moistture.JPG',
    userUploadedFilename1: 'soilmoisture.JPG',
    userUploadedFilename2: 'soil moistture.JPG',
    photos: ['/media/sensors/soilmoisture.JPG', '/media/sensors/soil moistture.JPG'],
    recommendedVideo: '/media/sensors/soil-moisture-demo.mp4',
    simulation: {
      type: 'slider',
      label: 'Soil Hydration Level',
      unit: '%',
      min: 0,
      max: 100,
      initialValue: 68,
    },
  },
  {
    id: 'raindrop',
    name: 'Raindrop & Moisture Detection Sensor',
    model: 'Rain Board + LM393',
    category: 'environmental',
    categoryLabel: 'Environmental',
    voltage: '3.3V – 5V DC',
    interfaceType: 'Analog (AO) & Digital (DO)',
    summary: 'Detects precipitation and liquid droplets on an exposed nickel-plated interdigitated track plate.',
    workingPrinciple:
      'Rain droplets bridging the exposed interdigitated PCB traces decrease electrical resistance between conductors, producing an immediate analog voltage drop and digital comparator switch.',
    pins: [
      { name: 'VCC', type: 'Power', description: '3.3V-5V input' },
      { name: 'GND', type: 'Ground', description: 'Ground' },
      { name: 'DO', type: 'Digital', description: 'Digital threshold alert' },
      { name: 'AO', type: 'Analog', description: 'Analog moisture intensity' },
    ],
    applications: [
      'Automated windshield wiper activation circuits',
      'Automatic awning and motorized window closers',
      'Outdoor weather telemetry stations',
      'Flood and roof leak warning monitors',
    ],
    codeSnippet: `// Raindrop Sensor Detection
const int rainPin = A1;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int val = analogRead(rainPin);
  if (val < 400) {
    Serial.println("HEAVY RAINFALL DETECTED! Closing motorized windows.");
  } else if (val < 700) {
    Serial.println("Light rain or drizzle.");
  } else {
    Serial.println("Clear weather / dry sensor.");
  }
  delay(1500);
}`,
    recommendedPhoto: '/media/sensors/raindrop-sensor.jpg',
    recommendedVideo: '/media/sensors/raindrop-demo.mp4',
    simulation: {
      type: 'toggle',
      label: 'Precipitation Detected',
      initialValue: false,
    },
  },
  {
    id: 'water-level',
    name: 'Submersible Water Level Depth Sensor',
    model: 'Parallel Trace Depth Sensor',
    category: 'environmental',
    categoryLabel: 'Environmental',
    voltage: '3V – 5V DC',
    interfaceType: 'Analog Voltage Output',
    summary: 'Measures fluid depth and reservoir liquid level through submerged parallel exposed conductive traces.',
    workingPrinciple:
      'Impedance across alternating parallel lines decreases linearly as immersion depth increases, producing a continuous analog voltage proportional to liquid height.',
    pins: [
      { name: '+', type: 'Power', description: '3V-5V DC positive rail' },
      { name: '-', type: 'Ground', description: 'Ground (GND)' },
      { name: 'S', type: 'Analog', description: 'Analog voltage signal (0V to VCC)' },
    ],
    applications: [
      'Sump pump sump pit overflow alert',
      'Domestic water tank overflow alarms',
      'Hydroponic reservoir level sensing',
      'Aquarium automated top-off systems',
    ],
    codeSnippet: `// Water Level Depth Readout
const int levelPin = A2;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int level = analogRead(levelPin);
  Serial.print("Water Depth Raw ADC: ");
  Serial.print(level);
  Serial.print(" (Approx Depth: ");
  Serial.print(map(level, 0, 700, 0, 40)); // mm
  Serial.println(" mm)");
  delay(500);
}`,
    recommendedPhoto: '/media/sensors/water-level.jpg',
    recommendedVideo: '/media/sensors/water-level-demo.mp4',
    simulation: {
      type: 'slider',
      label: 'Liquid Depth',
      unit: 'mm',
      min: 0,
      max: 45,
      initialValue: 24,
    },
  },
  {
    id: 'sw420',
    name: 'SW-420 Vibration & Shock Sensor',
    model: 'SW-420 + LM393',
    category: 'physical',
    categoryLabel: 'Physical & Mechanical',
    voltage: '3.3V – 5V DC',
    interfaceType: 'Digital Switch Output (DO)',
    summary: 'Captures mechanical shock, vibrations, seismic tremors, and anti-theft tampering events.',
    workingPrinciple:
      'Features an internal spring-supported mass contacting an electrical pole. Mechanical shock causes the spring to deflect and break/make electrical contact, read via an onboard LM393 comparator.',
    pins: [
      { name: 'VCC', type: 'Power', description: '3.3V to 5V supply' },
      { name: 'GND', type: 'Ground', description: 'Ground' },
      { name: 'DO', type: 'Digital', description: 'Digital output (Low when undisturbed, High on shock)' },
    ],
    applications: [
      'Motorbike & vehicle anti-theft alarms',
      'Industrial machinery bearing vibration diagnostics',
      'Earthquake warning triggers',
      'Smart parcel impact drop logger',
    ],
    codeSnippet: `// SW-420 Vibration Alarm
const int vibPin = 3;

void setup() {
  pinMode(vibPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(vibPin) == HIGH) {
    Serial.println(">>> SEVERE VIBRATION / TAMPER EVENT DETECTED! <<<");
    delay(200);
  }
}`,
    recommendedPhoto: '/media/sensors/sw-420-vibration.jpg',
    recommendedVideo: '/media/sensors/sw-420-demo.mp4',
    simulation: {
      type: 'trigger',
      label: 'Simulate Impact / Shake',
      initialValue: false,
    },
  },
  {
    id: 'ky037',
    name: 'KY-037 High-Sensitivity Microphone Sensor',
    model: 'KY-037',
    category: 'acoustic',
    categoryLabel: 'Acoustic & Sound',
    voltage: '3.3V – 5V DC',
    interfaceType: 'Analog (AO) & Digital (DO)',
    summary: 'Acoustic electret microphone detecting sound waves, clapping patterns, voice frequencies, and ambient noise.',
    workingPrinciple:
      'Acoustic pressure variations vibrate an electret condenser diaphragm, producing microvolt fluctuations boosted through an onboard op-amp with adjustable gain potentiometer.',
    pins: [
      { name: 'AO', type: 'Analog', description: 'Real-time analog acoustic waveform output' },
      { name: 'GND', type: 'Ground', description: 'System ground' },
      { name: 'VCC', type: 'Power', description: '+5V Power pin' },
      { name: 'DO', type: 'Digital', description: 'Digital threshold trigger for claps/snaps' },
    ],
    applications: [
      'Clap-controlled lighting switches',
      'Acoustic decibel noise pollution monitoring',
      'Voice-activated robotics triggers',
      'Glass-break security sensors',
    ],
    codeSnippet: `// Clap Switch with KY-037
const int soundPin = 4;
bool lampState = false;

void setup() {
  pinMode(soundPin, INPUT);
  pinMode(13, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(soundPin) == HIGH) {
    lampState = !lampState;
    digitalWrite(13, lampState ? HIGH : LOW);
    Serial.println("Sound impulse detected! Toggled switch state.");
    delay(300); // debounce
  }
}`,
    recommendedPhoto: '/media/sensors/ky-037-microphone.jpg',
    recommendedVideo: '/media/sensors/ky-037-demo.mp4',
    simulation: {
      type: 'slider',
      label: 'Acoustic Level',
      unit: 'dB',
      min: 30,
      max: 110,
      initialValue: 48,
    },
  },
  {
    id: 'tcrt5000',
    name: 'TCRT5000 Line Tracking Optical Module',
    model: 'TCRT5000',
    category: 'motion',
    categoryLabel: 'Distance & Motion',
    voltage: '3.3V – 5V DC',
    interfaceType: 'Digital (DO) & Analog (AO)',
    summary: 'Reflective optical sensor specifically engineered for line-following autonomous mobile robotics.',
    workingPrinciple:
      'Emits continuous infrared light from an internal 950nm LED. Reflective white surfaces bounce light into the phototransistor, while dark black tape absorbs the infrared spectrum, altering conduction.',
    pins: [
      { name: 'VCC', type: 'Power', description: '3.3V - 5V power supply' },
      { name: 'GND', type: 'Ground', description: 'Ground' },
      { name: 'DO', type: 'Digital', description: 'Digital high/low line state' },
      { name: 'AO', type: 'Analog', description: 'Continuous surface reflectivity ADC' },
    ],
    applications: [
      'Line-tracking autonomous AGV warehouse carts',
      'Paper feed alignment in desktop printers',
      'Rotary optical encoder pulse counting',
      'Drop-off edge and cliff detection in robot vacuum cleaners',
    ],
    codeSnippet: `// TCRT5000 Line Tracker
const int trackPin = 5;

void setup() {
  pinMode(trackPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(trackPin) == LOW) {
    Serial.println("Surface: White Ground (Reflective)");
  } else {
    Serial.println("Surface: Black Tape Guide Line Detected!");
  }
  delay(100);
}`,
    recommendedPhoto: '/media/sensors/tcrt5000-tracker.jpg',
    recommendedVideo: '/media/sensors/tcrt5000-demo.mp4',
    simulation: {
      type: 'toggle',
      label: 'Over Black Guide Line',
      initialValue: true,
    },
  },
  {
    id: 'obstacle-avoidance',
    name: 'Infrared Obstacle Avoidance Module',
    model: 'FC-51 / IR Proximity',
    category: 'motion',
    categoryLabel: 'Distance & Motion',
    voltage: '3.3V – 5V DC',
    interfaceType: 'Digital Active-Low Output',
    summary: 'Compact proximity collision avoidance sensor with adjustable detection distance (2cm–30cm).',
    workingPrinciple:
      'Transmitter diode outputs modulated infrared rays. When an obstruction reflects light back to the photodiode receiver, the onboard LM393 comparator pulls output LOW and illuminates the onboard LED indicator.',
    pins: [
      { name: 'VCC', type: 'Power', description: '3.3V - 5V power' },
      { name: 'GND', type: 'Ground', description: 'Ground' },
      { name: 'OUT', type: 'Digital', description: 'Active-low obstacle alert (LOW = Object Ahead)' },
    ],
    applications: [
      'Mini autonomous rover collision prevention',
      'Automatic touchless sanitiser dispenser trigger',
      'Conveyor belt package presence verification',
      'Smart trash can lid opening sensor',
    ],
    codeSnippet: `// Obstacle Detection
const int irAvoidPin = 6;

void setup() {
  pinMode(irAvoidPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(irAvoidPin) == LOW) {
    Serial.println("OBSTACLE AHEAD! Stopping motors / turning right.");
  } else {
    Serial.println("Clear path ahead.");
  }
  delay(100);
}`,
    recommendedPhoto: '/media/sensors/obstacle-avoidance.jpg',
    recommendedVideo: '/media/sensors/obstacle-avoidance-demo.mp4',
    simulation: {
      type: 'toggle',
      label: 'Obstruction Ahead',
      initialValue: false,
    },
  },
  {
    id: 'ky008',
    name: 'KY-008 650nm Red Laser Transmitter',
    model: 'KY-008',
    category: 'optical',
    categoryLabel: 'Optical & Light',
    voltage: '5V DC',
    interfaceType: 'Digital High/Low (TTL)',
    summary: '650nm visible red semiconductor laser diode emitting a concentrated, high-collimation coherent laser dot.',
    workingPrinciple:
      'Emits a 5mW 650nm laser beam when powered. When focused onto a distant photoresistor or phototransistor, forms a long-range optical tripwire barrier.',
    pins: [
      { name: 'S', type: 'Digital', description: 'Signal input (High = Laser ON, Low = Laser OFF)' },
      { name: '+', type: 'Power', description: '5V power' },
      { name: '-', type: 'Ground', description: 'Ground' },
    ],
    applications: [
      'Long-distance perimeter laser security tripwires',
      'Precision optical target alignment',
      'Speed-of-light physical science experiments',
      'Laser communication optical data links',
    ],
    codeSnippet: `// Laser Tripwire Emitter Pulse
const int laserPin = 8;

void setup() {
  pinMode(laserPin, OUTPUT);
}

void loop() {
  digitalWrite(laserPin, HIGH); // Laser beam ON
  delay(1000);
  digitalWrite(laserPin, LOW);  // Laser beam OFF
  delay(500);
}`,
    recommendedPhoto: '/media/sensors/ky-008-laser.jpg',
    recommendedVideo: '/media/sensors/ky-008-demo.mp4',
    simulation: {
      type: 'toggle',
      label: 'Laser Beam Status',
      initialValue: true,
    },
  },
  {
    id: 'ttp223b',
    name: 'TTP223B Capacitive Touch Switch Module',
    model: 'TTP223B',
    category: 'physical',
    categoryLabel: 'Physical & Mechanical',
    voltage: '2V – 5.5V DC',
    interfaceType: 'Digital High/Low Switch',
    summary: 'Solid-state touch sensor pad replacing mechanical click buttons with zero mechanical contact wear.',
    workingPrinciple:
      'Monitors capacitive dielectric charge shifts caused by human finger proximity over the copper sensing pad. Can penetrate glass, plastic, and wood panels.',
    pins: [
      { name: 'VCC', type: 'Power', description: '2V - 5.5V DC' },
      { name: 'GND', type: 'Ground', description: 'Ground' },
      { name: 'SIG', type: 'Digital', description: 'Touch state output (Active High)' },
    ],
    applications: [
      'Modern glass-mounted wall switch panels',
      'Waterproof touch interfaces for wet environments',
      'Interactive museum installation exhibits',
      'Secret capacitive lock panels hidden under wood',
    ],
    codeSnippet: `// Capacitive Touch Button
const int touchPin = 2;

void setup() {
  pinMode(touchPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(touchPin) == HIGH) {
    Serial.println("Touch contact registered!");
    delay(200);
  }
}`,
    recommendedPhoto: '/media/sensors/ttp223b-touch.jpg',
    recommendedVideo: '/media/sensors/ttp223b-demo.mp4',
    simulation: {
      type: 'toggle',
      label: 'Capacitive Contact',
      initialValue: false,
    },
  },
  {
    id: 'voltage-sensor',
    name: '0–25V Analog Voltage Detection Module',
    model: 'Precision Voltage Divider (5:1)',
    category: 'electrical',
    categoryLabel: 'Electrical & Power',
    voltage: '0V – 25V Input (5V MCU)',
    interfaceType: 'Analog Voltage (0V–5V)',
    summary: 'Precision resistor divider circuit allowing microcontrollers to measure high battery voltages safely.',
    workingPrinciple:
      'Uses precision 30kΩ and 7.5kΩ resistors configured as a 5:1 divider. Scales input voltages up to 25V down to 5V (or up to 16.5V down to 3.3V) for microcontroller ADC pins.',
    pins: [
      { name: 'VCC (In)', type: 'Power', description: 'Positive terminal of battery (0-25V)' },
      { name: 'GND (In)', type: 'Ground', description: 'Negative terminal of battery' },
      { name: 'S', type: 'Analog', description: 'Scaled analog output (0V-5V) to microcontroller ADC' },
      { name: '-', type: 'Ground', description: 'Reference ground to microcontroller' },
    ],
    applications: [
      'LiPo / Lead-acid battery charge state monitoring',
      'Solar panel open-circuit voltage tracking',
      'Robotics power management and low-battery failsafe',
      'Bench power supply telemetry display',
    ],
    codeSnippet: `// Battery Voltage Measurement
const int voltPin = A3;
const float R1 = 30000.0;
const float R2 = 7500.0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(voltPin);
  float vOut = (raw * 5.0) / 1024.0;
  float vIn = vOut / (R2 / (R1 + R2));
  Serial.print("Measured Battery Voltage: ");
  Serial.print(vIn);
  Serial.println(" V");
  delay(1000);
}`,
    recommendedPhoto: '/media/sensors/voltage-sensor.jpg',
    recommendedVideo: '/media/sensors/voltage-demo.mp4',
    simulation: {
      type: 'slider',
      label: 'Battery Pack Voltage',
      unit: 'V',
      min: 0,
      max: 24,
      initialValue: 12.6,
    },
  },
  {
    id: 'speed-sensor',
    name: 'Optical Groove Coupler Speed Sensor',
    model: 'LM393 Optocoupler Speed Module',
    category: 'motion',
    categoryLabel: 'Distance & Motion',
    voltage: '3.3V – 5V DC',
    interfaceType: 'Digital (DO) & Analog (AO)',
    summary: 'Infrared slotted optocoupler counting rotor pulses to calculate motor RPM and wheel velocity.',
    workingPrinciple:
      'Features a 5mm slot with an IR emitter facing an IR phototransistor. As a perforated encoder wheel spins through the slot, each spoke interrupts the beam and generates clean digital pulses.',
    pins: [
      { name: 'VCC', type: 'Power', description: '3.3V to 5V DC' },
      { name: 'GND', type: 'Ground', description: 'Ground' },
      { name: 'DO', type: 'Digital', description: 'Digital pulse output' },
      { name: 'AO', type: 'Analog', description: 'Analog output' },
    ],
    applications: [
      'DC motor closed-loop PID RPM velocity regulation',
      'Vehicle odometer and speedometer calculations',
      'Wind turbine anemometer speed logging',
      'Industrial assembly line unit counting',
    ],
    codeSnippet: `// Tachometer Pulse Counter
volatile unsigned int pulseCount = 0;

void countPulse() {
  pulseCount++;
}

void setup() {
  Serial.begin(9600);
  attachInterrupt(digitalPinToInterrupt(2), countPulse, RISING);
}

void loop() {
  pulseCount = 0;
  delay(1000); // 1 second sample
  int rpm = (pulseCount * 60) / 20; // 20 slots per wheel
  Serial.print("Motor RPM: "); Serial.println(rpm);
}`,
    recommendedPhoto: '/media/sensors/speed-sensor.jpg',
    recommendedVideo: '/media/sensors/speed-demo.mp4',
    simulation: {
      type: 'slider',
      label: 'Motor RPM',
      unit: 'RPM',
      min: 0,
      max: 3000,
      initialValue: 840,
    },
  },
  {
    id: 'ky024',
    name: 'KY-024 Linear Magnetic Hall Effect Sensor',
    model: 'KY-024',
    category: 'magnetic',
    categoryLabel: 'Magnetic & Hall',
    voltage: '3.3V – 5V DC',
    interfaceType: 'Analog (AO) & Digital (DO)',
    summary: 'Measures continuous magnetic flux density and polarity changes from permanent magnets and electromagnets.',
    workingPrinciple:
      'Operates via the Lorentz force on charge carriers inside a semiconductor Hall element, outputting analog voltage directly proportional to Gauss magnetic strength.',
    pins: [
      { name: 'AO', type: 'Analog', description: 'Analog voltage proportional to magnetic field' },
      { name: 'GND', type: 'Ground', description: 'Ground' },
      { name: 'VCC', type: 'Power', description: '5V power' },
      { name: 'DO', type: 'Digital', description: 'Adjustable threshold digital trigger' },
    ],
    applications: [
      'Contactless throttle position sensing',
      'Neodymium magnet distance gauging',
      'Brushless DC motor commutation feedback',
      'Smart magnetic limit switches',
    ],
    codeSnippet: `// Linear Hall Magnetic Measurement
const int hallPin = A4;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int val = analogRead(hallPin);
  Serial.print("Magnetic Flux Raw ADC: ");
  Serial.println(val);
  delay(200);
}`,
    recommendedPhoto: '/media/sensors/ky-024-hall-linear.jpg',
    userUploadedFilename1: 'magnetuc hallineear.JPG',
    photos: ['/media/sensors/magnetuc hallineear.JPG'],
    recommendedVideo: '/media/sensors/ky-024-demo.mp4',
    simulation: {
      type: 'slider',
      label: 'Magnetic Field Strength',
      unit: 'Gauss',
      min: -500,
      max: 500,
      initialValue: 120,
    },
  },
  {
    id: 'ky003',
    name: 'KY-003 Hall Effect Digital Switch Sensor',
    model: 'KY-003 (3144 Hall Switch)',
    category: 'magnetic',
    categoryLabel: 'Magnetic & Hall',
    voltage: '4.5V – 24V DC',
    interfaceType: 'Digital Open-Collector / Switch',
    summary: 'Ultra-fast solid-state magnetic switch turning ON when a south magnetic pole approaches.',
    workingPrinciple:
      'Contains an integrated Hall plate, voltage regulator, Schmitt trigger, and open-collector output transistor that snaps LOW upon reaching the magnetic operate point (Bop).',
    pins: [
      { name: 'S', type: 'Digital', description: 'Output signal (Low when magnet is present)' },
      { name: '+', type: 'Power', description: '5V supply rail' },
      { name: '-', type: 'Ground', description: 'Ground' },
    ],
    applications: [
      'Window and door burglar contact sensors',
      'Bicycle spoke speedometer reed switch replacement',
      'Brushless motor revolution pickoff',
      'Contactless safety interlock switches',
    ],
    codeSnippet: `// Digital Hall Switch Check
const int hallSwitchPin = 3;

void setup() {
  pinMode(hallSwitchPin, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(hallSwitchPin) == LOW) {
    Serial.println("MAGNET PRESENT: Door Closed / Switch Engaged");
  } else {
    Serial.println("NO MAGNET: Door Open Alert!");
  }
  delay(150);
}`,
    recommendedPhoto: '/media/sensors/ky-003-hall-switch.jpg',
    recommendedVideo: '/media/sensors/ky-003-demo.mp4',
    simulation: {
      type: 'toggle',
      label: 'Magnet in Proximity',
      initialValue: true,
    },
  },
  {
    id: 'tilt-switch',
    name: 'SW-520D Angle Tilt Ball Switch Sensor',
    model: 'SW-520D / KY-020',
    category: 'physical',
    categoryLabel: 'Physical & Mechanical',
    voltage: '3.3V – 5V DC',
    interfaceType: 'Digital State Switch',
    summary: 'Detects gravitational orientation change, tipping, and inversion angles greater than 15 degrees.',
    workingPrinciple:
      'Houses metallic conductive micro-balls inside an insulated tube. When upright, the balls roll across two gold-plated pins to bridge the circuit; when tilted, the balls roll away to break continuity.',
    pins: [
      { name: 'Signal', type: 'Digital', description: 'Digital tilt state' },
      { name: 'VCC', type: 'Power', description: 'Power' },
      { name: 'GND', type: 'Ground', description: 'Ground' },
    ],
    applications: [
      'Heater tip-over fire prevention shutoff',
      'Electronic game dice shaker detection',
      'Camera portrait/landscape orientation toggle',
      'Anti-theft motion displacement triggers',
    ],
    codeSnippet: `// Angle Tilt Safety Shutoff
const int tiltPin = 7;

void setup() {
  pinMode(tiltPin, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(tiltPin) == HIGH) {
    Serial.println("ALERT: Device tilted or overturned! Cutting heater power.");
  } else {
    Serial.println("Orientation upright and stable.");
  }
  delay(300);
}`,
    recommendedPhoto: '/media/sensors/tilt-switch.jpg',
    recommendedPhoto2: '/media/sensors/tilt-switch-2.jpg',
    userUploadedFilename1: 'angle tilt.JPG',
    userUploadedFilename2: 'angle tilt (2).JPG',
    photos: ['/media/sensors/angle tilt.JPG', '/media/sensors/angle tilt (2).JPG'],
    recommendedVideo: '/media/sensors/tilt-switch-demo.mp4',
    simulation: {
      type: 'toggle',
      label: 'Device Tilted Past 15°',
      initialValue: false,
    },
  },
  {
    id: 'ky022',
    name: 'KY-022 38kHz Infrared Receiver Sensor',
    model: 'KY-022 (VS1838B)',
    category: 'optical',
    categoryLabel: 'Optical & Light',
    voltage: '3V – 5V DC',
    interfaceType: 'Demodulated Digital Pulse Train',
    summary: 'Receives and decodes 38kHz modulated infrared signals from standard consumer handheld remote controls.',
    workingPrinciple:
      'Contains an internal PIN photodiode, preamplifier, bandpass filter centered at 38kHz, and demodulator, extracting clean digital hex bit streams from infrared remote pulses.',
    pins: [
      { name: 'S', type: 'Digital', description: 'Demodulated serial signal output (to MCU)' },
      { name: 'VCC', type: 'Power', description: '5V supply' },
      { name: 'GND', type: 'Ground', description: 'Ground' },
    ],
    applications: [
      'IR remote-controlled home appliances & TV hubs',
      'Robot navigation command overrides',
      'Optical wireless data packet transfer',
      'Multi-device universal remote receiver',
    ],
    codeSnippet: `// Infrared Remote Decoder
#include <IRremote.hpp>
const int recvPin = 11;

void setup() {
  Serial.begin(9600);
  IrReceiver.begin(recvPin, ENABLE_LED_FEEDBACK);
}

void loop() {
  if (IrReceiver.decode()) {
    Serial.print("Decoded IR Command Code: 0x");
    Serial.println(IrReceiver.decodedIRData.command, HEX);
    IrReceiver.resume();
  }
}`,
    recommendedPhoto: '/media/sensors/ky-022-ir-receiver.jpg',
    recommendedPhoto2: '/media/sensors/ky-022-2.jpg',
    userUploadedFilename1: 'ir.jpg',
    userUploadedFilename2: 'ir2.JPG',
    photos: ['/media/sensors/ir.jpg', '/media/sensors/ir2.JPG'],
    recommendedVideo: '/media/sensors/ky-022-demo.mp4',
    simulation: {
      type: 'trigger',
      label: 'Simulate IR Remote Button Press',
      initialValue: false,
    },
  },
  {
    id: 'lm393-light',
    name: 'LM393 Photosensitive LDR Light Sensor',
    model: 'LM393 LDR Module',
    category: 'optical',
    categoryLabel: 'Optical & Light',
    voltage: '3.3V – 5V DC',
    interfaceType: 'Digital (DO) & Analog (AO)',
    summary: 'Photoresistor module with onboard precision comparator and sensitivity trimmer potentiometer.',
    workingPrinciple:
      'Photoresistor resistance drops dramatically under ambient illumination. The LM393 compares the voltage divider against an adjustable reference, triggering DO and providing continuous AO.',
    pins: [
      { name: 'VCC', type: 'Power', description: '3.3V to 5V DC' },
      { name: 'GND', type: 'Ground', description: 'Ground' },
      { name: 'DO', type: 'Digital', description: 'Day/Night threshold digital output' },
      { name: 'AO', type: 'Analog', description: 'Continuous ambient light intensity ADC' },
    ],
    applications: [
      'Automated dusk-to-dawn street lighting switches',
      'Dual-axis solar tracking panel controllers',
      'Display backlight ambient brightness adjustment',
      'Laser tripwire beam receiver',
    ],
    codeSnippet: `// Dusk-to-Dawn Streetlight Control
const int ldrPin = A5;
const int streetLightRelay = 12;

void setup() {
  pinMode(streetLightRelay, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int lightLevel = analogRead(ldrPin);
  Serial.print("Ambient Light: "); Serial.println(lightLevel);
  if (lightLevel > 700) { // Dark environment
    digitalWrite(streetLightRelay, HIGH);
    Serial.println("Dusk detected: Streetlight ON");
  } else {
    digitalWrite(streetLightRelay, LOW);
  }
  delay(1000);
}`,
    recommendedPhoto: '/media/sensors/lm393-photosensitive.jpg',
    recommendedVideo: '/media/sensors/lm393-demo.mp4',
    simulation: {
      type: 'slider',
      label: 'Ambient Illumination',
      unit: 'Lux',
      min: 0,
      max: 1000,
      initialValue: 350,
    },
  },
  {
    id: 'ky018',
    name: 'KY-018 Photoresistor Module',
    model: 'KY-018',
    category: 'optical',
    categoryLabel: 'Optical & Light',
    voltage: '3.3V – 5V DC',
    interfaceType: 'Analog Voltage Output',
    summary: 'Simple CdS (cadmium sulfide) photo-sensitive resistor module with onboard pullup resistor.',
    workingPrinciple:
      'Forms an analog voltage divider with an onboard 10kΩ resistor. Incident photons promote electrons across the semiconductor band gap, lowering resistance proportionally to lumen density.',
    pins: [
      { name: 'S', type: 'Analog', description: 'Analog voltage output (to ADC)' },
      { name: 'VCC', type: 'Power', description: '5V supply' },
      { name: 'GND', type: 'Ground', description: 'Ground reference' },
    ],
    applications: [
      'Smart home ambient lighting logs',
      'Optical shadow drop counters',
      'Greenhouse sunlight exposure logging',
      'Flashlight beam detector experiments',
    ],
    codeSnippet: `// KY-018 Light Readout
const int pin = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int val = analogRead(pin);
  Serial.print("Lux Index: ");
  Serial.println(val);
  delay(200);
}`,
    recommendedPhoto: '/media/sensors/ky-018-light.jpg',
    recommendedVideo: '/media/sensors/ky-018-demo.mp4',
    simulation: {
      type: 'slider',
      label: 'Light Level',
      unit: '%',
      min: 0,
      max: 100,
      initialValue: 72,
    },
  },
  {
    id: 'dupont-cables',
    name: 'DuPont Breadboard Prototyping Jumpers',
    model: '40-Pin Rainbow Ribbon Cable (Male-to-Female)',
    category: 'electrical',
    categoryLabel: 'Hardware & Interconnects',
    voltage: 'Signal / Power (< 2A)',
    interfaceType: '2.54mm Standard Header Pitch',
    summary: 'Multi-conductor flexible ribbon cables enabling rapid, solderless breadboard and GPIO pin headers interconnects.',
    workingPrinciple:
      'High-grade copper strand conductors insulated in color-coded PVC with precision phosphor-bronze crimp connectors for vibration-resistant 2.54mm header engagement.',
    pins: [
      { name: 'Pin 1-40', type: 'Signal', description: 'Standard 2.54mm pitch DuPont male to female jumpers' },
    ],
    applications: [
      'Sensor breakout to Arduino UNO / Mega / ESP32 breadboarding',
      'Raspberry Pi GPIO header bus routing',
      'Modular logic analyzer test clip leads',
      'Telemetry wire harness prototyping',
    ],
    codeSnippet: `// DuPont wiring verification diagnostic test
void setup() {
  // Test continuity across connected GPIO lines
  pinMode(2, OUTPUT);
  pinMode(3, INPUT_PULLUP);
  digitalWrite(2, LOW);
}

void loop() {
  if (digitalRead(3) == LOW) {
    Serial.println("DuPont Jumper Continuity Verified: 100% OK");
  }
  delay(1000);
}`,
    recommendedPhoto: '/media/sensors/dupont-cables.jpg',
    recommendedVideo: '/media/sensors/dupont-demo.mp4',
    simulation: {
      type: 'toggle',
      label: 'Wiring Continuity Check',
      initialValue: true,
    },
  },
];

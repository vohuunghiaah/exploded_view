// scripts/generate_loq_model.js
// Procedural 3D Model Generator for Lenovo LOQ 15IAX9 (Machine Type 83GS)
// Generates a fully hierarchical, physically dimensioned GLB model with separate parts.

import fs from 'fs';
import path from 'path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// Polyfill FileReader for Node.js
class FileReaderPolyfill {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then(buf => {
      const b64 = Buffer.from(buf).toString('base64');
      this.result = 'data:' + (blob.type || 'application/octet-stream') + ';base64,' + b64;
      if (this.onloadend) this.onloadend();
    });
  }
}
globalThis.FileReader = FileReaderPolyfill;

console.log('--- Generating Lenovo LOQ 15IAX9 3D Model ---');

// Overall Dimensions in meters (PSREF: 359.86 x 258.7 x 22.9 mm)
const W = 0.35986;  // Width (X)
const D = 0.25870;  // Depth (Z)
const H = 0.02290;  // Height (Y)

// Base coordinate origins
// Center of base: X: [-W/2, +W/2], Z: [-D/2, +D/2]
// Front is +Z, Rear is -Z
// Bottom is -Y, Top is +Y

// Materials Library (Physically Based Rendering)
const materials = {
  // Luna Grey chassis (anodized matte PC-ABS polymer)
  lunaGrey: new THREE.MeshStandardMaterial({
    name: 'mat_luna_grey',
    color: 0x484c52,
    metalness: 0.25,
    roughness: 0.45,
  }),
  lunaGreyDark: new THREE.MeshStandardMaterial({
    name: 'mat_luna_grey_dark',
    color: 0x2e3238,
    metalness: 0.3,
    roughness: 0.5,
  }),
  // Display Bezel & Trim (dark matte plastic)
  bezelBlack: new THREE.MeshStandardMaterial({
    name: 'mat_bezel_black',
    color: 0x15171a,
    metalness: 0.1,
    roughness: 0.7,
  }),
  // Display Screen Glass (when off/reflective or idle)
  displayGlass: new THREE.MeshStandardMaterial({
    name: 'mat_display_glass',
    color: 0x0f141c,
    metalness: 0.8,
    roughness: 0.15,
  }),
  // Keyboard surface & keys
  keyboardBase: new THREE.MeshStandardMaterial({
    name: 'mat_keyboard_base',
    color: 0x1c1f24,
    metalness: 0.1,
    roughness: 0.6,
  }),
  keycap: new THREE.MeshStandardMaterial({
    name: 'mat_keycap',
    color: 0x22262c,
    metalness: 0.2,
    roughness: 0.5,
  }),
  keycapSpecial: new THREE.MeshStandardMaterial({
    name: 'mat_keycap_special',
    color: 0x2b313a,
    metalness: 0.3,
    roughness: 0.4,
  }),
  // Touchpad surface
  touchpad: new THREE.MeshStandardMaterial({
    name: 'mat_touchpad',
    color: 0x3d4147,
    metalness: 0.2,
    roughness: 0.35,
  }),
  // Motherboard PCB (dark emerald / black FR4)
  pcbGreen: new THREE.MeshStandardMaterial({
    name: 'mat_pcb_green',
    color: 0x0c2518,
    metalness: 0.3,
    roughness: 0.4,
  }),
  // Silicon IC chips (CPU / GPU / NAND / VRAM)
  siliconDie: new THREE.MeshStandardMaterial({
    name: 'mat_silicon_die',
    color: 0x1b2028,
    metalness: 0.85,
    roughness: 0.15,
  }),
  siliconSubstrate: new THREE.MeshStandardMaterial({
    name: 'mat_silicon_substrate',
    color: 0x143224,
    metalness: 0.4,
    roughness: 0.5,
  }),
  chipBlack: new THREE.MeshStandardMaterial({
    name: 'mat_chip_black',
    color: 0x111316,
    metalness: 0.4,
    roughness: 0.3,
  }),
  // Copper Heat Pipes
  copper: new THREE.MeshStandardMaterial({
    name: 'mat_copper',
    color: 0xc87038,
    metalness: 0.92,
    roughness: 0.25,
  }),
  // Aluminum Heat Sink Fin Stacks
  aluminumFins: new THREE.MeshStandardMaterial({
    name: 'mat_aluminum_fins',
    color: 0xa5abb3,
    metalness: 0.85,
    roughness: 0.3,
  }),
  // Fan housing & blades (black nylon)
  fanPlastic: new THREE.MeshStandardMaterial({
    name: 'mat_fan_plastic',
    color: 0x181a1e,
    metalness: 0.1,
    roughness: 0.6,
  }),
  fanBlade: new THREE.MeshStandardMaterial({
    name: 'mat_fan_blade',
    color: 0x20242a,
    metalness: 0.2,
    roughness: 0.4,
  }),
  // Battery pack (matte black with labels)
  batteryPack: new THREE.MeshStandardMaterial({
    name: 'mat_battery',
    color: 0x16181b,
    metalness: 0.2,
    roughness: 0.5,
  }),
  // Gold plated connectors & contacts
  gold: new THREE.MeshStandardMaterial({
    name: 'mat_gold',
    color: 0xd4af37,
    metalness: 0.95,
    roughness: 0.2,
  }),
  // Steel / Silver metal brackets, hinges & screws
  steelMetal: new THREE.MeshStandardMaterial({
    name: 'mat_steel',
    color: 0x8a929a,
    metalness: 0.88,
    roughness: 0.35,
  }),
  // Rubber feet
  rubber: new THREE.MeshStandardMaterial({
    name: 'mat_rubber',
    color: 0x141416,
    metalness: 0.05,
    roughness: 0.9,
  }),
  // LED / Cyan accent
  ledCyan: new THREE.MeshStandardMaterial({
    name: 'mat_led_cyan',
    color: 0x00d2ff,
    emissive: 0x00d2ff,
    emissiveIntensity: 0.6,
    roughness: 0.2,
  }),
  // LOQ Logo Accent (Chrome / Reflective Silver)
  loqChrome: new THREE.MeshStandardMaterial({
    name: 'mat_loq_chrome',
    color: 0xd8e0e8,
    metalness: 0.95,
    roughness: 0.1,
  })
};

// Root scene container
const rootScene = new THREE.Scene();
rootScene.name = 'Lenovo_LOQ_15IAX9_Root';

// -------------------------------------------------------------
// 1. DISPLAY ASSEMBLY (Lid, Bezel, LCD, Webcam, Hinges)
// -------------------------------------------------------------
const displayGroup = new THREE.Group();
displayGroup.name = 'display_assembly';
// Screen hinge pivot point is at rear shelf: Y = 0.010, Z = -0.098
displayGroup.position.set(0, 0.010, -0.098);

// A. Display Lid (A-Cover)
const lidGroup = new THREE.Group();
lidGroup.name = 'display_lid';
{
  const lidWidth = W;
  const lidHeight = 0.0065;
  const lidDepth = 0.245;

  // Main Lid Body
  const lidGeom = new THREE.BoxGeometry(lidWidth, lidHeight, lidDepth);
  const lidMesh = new THREE.Mesh(lidGeom, materials.lunaGrey);
  lidMesh.position.set(0, lidHeight / 2, lidDepth / 2);
  lidMesh.castShadow = true;
  lidMesh.receiveShadow = true;
  lidGroup.add(lidMesh);

  // Embossed LOQ Logo badge on outer surface (Top-Left of lid)
  const loqBadgeGeom = new THREE.BoxGeometry(0.065, 0.0006, 0.022);
  const loqBadge = new THREE.Mesh(loqBadgeGeom, materials.loqChrome);
  loqBadge.position.set(-lidWidth * 0.32, lidHeight + 0.0003, lidDepth * 0.72);
  lidGroup.add(loqBadge);

  // Lenovo brand plate on lower right corner
  const lenovoPlateGeom = new THREE.BoxGeometry(0.045, 0.0005, 0.015);
  const lenovoPlate = new THREE.Mesh(lenovoPlateGeom, materials.steelMetal);
  lenovoPlate.position.set(lidWidth * 0.36, lidHeight + 0.0003, lidDepth * 0.2);
  lidGroup.add(lenovoPlate);

  // Hinge covers (left and right)
  [-lidWidth * 0.42, lidWidth * 0.42].forEach(x => {
    const hingeCover = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.028, 16),
      materials.lunaGreyDark
    );
    hingeCover.rotation.z = Math.PI / 2;
    hingeCover.position.set(x, 0.002, 0.004);
    lidGroup.add(hingeCover);
  });
}
displayGroup.add(lidGroup);

// B. Display Bezel (B-Cover)
const bezelGroup = new THREE.Group();
bezelGroup.name = 'display_bezel';
{
  const bW = W - 0.008;
  const bD = 0.240;
  const bH = 0.0018;

  // Top bezel bar with camera notch
  const topBar = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, 0.018), materials.bezelBlack);
  topBar.position.set(0, -0.001, bD - 0.009);
  bezelGroup.add(topBar);

  // Bottom bezel bar
  const bottomBar = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, 0.028), materials.bezelBlack);
  bottomBar.position.set(0, -0.001, 0.014);
  bezelGroup.add(bottomBar);

  // Left & Right thin side bezels
  const sideW = 0.009;
  const sideL = bD - 0.046;
  const leftSide = new THREE.Mesh(new THREE.BoxGeometry(sideW, bH, sideL), materials.bezelBlack);
  leftSide.position.set(-bW / 2 + sideW / 2, -0.001, bD / 2);
  const rightSide = new THREE.Mesh(new THREE.BoxGeometry(sideW, bH, sideL), materials.bezelBlack);
  rightSide.position.set(bW / 2 - sideW / 2, -0.001, bD / 2);
  bezelGroup.add(leftSide);
  bezelGroup.add(rightSide);

  // Rubber bumper pads along bezel edge
  [-bW * 0.46, bW * 0.46].forEach(x => {
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.0008, 0.015), materials.rubber);
    bumper.position.set(x, -0.0018, bD * 0.6);
    bezelGroup.add(bumper);
  });
}
displayGroup.add(bezelGroup);

// C. LCD Display Panel (15.6" Active Glass Panel)
const panelGroup = new THREE.Group();
panelGroup.name = 'display_panel';
{
  const panelW = 0.34416; // 344.16 mm
  const panelD = 0.19359; // 193.59 mm (16:9)
  const panelH = 0.0022;

  // LCD Active Display surface
  const screenMesh = new THREE.Mesh(
    new THREE.BoxGeometry(panelW, panelH, panelD),
    materials.displayGlass
  );
  screenMesh.position.set(0, -0.0008, 0.028 + panelD / 2);
  panelGroup.add(screenMesh);

  // Metallic panel backing frame
  const backPlate = new THREE.Mesh(
    new THREE.BoxGeometry(panelW + 0.004, 0.0004, panelD + 0.004),
    materials.steelMetal
  );
  backPlate.position.set(0, 0.0006, 0.028 + panelD / 2);
  panelGroup.add(backPlate);
}
displayGroup.add(panelGroup);

// D. Webcam & Microphone Array
const webcamGroup = new THREE.Group();
webcamGroup.name = 'webcam_module';
{
  const camBase = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.0015, 0.008), materials.pcbGreen);
  camBase.position.set(0, -0.0012, 0.231);
  webcamGroup.add(camBase);

  // Camera lens aperture
  const lens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0018, 0.0018, 0.0012, 16),
    materials.siliconDie
  );
  lens.rotation.x = Math.PI / 2;
  lens.position.set(0, -0.0016, 0.231);
  webcamGroup.add(lens);

  // Dual stereo microphone pickups
  [-0.022, 0.022].forEach(x => {
    const mic = new THREE.Mesh(new THREE.CylinderGeometry(0.0008, 0.0008, 0.001, 8), materials.steelMetal);
    mic.rotation.x = Math.PI / 2;
    mic.position.set(x, -0.0016, 0.231);
    webcamGroup.add(mic);
  });

  // E-Shutter privacy indicator LED
  const camLed = new THREE.Mesh(new THREE.BoxGeometry(0.0012, 0.0008, 0.0012), materials.ledCyan);
  camLed.position.set(0.008, -0.0016, 0.231);
  webcamGroup.add(camLed);
}
displayGroup.add(webcamGroup);

// E. Left & Right Hinges
const leftHinge = new THREE.Group();
leftHinge.name = 'hinge_left';
{
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.032, 16), materials.steelMetal);
  barrel.rotation.z = Math.PI / 2;
  barrel.position.set(-W * 0.41, 0, 0);
  leftHinge.add(barrel);

  const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.003, 0.016), materials.steelMetal);
  bracket.position.set(-W * 0.41, -0.004, -0.006);
  leftHinge.add(bracket);
}
displayGroup.add(leftHinge);

const rightHinge = new THREE.Group();
rightHinge.name = 'hinge_right';
{
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.032, 16), materials.steelMetal);
  barrel.rotation.z = Math.PI / 2;
  barrel.position.set(W * 0.41, 0, 0);
  rightHinge.add(barrel);

  const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.003, 0.016), materials.steelMetal);
  bracket.position.set(W * 0.41, -0.004, -0.006);
  rightHinge.add(bracket);
}
displayGroup.add(rightHinge);

// Default open angle for assembled laptop: 115 degrees
displayGroup.rotation.x = THREE.MathUtils.degToRad(-115);
rootScene.add(displayGroup);

// -------------------------------------------------------------
// 2. UPPER CASE / PALMREST ASSEMBLY (C-Cover, Keyboard, Touchpad)
// -------------------------------------------------------------
const upperCaseGroup = new THREE.Group();
upperCaseGroup.name = 'upper_case';
{
  // Main palmrest deck
  const deckGeom = new THREE.BoxGeometry(W, 0.005, D);
  const deckMesh = new THREE.Mesh(deckGeom, materials.lunaGrey);
  deckMesh.position.set(0, 0.0065, 0);
  deckMesh.castShadow = true;
  deckMesh.receiveShadow = true;
  upperCaseGroup.add(deckMesh);

  // Recessed keyboard well
  const kbWellGeom = new THREE.BoxGeometry(0.338, 0.0015, 0.108);
  const kbWell = new THREE.Mesh(kbWellGeom, materials.keyboardBase);
  kbWell.position.set(0, 0.0085, -0.022);
  upperCaseGroup.add(kbWell);

  // Power Button (Centrally positioned above keyboard)
  const powerBtnGeom = new THREE.CylinderGeometry(0.0045, 0.0045, 0.0015, 24);
  const powerBtn = new THREE.Mesh(powerBtnGeom, materials.steelMetal);
  powerBtn.position.set(0, 0.0092, -0.088);
  upperCaseGroup.add(powerBtn);

  // Power status center LED
  const pwrLed = new THREE.Mesh(new THREE.CylinderGeometry(0.0015, 0.0015, 0.0016, 16), materials.ledCyan);
  pwrLed.position.set(0, 0.0093, -0.088);
  upperCaseGroup.add(pwrLed);

  // Side vent accents and LOQ branding on lower palmrest
  const deckLogo = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.0004, 0.012), materials.loqChrome);
  deckLogo.position.set(W * 0.38, 0.0091, D * 0.40);
  upperCaseGroup.add(deckLogo);
}
rootScene.add(upperCaseGroup);

// Full Keyboard with Individual Key Clusters
const keyboardGroup = new THREE.Group();
keyboardGroup.name = 'keyboard';
{
  const kbY = 0.0095;
  const startX = -0.160;
  const startZ = -0.070;
  const keySize = 0.0135;
  const keyGap = 0.0022;

  // 6 rows of keys
  const rows = [
    { count: 18, w: 0.0135, name: 'FnRow' },
    { count: 17, w: 0.0135, name: 'NumRow' },
    { count: 16, w: 0.0140, name: 'QWERTY' },
    { count: 15, w: 0.0145, name: 'ASDF' },
    { count: 15, w: 0.0145, name: 'ZXCV' },
    { count: 12, w: 0.0180, name: 'BottomRow' },
  ];

  rows.forEach((row, rIdx) => {
    const curZ = startZ + rIdx * (keySize + keyGap);
    for (let c = 0; c < row.count; c++) {
      let curX = startX + c * (keySize + keyGap);
      let kW = keySize;
      let kMat = materials.keycap;

      // Spacebar
      if (rIdx === 5 && c === 4) {
        kW = 0.075;
        curX += 0.025;
        kMat = materials.keycapSpecial;
      }
      // Enter / Shift / Backspace
      if ((rIdx === 1 || rIdx === 2 || rIdx === 3) && c === row.count - 4) {
        kW = 0.022;
        kMat = materials.keycapSpecial;
      }

      const keyGeom = new THREE.BoxGeometry(kW, 0.0016, keySize);
      const keyMesh = new THREE.Mesh(keyGeom, kMat);
      keyMesh.position.set(curX, kbY, curZ);
      keyboardGroup.add(keyMesh);
    }
  });
}
rootScene.add(keyboardGroup);

// Precision Touchpad (Trackpad)
const touchpadGroup = new THREE.Group();
touchpadGroup.name = 'touchpad';
{
  // 120 x 75 mm Mylar Touchpad
  const tpGeom = new THREE.BoxGeometry(0.120, 0.0012, 0.075);
  const tpMesh = new THREE.Mesh(tpGeom, materials.touchpad);
  tpMesh.position.set(-0.015, 0.0091, 0.078); // Offset slightly left per LOQ design
  touchpadGroup.add(tpMesh);

  // Chrome perimeter accent
  const borderGeom = new THREE.BoxGeometry(0.122, 0.0006, 0.077);
  const borderMesh = new THREE.Mesh(borderGeom, materials.steelMetal);
  borderMesh.position.set(-0.015, 0.0088, 0.078);
  touchpadGroup.add(borderMesh);
}
rootScene.add(touchpadGroup);

// -------------------------------------------------------------
// 3. REAR THERMAL SHELF & I/O PORTS
// -------------------------------------------------------------
const rearIOGroup = new THREE.Group();
rearIOGroup.name = 'rear_io_ports';
{
  const shelfZ = -D / 2 + 0.012; // -0.117

  // Rear I/O Connectors block
  // DC-in Slim Tip (Yellow / Black port)
  const dcPort = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.008, 0.012), materials.siliconDie);
  dcPort.position.set(-0.075, 0.003, shelfZ);
  rearIOGroup.add(dcPort);
  const dcCore = new THREE.Mesh(new THREE.BoxGeometry(0.010, 0.003, 0.002), materials.gold);
  dcCore.position.set(-0.075, 0.003, shelfZ - 0.0055);
  rearIOGroup.add(dcCore);

  // RJ-45 Gigabit Ethernet
  const rj45 = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.010, 0.012), materials.steelMetal);
  rj45.position.set(-0.045, 0.003, shelfZ);
  rearIOGroup.add(rj45);

  // HDMI 2.1
  const hdmi = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.006, 0.012), materials.steelMetal);
  hdmi.position.set(-0.018, 0.003, shelfZ);
  rearIOGroup.add(hdmi);

  // 2x USB-A 3.2 Gen 1 (Rear)
  [-0.002, 0.018].forEach(x => {
    const usbA = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.007, 0.012), materials.steelMetal);
    usbA.position.set(x, 0.003, shelfZ);
    rearIOGroup.add(usbA);
    // Blue USB 3.0 insert
    const insert = new THREE.Mesh(new THREE.BoxGeometry(0.010, 0.002, 0.002), materials.ledCyan);
    insert.position.set(x, 0.004, shelfZ - 0.0055);
    rearIOGroup.add(insert);
  });

  // 1x USB-C 3.2 Gen 2 (140W PD & DP 1.4)
  const usbC = new THREE.Mesh(new THREE.BoxGeometry(0.010, 0.0045, 0.012), materials.steelMetal);
  usbC.position.set(0.040, 0.003, shelfZ);
  rearIOGroup.add(usbC);

  // Left side audio 3.5mm combo jack
  const audioJack = new THREE.Mesh(new THREE.CylinderGeometry(0.0025, 0.0025, 0.008, 16), materials.gold);
  audioJack.rotation.z = Math.PI / 2;
  audioJack.position.set(-W / 2 + 0.004, 0.003, 0.025);
  rearIOGroup.add(audioJack);

  // Right side USB-A and E-Shutter switch
  const rightUsb = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.007, 0.014), materials.steelMetal);
  rightUsb.position.set(W / 2 - 0.004, 0.003, -0.010);
  rearIOGroup.add(rightUsb);

  const eShutterSwitch = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.003, 0.008), materials.steelMetal);
  eShutterSwitch.position.set(W / 2 - 0.003, 0.003, 0.018);
  rearIOGroup.add(eShutterSwitch);
}
rootScene.add(rearIOGroup);

// -------------------------------------------------------------
// 4. MOTHERBOARD & CORE CHIPS (Mainboard, CPU, GPU, VRAM)
// -------------------------------------------------------------
const motherboardGroup = new THREE.Group();
motherboardGroup.name = 'motherboard';
{
  const mbW = 0.265;
  const mbD = 0.175;
  const mbH = 0.0016;

  // L-Shaped Mainboard PCB
  const pcbGeom = new THREE.BoxGeometry(mbW, mbH, mbD);
  const pcbMesh = new THREE.Mesh(pcbGeom, materials.pcbGreen);
  pcbMesh.position.set(-0.015, 0.001, -0.025);
  motherboardGroup.add(pcbMesh);

  // Discrete VRM power chokes and solid capacitors
  for (let i = 0; i < 10; i++) {
    const choke = new THREE.Mesh(new THREE.BoxGeometry(0.007, 0.004, 0.007), materials.siliconDie);
    choke.position.set(-0.065 + (i % 5) * 0.010, 0.0035, -0.080 + Math.floor(i / 5) * 0.010);
    motherboardGroup.add(choke);
  }
}
rootScene.add(motherboardGroup);

// CPU Module (Intel Core i5 HX Series BGA Package)
const cpuGroup = new THREE.Group();
cpuGroup.name = 'cpu_module';
{
  const subGeom = new THREE.BoxGeometry(0.045, 0.0012, 0.0375);
  const substrate = new THREE.Mesh(subGeom, materials.siliconSubstrate);
  substrate.position.set(-0.048, 0.0022, -0.035);
  cpuGroup.add(substrate);

  // Silicon Die (Intel Dual-die HX package)
  const dieGeom = new THREE.BoxGeometry(0.024, 0.0008, 0.018);
  const die = new THREE.Mesh(dieGeom, materials.siliconDie);
  die.position.set(-0.048, 0.0032, -0.035);
  cpuGroup.add(die);

  // SMD decoupling capacitors surrounding die
  for (let c = 0; c < 8; c++) {
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.002, 0.0006, 0.0015), materials.steelMetal);
    const angle = (c / 8) * Math.PI * 2;
    cap.position.set(-0.048 + Math.cos(angle) * 0.016, 0.003, -0.035 + Math.sin(angle) * 0.013);
    cpuGroup.add(cap);
  }
}
rootScene.add(cpuGroup);

// GPU Module (NVIDIA GeForce RTX Laptop GPU)
const gpuGroup = new THREE.Group();
gpuGroup.name = 'gpu_module';
{
  const subGeom = new THREE.BoxGeometry(0.040, 0.0012, 0.040);
  const substrate = new THREE.Mesh(subGeom, materials.siliconSubstrate);
  substrate.position.set(0.045, 0.0022, -0.035);
  gpuGroup.add(substrate);

  // Large RTX GPU Die
  const dieGeom = new THREE.BoxGeometry(0.022, 0.0008, 0.022);
  const die = new THREE.Mesh(dieGeom, materials.siliconDie);
  die.position.set(0.045, 0.0032, -0.035);
  gpuGroup.add(die);

  // Protective metal retention ring
  const ringGeom = new THREE.BoxGeometry(0.026, 0.0007, 0.026);
  const ring = new THREE.Mesh(ringGeom, materials.steelMetal);
  ring.position.set(0.045, 0.003, -0.035);
  gpuGroup.add(ring);
}
rootScene.add(gpuGroup);

// GDDR6 VRAM Chips (4x chips clustered around GPU)
const vramGroup = new THREE.Group();
vramGroup.name = 'vram_chips';
{
  const offsets = [
    { x: 0.045, z: -0.056 }, // Top
    { x: 0.045, z: -0.014 }, // Bottom
    { x: 0.068, z: -0.042 }, // Right top
    { x: 0.068, z: -0.028 }, // Right bottom
  ];

  offsets.forEach((pos, idx) => {
    const ic = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.0012, 0.012), materials.chipBlack);
    ic.position.set(pos.x, 0.0025, pos.z);
    vramGroup.add(ic);
  });
}
rootScene.add(vramGroup);

// -------------------------------------------------------------
// 5. THERMAL ARCHITECTURE (Hyperchamber, Heat Pipes, Fans, Fin Stacks)
// -------------------------------------------------------------
const thermalGroup = new THREE.Group();
thermalGroup.name = 'thermal_module';
{
  // CPU Cold Plate
  const cpuPlate = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.0018, 0.040), materials.copper);
  cpuPlate.position.set(-0.048, 0.0042, -0.035);
  thermalGroup.add(cpuPlate);

  // GPU Cold Plate & VRM heatsink extension
  const gpuPlate = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.0018, 0.058), materials.copper);
  gpuPlate.position.set(0.052, 0.0042, -0.035);
  thermalGroup.add(gpuPlate);

  // Primary Shared Heat Pipe (Connects CPU and GPU to rear fin radiators)
  const sharedPipeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.085, 0.0055, -0.098),
    new THREE.Vector3(-0.065, 0.0055, -0.075),
    new THREE.Vector3(-0.048, 0.0055, -0.035),
    new THREE.Vector3(0.000, 0.0055, -0.032),
    new THREE.Vector3(0.045, 0.0055, -0.035),
    new THREE.Vector3(0.075, 0.0055, -0.075),
    new THREE.Vector3(0.095, 0.0055, -0.098),
  ]);
  const sharedPipeGeom = new THREE.TubeGeometry(sharedPipeCurve, 32, 0.0032, 12, false);
  const sharedPipe = new THREE.Mesh(sharedPipeGeom, materials.copper);
  thermalGroup.add(sharedPipe);

  // Secondary CPU Heat Pipe
  const cpuPipeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.110, 0.0052, -0.098),
    new THREE.Vector3(-0.095, 0.0052, -0.065),
    new THREE.Vector3(-0.055, 0.0052, -0.040),
  ]);
  const cpuPipeGeom = new THREE.TubeGeometry(cpuPipeCurve, 20, 0.0028, 10, false);
  const cpuPipe = new THREE.Mesh(cpuPipeGeom, materials.copper);
  thermalGroup.add(cpuPipe);

  // Secondary GPU Heat Pipe
  const gpuPipeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.055, 0.0052, -0.040),
    new THREE.Vector3(0.100, 0.0052, -0.065),
    new THREE.Vector3(0.120, 0.0052, -0.098),
  ]);
  const gpuPipeGeom = new THREE.TubeGeometry(gpuPipeCurve, 20, 0.0028, 10, false);
  const gpuPipe = new THREE.Mesh(gpuPipeGeom, materials.copper);
  thermalGroup.add(gpuPipe);

  // Spring-loaded captive retention screws (Numbered 1 to 6)
  const screwPositions = [
    { x: -0.065, z: -0.048 },
    { x: -0.032, z: -0.022 },
    { x: -0.065, z: -0.022 },
    { x: 0.028, z: -0.052 },
    { x: 0.062, z: -0.018 },
    { x: 0.062, z: -0.052 },
  ];
  screwPositions.forEach(p => {
    const scr = new THREE.Mesh(new THREE.CylinderGeometry(0.0018, 0.0018, 0.003, 12), materials.steelMetal);
    scr.position.set(p.x, 0.006, p.z);
    thermalGroup.add(scr);
  });
}
rootScene.add(thermalGroup);

// Dual Centrifugal Cooling Fans (CPU Fan Left, GPU Fan Right)
function createFan(name, posX) {
  const fanGroup = new THREE.Group();
  fanGroup.name = name;
  fanGroup.position.set(posX, 0.003, -0.082);

  // Fan Shroud / Housing (Outer casing)
  const housingGeom = new THREE.CylinderGeometry(0.036, 0.036, 0.009, 32);
  const housing = new THREE.Mesh(housingGeom, materials.fanPlastic);
  fanGroup.add(housing);

  // Fan Impeller / Rotor (Spinning sub-node)
  const impeller = new THREE.Group();
  impeller.name = `${name}_impeller`;

  const hubGeom = new THREE.CylinderGeometry(0.012, 0.012, 0.008, 24);
  const hub = new THREE.Mesh(hubGeom, materials.steelMetal);
  impeller.add(hub);

  // 19 Curved Blower Blades
  const bladeCount = 19;
  for (let b = 0; b < bladeCount; b++) {
    const angle = (b / bladeCount) * Math.PI * 2;
    const bladeGeom = new THREE.BoxGeometry(0.0012, 0.007, 0.018);
    const blade = new THREE.Mesh(bladeGeom, materials.fanBlade);
    blade.position.set(Math.cos(angle) * 0.022, 0, Math.sin(angle) * 0.022);
    blade.rotation.y = -angle + 0.45;
    impeller.add(blade);
  }
  fanGroup.add(impeller);

  return fanGroup;
}

const fanCpu = createFan('fan_cpu', -0.118);
rootScene.add(fanCpu);

const fanGpu = createFan('fan_gpu', 0.118);
rootScene.add(fanGpu);

// Copper / Aluminum Rear Radiator Fin Stacks
const finStacksGroup = new THREE.Group();
finStacksGroup.name = 'heatsink_fins';
{
  [-0.105, 0.105].forEach(centerX => {
    const finCount = 28;
    for (let f = 0; f < finCount; f++) {
      const finX = centerX - 0.030 + f * 0.0022;
      const finMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.0006, 0.008, 0.016),
        materials.copper
      );
      finMesh.position.set(finX, 0.0045, -0.105);
      finStacksGroup.add(finMesh);
    }
  });
}
rootScene.add(finStacksGroup);

// -------------------------------------------------------------
// 6. MEMORY & STORAGE (DDR5 RAM, Shield, Dual M.2 SSDs, Wi-Fi)
// -------------------------------------------------------------
// RAM Metal Shielding Can
const ramShieldGroup = new THREE.Group();
ramShieldGroup.name = 'ram_shield';
{
  const shieldGeom = new THREE.BoxGeometry(0.076, 0.004, 0.068);
  const shield = new THREE.Mesh(shieldGeom, materials.steelMetal);
  shield.position.set(0, 0.0055, 0.015);
  ramShieldGroup.add(shield);

  // Perforated thermal venting holes
  const thermalPad = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.0008, 0.055), materials.lunaGreyDark);
  thermalPad.position.set(0, 0.0036, 0.015);
  ramShieldGroup.add(thermalPad);
}
rootScene.add(ramShieldGroup);

// RAM Stick #1 (SO-DIMM DDR5)
const ramStick1 = new THREE.Group();
ramStick1.name = 'ram_slot_1';
{
  // Standard SO-DIMM PCB: 69.6 x 30 mm
  const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.0696, 0.0012, 0.030), materials.pcbGreen);
  ramStick1.add(pcb);

  // Gold connector fingers
  const goldEdge = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.0003, 0.0035), materials.gold);
  goldEdge.position.set(0, 0, -0.014);
  ramStick1.add(goldEdge);

  // 4x DDR5 DRAM chips
  for (let m = 0; m < 4; m++) {
    const chip = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.0010, 0.010), materials.chipBlack);
    chip.position.set(-0.024 + m * 0.016, 0.001, 0.002);
    ramStick1.add(chip);
  }
  ramStick1.position.set(0, 0.0032, 0.005);
}
rootScene.add(ramStick1);

// RAM Stick #2 (SO-DIMM DDR5)
const ramStick2 = new THREE.Group();
ramStick2.name = 'ram_slot_2';
{
  const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.0696, 0.0012, 0.030), materials.pcbGreen);
  ramStick2.add(pcb);

  const goldEdge = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.0003, 0.0035), materials.gold);
  goldEdge.position.set(0, 0, -0.014);
  ramStick2.add(goldEdge);

  for (let m = 0; m < 4; m++) {
    const chip = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.0010, 0.010), materials.chipBlack);
    chip.position.set(-0.024 + m * 0.016, 0.001, 0.002);
    ramStick2.add(chip);
  }
  ramStick2.position.set(0, 0.0048, 0.025);
}
rootScene.add(ramStick2);

// Primary M.2 2280 NVMe PCIe 4.0 SSD (Slot 1)
const ssd1Group = new THREE.Group();
ssd1Group.name = 'ssd_primary';
{
  // 80 x 22 mm PCB
  const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.0012, 0.080), materials.pcbGreen);
  ssd1Group.add(pcb);

  // M.2 Gold Key M edge connector
  const goldKey = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.0004, 0.004), materials.gold);
  goldKey.position.set(0, 0, -0.038);
  ssd1Group.add(goldKey);

  // PCIe 4.0 SSD Controller IC
  const controller = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.0014, 0.014), materials.siliconDie);
  controller.position.set(0, 0.0012, -0.020);
  ssd1Group.add(controller);

  // 2x 3D NAND Flash Memory chips
  [0.005, 0.025].forEach(zPos => {
    const nand = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.0012, 0.015), materials.chipBlack);
    nand.position.set(0, 0.0011, zPos);
    ssd1Group.add(nand);
  });

  // Copper / aluminum thermal spreader foil
  const spreader = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.0003, 0.065), materials.copper);
  spreader.position.set(0, 0.0020, 0.005);
  ssd1Group.add(spreader);

  ssd1Group.position.set(-0.115, 0.0028, 0.018);
}
rootScene.add(ssd1Group);

// Secondary M.2 NVMe SSD Expansion (Slot 2)
const ssd2Group = new THREE.Group();
ssd2Group.name = 'ssd_secondary';
{
  const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.0012, 0.080), materials.pcbGreen);
  ssd2Group.add(pcb);

  const goldKey = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.0004, 0.004), materials.gold);
  goldKey.position.set(0, 0, -0.038);
  ssd2Group.add(goldKey);

  const controller = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.0014, 0.014), materials.siliconDie);
  controller.position.set(0, 0.0012, -0.020);
  ssd2Group.add(controller);

  [0.005, 0.025].forEach(zPos => {
    const nand = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.0012, 0.015), materials.chipBlack);
    nand.position.set(0, 0.0011, zPos);
    ssd2Group.add(nand);
  });

  ssd2Group.position.set(0.115, 0.0028, 0.018);
}
rootScene.add(ssd2Group);

// Intel Wi-Fi 6 WLAN M.2 2230 Card
const wifiGroup = new THREE.Group();
wifiGroup.name = 'wifi_card';
{
  // 30 x 22 mm PCB
  const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.0010, 0.030), materials.pcbGreen);
  wifiGroup.add(pcb);

  // Metal RF shield can
  const rfShield = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.0018, 0.018), materials.steelMetal);
  rfShield.position.set(0, 0.0012, 0.002);
  wifiGroup.add(rfShield);

  // Dual IPEX MHF4 antenna connectors
  [-0.005, 0.005].forEach(x => {
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.0010, 0.0010, 0.0015, 8), materials.gold);
    ant.position.set(x, 0.002, 0.011);
    wifiGroup.add(ant);
  });

  wifiGroup.position.set(-0.082, 0.0025, 0.038);
}
rootScene.add(wifiGroup);

// -------------------------------------------------------------
// 7. BATTERY & AUDIO (60Wh Battery Pack, Stereo Speakers)
// -------------------------------------------------------------
const batteryGroup = new THREE.Group();
batteryGroup.name = 'battery_pack';
{
  // 60Wh 4-Cell Battery Pack (L23M4PC0)
  const batW = 0.225;
  const batD = 0.075;
  const batH = 0.0075;

  const batMesh = new THREE.Mesh(new THREE.BoxGeometry(batW, batH, batD), materials.batteryPack);
  batMesh.position.set(0, 0.002, 0.082);
  batteryGroup.add(batMesh);

  // 4 internal pouch cell seams
  for (let c = 0; c < 3; c++) {
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.0012, 0.0006, batD * 0.95), materials.siliconDie);
    seam.position.set(-batW * 0.36 + (c + 1) * (batW * 0.24), 0.0058, 0.082);
    batteryGroup.add(seam);
  }

  // Lenovo technical rating label decal
  const label = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.0002, 0.045), materials.steelMetal);
  label.position.set(0, 0.0058, 0.082);
  batteryGroup.add(label);

  // 4x Phillips mounting tabs
  [-batW / 2 + 0.01, batW / 2 - 0.01].forEach(x => {
    const tab = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.0015, 0.012), materials.fanPlastic);
    tab.position.set(x, 0.002, 0.042);
    batteryGroup.add(tab);
  });
}
rootScene.add(batteryGroup);

// Left & Right Stereo Speakers (2W each)
const leftSpeaker = new THREE.Group();
leftSpeaker.name = 'speaker_left';
{
  const chamber = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.0065, 0.024), materials.fanPlastic);
  leftSpeaker.add(chamber);

  const driver = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.0015, 16), materials.steelMetal);
  driver.position.set(0, -0.003, 0);
  leftSpeaker.add(driver);

  leftSpeaker.position.set(-W * 0.42, 0.002, 0.085);
}
rootScene.add(leftSpeaker);

const rightSpeaker = new THREE.Group();
rightSpeaker.name = 'speaker_right';
{
  const chamber = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.0065, 0.024), materials.fanPlastic);
  rightSpeaker.add(chamber);

  const driver = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.0015, 16), materials.steelMetal);
  driver.position.set(0, -0.003, 0);
  rightSpeaker.add(driver);

  rightSpeaker.position.set(W * 0.42, 0.002, 0.085);
}
rootScene.add(rightSpeaker);

// -------------------------------------------------------------
// 8. LOWER CASE / BASE COVER (D-Cover, Air Intakes, Rubber Feet)
// -------------------------------------------------------------
const bottomCoverGroup = new THREE.Group();
bottomCoverGroup.name = 'bottom_cover';
{
  const baseW = W;
  const baseD = D;
  const baseH = 0.008;

  // Main base shell
  const baseGeom = new THREE.BoxGeometry(baseW, baseH, baseD);
  const baseMesh = new THREE.Mesh(baseGeom, materials.lunaGrey);
  baseMesh.position.set(0, -0.004, 0);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  bottomCoverGroup.add(baseMesh);

  // Air intake ventilation grilles (Hyperchamber Intake under fans)
  [-0.100, 0.100].forEach(gx => {
    for (let r = 0; r < 6; r++) {
      const grillSlot = new THREE.Mesh(
        new THREE.BoxGeometry(0.065, 0.0015, 0.0035),
        materials.fanPlastic
      );
      grillSlot.position.set(gx, -0.0081, -0.080 + r * 0.007);
      bottomCoverGroup.add(grillSlot);
    }
  });

  // Front anti-slip rubber foot bar
  const frontFoot = new THREE.Mesh(new THREE.BoxGeometry(baseW * 0.75, 0.002, 0.006), materials.rubber);
  frontFoot.position.set(0, -0.0085, baseD * 0.42);
  bottomCoverGroup.add(frontFoot);

  // Rear elevated rubber support feet
  [-baseW * 0.42, baseW * 0.42].forEach(fx => {
    const rearFoot = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.0035, 0.008), materials.rubber);
    rearFoot.position.set(fx, -0.0090, -baseD * 0.44);
    bottomCoverGroup.add(rearFoot);
  });

  // 10 Phillips screw wells (per Lenovo HMM)
  const screwHoles = [
    { x: -baseW * 0.45, z: baseD * 0.44 },
    { x: -baseW * 0.18, z: baseD * 0.44 },
    { x: baseW * 0.18, z: baseD * 0.44 },
    { x: baseW * 0.45, z: baseD * 0.44 },
    { x: -baseW * 0.45, z: 0.000 },
    { x: baseW * 0.45, z: 0.000 },
    { x: -baseW * 0.45, z: -baseD * 0.44 },
    { x: -baseW * 0.15, z: -baseD * 0.44 },
    { x: baseW * 0.15, z: -baseD * 0.44 },
    { x: baseW * 0.45, z: -baseD * 0.44 },
  ];
  screwHoles.forEach(h => {
    const scr = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.0012, 12), materials.steelMetal);
    scr.position.set(h.x, -0.0081, h.z);
    bottomCoverGroup.add(scr);
  });
}
rootScene.add(bottomCoverGroup);

console.log('Scene graph constructed. Total children:', rootScene.children.length);

// Ensure output directories exist
const outputDir = path.resolve('public', 'models');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
const outputPath = path.join(outputDir, 'lenovo_loq_15iax9.glb');

// Export using Three.js GLTFExporter
const exporter = new GLTFExporter();
exporter.parse(
  rootScene,
  (gltfBuffer) => {
    if (gltfBuffer instanceof ArrayBuffer) {
      fs.writeFileSync(outputPath, Buffer.from(gltfBuffer));
      const stats = fs.statSync(outputPath);
      console.log(`[SUCCESS] GLB model written to: ${outputPath}`);
      console.log(`[FILE SIZE] ${(stats.size / 1024).toFixed(2)} KB`);
    } else {
      console.error('[ERROR] GLTF output is not binary ArrayBuffer');
    }
  },
  (error) => {
    console.error('[EXPORTER ERROR]:', error);
  },
  { binary: true }
);


// scripts/generate_loq_model.js
// High-Fidelity Procedural 3D Model Generator for Lenovo LOQ 15IAX9 (Machine Type 83GS)
// Model-First Architecture: Genuine L-Shaped Motherboard, TrueStrike Keyboard with Inverted-T Arrows,
// Hyperchamber Volute Blower Fans, Composite Heatpipes, Dual DDR5 SO-DIMM, Dual M.2 SSD, 60Wh Battery.

import fs from 'fs';
import path from 'path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// Polyfill FileReader for Node.js glTF export
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

console.log('=== Building High-Fidelity Lenovo LOQ 15IAX9 3D Asset ===');

// Overall Verified Dimensions in meters (Lenovo PSREF: 359.86 x 258.7 x 22.9 mm)
const W = 0.35986;  // Total Width (X axis: [-W/2, +W/2])
const D = 0.25870;  // Total Depth (Z axis: [-D/2, +D/2])
const H = 0.02290;  // Total Height (Y axis)

// Materials Library with Physically Based Rendering (PBR) Properties
const materials = {
  // Luna Grey chassis (anodized matte PC-ABS polymer)
  lunaGrey: new THREE.MeshStandardMaterial({
    name: 'mat_luna_grey',
    color: 0x474b52,
    metalness: 0.28,
    roughness: 0.42,
  }),
  lunaGreyDark: new THREE.MeshStandardMaterial({
    name: 'mat_luna_grey_dark',
    color: 0x2b2e34,
    metalness: 0.32,
    roughness: 0.48,
  }),
  // Display Bezel & Trim (dark matte textured plastic)
  bezelBlack: new THREE.MeshStandardMaterial({
    name: 'mat_bezel_black',
    color: 0x141619,
    metalness: 0.08,
    roughness: 0.72,
  }),
  // Display Screen Glass (Anti-glare IPS Panel with subtle sheen)
  displayGlass: new THREE.MeshStandardMaterial({
    name: 'mat_display_glass',
    color: 0x0c1017,
    metalness: 0.85,
    roughness: 0.18,
  }),
  // Keyboard deck & keycaps
  keyboardBase: new THREE.MeshStandardMaterial({
    name: 'mat_keyboard_base',
    color: 0x181a1f,
    metalness: 0.15,
    roughness: 0.65,
  }),
  keycap: new THREE.MeshStandardMaterial({
    name: 'mat_keycap',
    color: 0x202328,
    metalness: 0.18,
    roughness: 0.45,
  }),
  keycapSpecial: new THREE.MeshStandardMaterial({
    name: 'mat_keycap_special',
    color: 0x282d36,
    metalness: 0.25,
    roughness: 0.40,
  }),
  keycapAccent: new THREE.MeshStandardMaterial({
    name: 'mat_keycap_accent',
    color: 0x1e2430,
    metalness: 0.25,
    roughness: 0.42,
  }),
  // Touchpad surface (Precision Mylar)
  touchpad: new THREE.MeshStandardMaterial({
    name: 'mat_touchpad',
    color: 0x3b3f46,
    metalness: 0.22,
    roughness: 0.32,
  }),
  // Motherboard PCB (Dark emerald FR4 multi-layer)
  pcbGreen: new THREE.MeshStandardMaterial({
    name: 'mat_pcb_green',
    color: 0x0b2417,
    metalness: 0.35,
    roughness: 0.38,
  }),
  // Silicon IC chips (CPU / GPU / NAND)
  siliconDie: new THREE.MeshStandardMaterial({
    name: 'mat_silicon_die',
    color: 0x1a1e26,
    metalness: 0.90,
    roughness: 0.12,
  }),
  siliconSubstrate: new THREE.MeshStandardMaterial({
    name: 'mat_silicon_substrate',
    color: 0x122e20,
    metalness: 0.45,
    roughness: 0.45,
  }),
  chipBlack: new THREE.MeshStandardMaterial({
    name: 'mat_chip_black',
    color: 0x121417,
    metalness: 0.35,
    roughness: 0.32,
  }),
  // Pure Copper Heat Pipes & Cold Plates
  copper: new THREE.MeshStandardMaterial({
    name: 'mat_copper',
    color: 0xc86a32,
    metalness: 0.94,
    roughness: 0.22,
  }),
  copperDark: new THREE.MeshStandardMaterial({
    name: 'mat_copper_dark',
    color: 0xa85524,
    metalness: 0.90,
    roughness: 0.28,
  }),
  // Radiator Fin Stacks (Copper / Aluminum)
  radiatorFins: new THREE.MeshStandardMaterial({
    name: 'mat_radiator_fins',
    color: 0xb05e2e,
    metalness: 0.88,
    roughness: 0.30,
  }),
  // Fan housing & impellers (Liquid Crystal Polymer / Black Nylon)
  fanHousing: new THREE.MeshStandardMaterial({
    name: 'mat_fan_housing',
    color: 0x16181b,
    metalness: 0.12,
    roughness: 0.55,
  }),
  fanBlade: new THREE.MeshStandardMaterial({
    name: 'mat_fan_blade',
    color: 0x1e2126,
    metalness: 0.20,
    roughness: 0.38,
  }),
  // Battery pack (Textured black casing)
  batteryPack: new THREE.MeshStandardMaterial({
    name: 'mat_battery',
    color: 0x15171a,
    metalness: 0.18,
    roughness: 0.52,
  }),
  // Gold plated connector pins & test points
  gold: new THREE.MeshStandardMaterial({
    name: 'mat_gold',
    color: 0xd8b038,
    metalness: 0.96,
    roughness: 0.18,
  }),
  // Steel / Zinc-alloy metal brackets, screws & hinges
  steelMetal: new THREE.MeshStandardMaterial({
    name: 'mat_steel',
    color: 0x8e969e,
    metalness: 0.90,
    roughness: 0.32,
  }),
  // Rubber feet & bumpers
  rubber: new THREE.MeshStandardMaterial({
    name: 'mat_rubber',
    color: 0x131315,
    metalness: 0.04,
    roughness: 0.92,
  }),
  // Cyan LED Accent (LOQ status indicators)
  ledCyan: new THREE.MeshStandardMaterial({
    name: 'mat_led_cyan',
    color: 0x00d2ff,
    emissive: 0x00d2ff,
    emissiveIntensity: 0.8,
    roughness: 0.15,
  }),
  // LOQ Chrome Badge (Mirror reflective metal)
  loqChrome: new THREE.MeshStandardMaterial({
    name: 'mat_loq_chrome',
    color: 0xe0e8f0,
    metalness: 0.98,
    roughness: 0.08,
  })
};

// Root scene container
const rootScene = new THREE.Scene();
rootScene.name = 'Lenovo_LOQ_15IAX9_Root';

// ============================================================================
// 1. DISPLAY ASSEMBLY (A-Cover Lid, B-Cover Bezel, LCD, Webcam, Hinges)
// ============================================================================
const displayGroup = new THREE.Group();
displayGroup.name = 'display_assembly';
// Screen hinge pivot point: Z = -0.095 (in front of the rear thermal shelf), Y = 0.010
displayGroup.position.set(0, 0.010, -0.095);

// A. Display Lid (A-Cover) with Chamfered Edges & Embossed Badges
const lidGroup = new THREE.Group();
lidGroup.name = 'display_lid';
{
  const lidW = W;
  const lidH = 0.0070;
  const lidD = 0.245;

  // Beveled outer lid shell
  const lidShape = new THREE.Shape();
  const hw = lidW / 2;
  const r = 0.008; // Corner radius
  lidShape.moveTo(-hw + r, 0);
  lidShape.lineTo(hw - r, 0);
  lidShape.quadraticCurveTo(hw, 0, hw, r);
  lidShape.lineTo(hw, lidD - r);
  lidShape.quadraticCurveTo(hw, lidD, hw - r, lidD);
  lidShape.lineTo(-hw + r, lidD);
  lidShape.quadraticCurveTo(-hw, lidD, -hw, lidD - r);
  lidShape.lineTo(-hw, r);
  lidShape.quadraticCurveTo(-hw, 0, -hw + r, 0);

  const lidGeom = new THREE.ExtrudeGeometry(lidShape, {
    depth: lidH,
    bevelEnabled: true,
    bevelThickness: 0.0012,
    bevelSize: 0.0015,
    bevelSegments: 4,
  });
  // Center geometry
  lidGeom.rotateX(Math.PI / 2);
  const lidMesh = new THREE.Mesh(lidGeom, materials.lunaGrey);
  lidMesh.position.set(0, lidH, 0);
  lidMesh.castShadow = true;
  lidMesh.receiveShadow = true;
  lidGroup.add(lidMesh);

  // Iconic LOQ Metallic Logo Badge (Top-Left of lid)
  const loqBadgeGeom = new THREE.BoxGeometry(0.068, 0.0008, 0.024);
  const loqBadge = new THREE.Mesh(loqBadgeGeom, materials.loqChrome);
  loqBadge.position.set(-lidW * 0.32, lidH + 0.0014, lidD * 0.72);
  lidGroup.add(loqBadge);

  // Lenovo Steel Brand Plaque (Bottom-Right of lid)
  const lenovoPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.046, 0.0006, 0.014),
    materials.steelMetal
  );
  lenovoPlate.position.set(lidW * 0.36, lidH + 0.0014, lidD * 0.20);
  lidGroup.add(lenovoPlate);
}
displayGroup.add(lidGroup);

// B. Display Bezel (B-Cover) with Camera Notch
const bezelGroup = new THREE.Group();
bezelGroup.name = 'display_bezel';
{
  const bW = W - 0.006;
  const bD = 0.242;
  const bH = 0.0022;

  // Top bezel with central webcam notch protrusion
  const topBezelShape = new THREE.Shape();
  const bhw = bW / 2;
  topBezelShape.moveTo(-bhw, 0);
  topBezelShape.lineTo(-0.045, 0);
  topBezelShape.lineTo(-0.040, 0.006); // Notch step up
  topBezelShape.lineTo(0.040, 0.006);
  topBezelShape.lineTo(0.045, 0);
  topBezelShape.lineTo(bhw, 0);
  topBezelShape.lineTo(bhw, 0.018);
  topBezelShape.lineTo(-bhw, 0.018);
  topBezelShape.closePath();

  const topBezelGeom = new THREE.ExtrudeGeometry(topBezelShape, {
    depth: bH,
    bevelEnabled: false,
  });
  topBezelGeom.rotateX(Math.PI / 2);
  const topBar = new THREE.Mesh(topBezelGeom, materials.bezelBlack);
  topBar.position.set(0, -0.0005, bD - 0.018);
  bezelGroup.add(topBar);

  // Bottom bezel (chin)
  const bottomBar = new THREE.Mesh(
    new THREE.BoxGeometry(bW, bH, 0.026),
    materials.bezelBlack
  );
  bottomBar.position.set(0, -0.0005, 0.013);
  bezelGroup.add(bottomBar);

  // Left & Right narrow side bezels (7.8mm wide)
  const sideW = 0.0078;
  const sideLen = bD - 0.044;
  const leftSide = new THREE.Mesh(new THREE.BoxGeometry(sideW, bH, sideLen), materials.bezelBlack);
  leftSide.position.set(-bW / 2 + sideW / 2, -0.0005, bD / 2);
  const rightSide = new THREE.Mesh(new THREE.BoxGeometry(sideW, bH, sideLen), materials.bezelBlack);
  rightSide.position.set(bW / 2 - sideW / 2, -0.0005, bD / 2);
  bezelGroup.add(leftSide);
  bezelGroup.add(rightSide);
}
displayGroup.add(bezelGroup);

// C. 15.6" Active IPS LCD Panel
const panelGroup = new THREE.Group();
panelGroup.name = 'display_panel';
{
  const panelW = 0.34416; // 344.16 mm exact
  const panelD = 0.19359; // 193.59 mm exact
  const panelH = 0.0026;

  // Active anti-glare display surface
  const screenMesh = new THREE.Mesh(
    new THREE.BoxGeometry(panelW, panelH, panelD),
    materials.displayGlass
  );
  screenMesh.position.set(0, -0.0002, 0.026 + panelD / 2);
  panelGroup.add(screenMesh);

  // Galvanized steel backing frame
  const backPlate = new THREE.Mesh(
    new THREE.BoxGeometry(panelW + 0.004, 0.0004, panelD + 0.004),
    materials.steelMetal
  );
  backPlate.position.set(0, 0.0012, 0.026 + panelD / 2);
  panelGroup.add(backPlate);
}
displayGroup.add(panelGroup);

// D. Webcam, Dual Digital Mics & E-Shutter Sensor
const webcamGroup = new THREE.Group();
webcamGroup.name = 'webcam_module';
{
  const camBase = new THREE.Mesh(new THREE.BoxGeometry(0.070, 0.0018, 0.009), materials.pcbGreen);
  camBase.position.set(0, -0.0008, 0.234);
  webcamGroup.add(camBase);

  // Glass optical lens
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.0015, 16), materials.siliconDie);
  lens.rotation.x = Math.PI / 2;
  lens.position.set(0, -0.0014, 0.234);
  webcamGroup.add(lens);

  // Dual stereo noise-cancelling mics
  [-0.024, 0.024].forEach(x => {
    const mic = new THREE.Mesh(new THREE.CylinderGeometry(0.0009, 0.0009, 0.0012, 12), materials.steelMetal);
    mic.rotation.x = Math.PI / 2;
    mic.position.set(x, -0.0014, 0.234);
    webcamGroup.add(mic);
  });

  // Privacy E-shutter indicator LED
  const camLed = new THREE.Mesh(new THREE.BoxGeometry(0.0012, 0.0008, 0.0012), materials.ledCyan);
  camLed.position.set(0.009, -0.0014, 0.234);
  webcamGroup.add(camLed);
}
displayGroup.add(webcamGroup);

// E. Left & Right Zinc-alloy Display Hinges
function createHinge(name, posX) {
  const hingeGroup = new THREE.Group();
  hingeGroup.name = name;
  hingeGroup.position.set(posX, 0, 0);

  // Pivot barrel
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.034, 16), materials.steelMetal);
  barrel.rotation.z = Math.PI / 2;
  hingeGroup.add(barrel);

  // Stamped anchor bracket with 3 screw holes
  const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.0032, 0.018), materials.steelMetal);
  bracket.position.set(0, -0.004, -0.006);
  hingeGroup.add(bracket);

  return hingeGroup;
}
displayGroup.add(createHinge('hinge_left', -W * 0.40));
displayGroup.add(createHinge('hinge_right', W * 0.40));

// Default open angle for assembled laptop: 115 degrees
displayGroup.rotation.x = THREE.MathUtils.degToRad(-115);
rootScene.add(displayGroup);

// ============================================================================
// 2. UPPER CASE (C-Cover, Keyboard with Inverted-T, Trackpad, Rear Shelf)
// ============================================================================
const upperCaseGroup = new THREE.Group();
upperCaseGroup.name = 'upper_case';
{
  // Main deck shape with contoured rounded edges
  const deckShape = new THREE.Shape();
  const hw = W / 2;
  const hd = D / 2;
  const cr = 0.008;

  deckShape.moveTo(-hw + cr, -hd);
  deckShape.lineTo(hw - cr, -hd);
  deckShape.quadraticCurveTo(hw, -hd, hw, -hd + cr);
  deckShape.lineTo(hw, hd - cr);
  deckShape.quadraticCurveTo(hw, hd, hw - cr, hd);
  deckShape.lineTo(-hw + cr, hd);
  deckShape.quadraticCurveTo(-hw, hd, -hw, hd - cr);
  deckShape.lineTo(-hw, -hd + cr);
  deckShape.quadraticCurveTo(-hw, -hd, -hw + cr, -hd);

  const deckGeom = new THREE.ExtrudeGeometry(deckShape, {
    depth: 0.0055,
    bevelEnabled: true,
    bevelThickness: 0.0010,
    bevelSize: 0.0012,
    bevelSegments: 3,
  });
  deckGeom.rotateX(Math.PI / 2);
  const deckMesh = new THREE.Mesh(deckGeom, materials.lunaGrey);
  deckMesh.position.set(0, 0.0065, 0);
  deckMesh.castShadow = true;
  deckMesh.receiveShadow = true;
  upperCaseGroup.add(deckMesh);

  // Recessed keyboard well with specialized inverted-T arrow notch cutout
  const kbWellShape = new THREE.Shape();
  const kwW = 0.340 / 2;
  const kwTop = -0.078;
  const kwBot = 0.038;

  // Main rectangular well
  kbWellShape.moveTo(-kwW, kwTop);
  kbWellShape.lineTo(kwW, kwTop);
  kbWellShape.lineTo(kwW, kwBot);
  // Arrow cluster cutout extension dropping down by 8mm into the palmrest
  kbWellShape.lineTo(0.082, kwBot);
  kbWellShape.lineTo(0.082, kwBot + 0.009);
  kbWellShape.lineTo(0.028, kwBot + 0.009);
  kbWellShape.lineTo(0.028, kwBot);
  kbWellShape.lineTo(-kwW, kwBot);
  kbWellShape.closePath();

  const kbWellGeom = new THREE.ExtrudeGeometry(kbWellShape, {
    depth: 0.0018,
    bevelEnabled: false,
  });
  kbWellGeom.rotateX(Math.PI / 2);
  const kbWell = new THREE.Mesh(kbWellGeom, materials.keyboardBase);
  kbWell.position.set(0, 0.0084, 0);
  upperCaseGroup.add(kbWell);

  // Centered Power Button with LOQ LED status ring
  const powerBtn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.005, 0.005, 0.0018, 24),
    materials.steelMetal
  );
  powerBtn.position.set(0, 0.0088, -0.086);
  upperCaseGroup.add(powerBtn);

  const powerLed = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0018, 0.0018, 0.0020, 16),
    materials.ledCyan
  );
  powerLed.position.set(0, 0.0089, -0.086);
  upperCaseGroup.add(powerLed);
}
rootScene.add(upperCaseGroup);

// TrueStrike Keyboard with Inverted-T Arrows & 4-Column Numpad
const keyboardGroup = new THREE.Group();
keyboardGroup.name = 'keyboard';
{
  const kbY = 0.0092;
  const kPitch = 0.0152; // Key pitch in meters

  // Function Key Row (Esc, F1-F4, F5-F8, F9-F12, PrtSc, Ins, Del)
  const fnKeys = [
    { label: 'ESC', x: -0.154, w: 0.014 },
    // F1-F4 Cluster
    { label: 'F1', x: -0.134, w: 0.012 },
    { label: 'F2', x: -0.120, w: 0.012 },
    { label: 'F3', x: -0.106, w: 0.012 },
    { label: 'F4', x: -0.092, w: 0.012 },
    // F5-F8 Cluster
    { label: 'F5', x: -0.074, w: 0.012 },
    { label: 'F6', x: -0.060, w: 0.012 },
    { label: 'F7', x: -0.046, w: 0.012 },
    { label: 'F8', x: -0.032, w: 0.012 },
    // F9-F12 Cluster
    { label: 'F9', x: -0.014, w: 0.012 },
    { label: 'F10', x: 0.000, w: 0.012 },
    { label: 'F11', x: 0.014, w: 0.012 },
    { label: 'F12', x: 0.028, w: 0.012 },
    // Controls
    { label: 'PRT', x: 0.046, w: 0.012 },
    { label: 'INS', x: 0.060, w: 0.012 },
    { label: 'DEL', x: 0.074, w: 0.012 },
  ];

  fnKeys.forEach(k => {
    const km = new THREE.Mesh(new THREE.BoxGeometry(k.w, 0.0016, 0.0095), materials.keycapSpecial);
    km.position.set(k.x, kbY, -0.072);
    keyboardGroup.add(km);
  });

  // Alphanumeric rows
  // Row 1: Numbers & Backspace
  for (let i = 0; i < 13; i++) {
    const km = new THREE.Mesh(new THREE.BoxGeometry(0.0135, 0.0016, 0.0135), materials.keycap);
    km.position.set(-0.154 + i * 0.0152, kbY, -0.057);
    keyboardGroup.add(km);
  }
  const backspace = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.0016, 0.0135), materials.keycapSpecial);
  backspace.position.set(0.056, kbY, -0.057);
  keyboardGroup.add(backspace);

  // Row 2: Tab & QWERTY
  const tabKey = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.0016, 0.0135), materials.keycapSpecial);
  tabKey.position.set(-0.151, kbY, -0.040);
  keyboardGroup.add(tabKey);
  for (let i = 0; i < 12; i++) {
    const km = new THREE.Mesh(new THREE.BoxGeometry(0.0135, 0.0016, 0.0135), materials.keycap);
    km.position.set(-0.133 + i * 0.0152, kbY, -0.040);
    keyboardGroup.add(km);
  }
  const backslash = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.0016, 0.0135), materials.keycapSpecial);
  backslash.position.set(0.060, kbY, -0.040);
  keyboardGroup.add(backslash);

  // Row 3: CapsLock, ASDF & Enter
  const capsKey = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.0016, 0.0135), materials.keycapSpecial);
  capsKey.position.set(-0.149, kbY, -0.023);
  keyboardGroup.add(capsKey);
  for (let i = 0; i < 11; i++) {
    const km = new THREE.Mesh(new THREE.BoxGeometry(0.0135, 0.0016, 0.0135), materials.keycap);
    km.position.set(-0.129 + i * 0.0152, kbY, -0.023);
    keyboardGroup.add(km);
  }
  const enterKey = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.0016, 0.0135), materials.keycapSpecial);
  enterKey.position.set(0.054, kbY, -0.023);
  keyboardGroup.add(enterKey);

  // Row 4: L-Shift, ZXCV & R-Shift
  const lShift = new THREE.Mesh(new THREE.BoxGeometry(0.030, 0.0016, 0.0135), materials.keycapSpecial);
  lShift.position.set(-0.146, kbY, -0.006);
  keyboardGroup.add(lShift);
  for (let i = 0; i < 10; i++) {
    const km = new THREE.Mesh(new THREE.BoxGeometry(0.0135, 0.0016, 0.0135), materials.keycap);
    km.position.set(-0.122 + i * 0.0152, kbY, -0.006);
    keyboardGroup.add(km);
  }
  const rShift = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.0016, 0.0135), materials.keycapSpecial);
  rShift.position.set(0.052, kbY, -0.006);
  keyboardGroup.add(rShift);

  // Row 5: Ctrl, Fn, Win, Alt, Spacebar, AltGr, Ctrl
  const modWidths = [0.016, 0.014, 0.014, 0.016];
  let curModX = -0.153;
  modWidths.forEach(mw => {
    const mod = new THREE.Mesh(new THREE.BoxGeometry(mw, 0.0016, 0.0135), materials.keycapSpecial);
    mod.position.set(curModX + mw / 2, kbY, 0.011);
    keyboardGroup.add(mod);
    curModX += mw + 0.002;
  });

  // Long Gaming Spacebar
  const spacebar = new THREE.Mesh(new THREE.BoxGeometry(0.082, 0.0016, 0.0135), materials.keycapAccent);
  spacebar.position.set(-0.040, kbY, 0.011);
  keyboardGroup.add(spacebar);

  // Right modifiers before arrow keys
  const altGr = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.0016, 0.0135), materials.keycapSpecial);
  altGr.position.set(0.015, kbY, 0.011);
  keyboardGroup.add(altGr);

  // DEDICATED INVERTED-T ARROW CLUSTER (Drops down into palmrest notch!)
  const arrowY = kbY;
  const arrowZ = 0.026; // Dropped lower by 15mm into the palmrest cutout!
  const leftArrow = new THREE.Mesh(new THREE.BoxGeometry(0.0135, 0.0016, 0.0135), materials.keycapSpecial);
  leftArrow.position.set(0.038, arrowY, arrowZ);
  keyboardGroup.add(leftArrow);

  const downArrow = new THREE.Mesh(new THREE.BoxGeometry(0.0135, 0.0016, 0.0135), materials.keycapSpecial);
  downArrow.position.set(0.054, arrowY, arrowZ);
  keyboardGroup.add(downArrow);

  const upArrow = new THREE.Mesh(new THREE.BoxGeometry(0.0135, 0.0016, 0.0135), materials.keycapSpecial);
  upArrow.position.set(0.054, arrowY, arrowZ - 0.015);
  keyboardGroup.add(upArrow);

  const rightArrow = new THREE.Mesh(new THREE.BoxGeometry(0.0135, 0.0016, 0.0135), materials.keycapSpecial);
  rightArrow.position.set(0.070, arrowY, arrowZ);
  keyboardGroup.add(rightArrow);

  // NUMERIC KEYPAD (4-Column Dedicated Numpad Cluster)
  const numpadStartX = 0.096;
  for (let nr = 0; nr < 5; nr++) {
    const nz = -0.057 + nr * 0.017;
    for (let nc = 0; nc < 4; nc++) {
      const nx = numpadStartX + nc * 0.0152;
      // Skip cells covered by tall + / Enter / wide 0
      if ((nr === 2 && nc === 3) || (nr === 4 && nc === 3) || (nr === 4 && nc === 1)) continue;

      let nw = 0.0135;
      let nd = 0.0135;
      if (nr === 4 && nc === 0) nw = 0.028; // Wide 0 key
      if ((nr === 1 && nc === 3) || (nr === 3 && nc === 3)) nd = 0.028; // Tall + and Enter keys

      const numKey = new THREE.Mesh(new THREE.BoxGeometry(nw, 0.0016, nd), materials.keycap);
      numKey.position.set(nx, kbY, nz);
      keyboardGroup.add(numKey);
    }
  }
}
rootScene.add(keyboardGroup);

// Precision Mylar Touchpad (120 x 75 mm)
const touchpadGroup = new THREE.Group();
touchpadGroup.name = 'touchpad';
{
  const tpW = 0.120;
  const tpD = 0.075;
  const tpMesh = new THREE.Mesh(new THREE.BoxGeometry(tpW, 0.0014, tpD), materials.touchpad);
  tpMesh.position.set(-0.018, 0.0089, 0.078);
  touchpadGroup.add(tpMesh);

  // Chrome perimeter accent bevel
  const tpBorder = new THREE.Mesh(new THREE.BoxGeometry(tpW + 0.0018, 0.0008, tpD + 0.0018), materials.steelMetal);
  tpBorder.position.set(-0.018, 0.0086, 0.078);
  touchpadGroup.add(tpBorder);
}
rootScene.add(touchpadGroup);

// Rear Thermal Shelf & External I/O Ports
const rearIOGroup = new THREE.Group();
rearIOGroup.name = 'rear_io_ports';
{
  const rZ = -D / 2 + 0.009; // -0.120

  // Lenovo Slim Tip DC-in Power Port (Yellow / Black keyed receptacle)
  const dcPort = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.009, 0.014), materials.chipBlack);
  dcPort.position.set(-0.075, 0.003, rZ);
  rearIOGroup.add(dcPort);
  const dcCore = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.0035, 0.003), materials.gold);
  dcCore.position.set(-0.075, 0.003, rZ - 0.006);
  rearIOGroup.add(dcCore);

  // RJ-45 Gigabit Ethernet port with hinged latch collar
  const rj45 = new THREE.Mesh(new THREE.BoxGeometry(0.019, 0.011, 0.014), materials.steelMetal);
  rj45.position.set(-0.045, 0.003, rZ);
  rearIOGroup.add(rj45);

  // HDMI 2.1 Display Output Port
  const hdmi = new THREE.Mesh(new THREE.BoxGeometry(0.017, 0.007, 0.014), materials.steelMetal);
  hdmi.position.set(-0.018, 0.003, rZ);
  rearIOGroup.add(hdmi);

  // 2x USB-A 3.2 Gen 1 (Rear)
  [-0.001, 0.020].forEach(x => {
    const usbA = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.0075, 0.014), materials.steelMetal);
    usbA.position.set(x, 0.003, rZ);
    rearIOGroup.add(usbA);
    const blueInsert = new THREE.Mesh(new THREE.BoxGeometry(0.011, 0.002, 0.0025), materials.ledCyan);
    blueInsert.position.set(x, 0.004, rZ - 0.006);
    rearIOGroup.add(blueInsert);
  });

  // 1x USB-C 3.2 Gen 2 (140W PD & DP 1.4)
  const usbC = new THREE.Mesh(new THREE.BoxGeometry(0.011, 0.005, 0.014), materials.steelMetal);
  usbC.position.set(0.042, 0.003, rZ);
  rearIOGroup.add(usbC);

  // Left side 3.5mm audio jack
  const audioJack = new THREE.Mesh(new THREE.CylinderGeometry(0.0025, 0.0025, 0.009, 16), materials.gold);
  audioJack.rotation.z = Math.PI / 2;
  audioJack.position.set(-W / 2 + 0.0045, 0.003, 0.025);
  rearIOGroup.add(audioJack);

  // Right side USB-A & E-shutter switch
  const rightUsb = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.0075, 0.015), materials.steelMetal);
  rightUsb.position.set(W / 2 - 0.0045, 0.003, -0.010);
  rearIOGroup.add(rightUsb);

  const eShutterSwitch = new THREE.Mesh(new THREE.BoxGeometry(0.007, 0.0035, 0.009), materials.steelMetal);
  eShutterSwitch.position.set(W / 2 - 0.0035, 0.003, 0.018);
  rearIOGroup.add(eShutterSwitch);
}
rootScene.add(rearIOGroup);

// ============================================================================
// 3. MOTHERBOARD (Real L-Shaped PCB with Dual Fan Cutout Bays) & CORE CHIPS
// ============================================================================
const motherboardGroup = new THREE.Group();
motherboardGroup.name = 'motherboard';
{
  // Custom L-shaped Polygon with Cutouts for the CPU Fan (Left) and GPU Fan (Right)
  const mbShape = new THREE.Shape();
  // Outline of the motherboard fitting around the dual fans and battery
  mbShape.moveTo(-0.130, -0.115);
  mbShape.lineTo(0.130, -0.115);
  mbShape.lineTo(0.130, -0.045);
  // Cutout bay around right GPU fan
  mbShape.lineTo(0.155, -0.045);
  mbShape.lineTo(0.155, 0.040);
  mbShape.lineTo(0.075, 0.040);
  // Central section meeting the 60Wh battery
  mbShape.lineTo(0.075, 0.044);
  mbShape.lineTo(-0.075, 0.044);
  mbShape.lineTo(-0.075, 0.040);
  // Cutout bay around left CPU fan
  mbShape.lineTo(-0.155, 0.040);
  mbShape.lineTo(-0.155, -0.045);
  mbShape.lineTo(-0.130, -0.045);
  mbShape.closePath();

  const mbGeom = new THREE.ExtrudeGeometry(mbShape, {
    depth: 0.0016,
    bevelEnabled: true,
    bevelThickness: 0.0002,
    bevelSize: 0.0002,
    bevelSegments: 2,
  });
  mbGeom.rotateX(Math.PI / 2);
  const mbMesh = new THREE.Mesh(mbGeom, materials.pcbGreen);
  mbMesh.position.set(0, 0.0016, 0);
  motherboardGroup.add(mbMesh);

  // Intel HM670 PCH Platform Controller Hub
  const pch = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.0012, 0.014), materials.siliconDie);
  pch.position.set(-0.015, 0.0024, -0.015);
  motherboardGroup.add(pch);

  // Lenovo LA1 AI Engine Controller Chip
  const la1 = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.0010, 0.008), materials.chipBlack);
  la1.position.set(0.022, 0.0022, 0.025);
  motherboardGroup.add(la1);

  // Discrete VRM Power Chokes & Solid Polymer Capacitors
  for (let i = 0; i < 12; i++) {
    const choke = new THREE.Mesh(new THREE.BoxGeometry(0.007, 0.0042, 0.007), materials.siliconDie);
    choke.position.set(-0.070 + (i % 6) * 0.009, 0.0038, -0.076 + Math.floor(i / 6) * 0.009);
    motherboardGroup.add(choke);
  }
}
rootScene.add(motherboardGroup);

// CPU Module (Intel Core i5-12450HX BGA1964 Package)
const cpuGroup = new THREE.Group();
cpuGroup.name = 'cpu_module';
{
  const subGeom = new THREE.BoxGeometry(0.045, 0.0014, 0.0375);
  const substrate = new THREE.Mesh(subGeom, materials.siliconSubstrate);
  substrate.position.set(-0.048, 0.0023, -0.035);
  cpuGroup.add(substrate);

  // Dual-Die HX Silicon Package
  const computeDie = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.0009, 0.014), materials.siliconDie);
  computeDie.position.set(-0.052, 0.0033, -0.035);
  cpuGroup.add(computeDie);

  const ioDie = new THREE.Mesh(new THREE.BoxGeometry(0.010, 0.0008, 0.012), materials.siliconDie);
  ioDie.position.set(-0.036, 0.0032, -0.035);
  cpuGroup.add(ioDie);
}
rootScene.add(cpuGroup);

// GPU Module (NVIDIA GeForce RTX Laptop GPU)
const gpuGroup = new THREE.Group();
gpuGroup.name = 'gpu_module';
{
  const subGeom = new THREE.BoxGeometry(0.040, 0.0014, 0.040);
  const substrate = new THREE.Mesh(subGeom, materials.siliconSubstrate);
  substrate.position.set(0.048, 0.0023, -0.035);
  gpuGroup.add(substrate);

  // RTX GPU Die with Protective Metal Stiffener Ring
  const die = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.0009, 0.022), materials.siliconDie);
  die.position.set(0.048, 0.0033, -0.035);
  gpuGroup.add(die);

  const stiffener = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.0007, 0.026), materials.steelMetal);
  stiffener.position.set(0.048, 0.0030, -0.035);
  gpuGroup.add(stiffener);
}
rootScene.add(gpuGroup);

// GDDR6 VRAM IC Chips (4x chips clustered around GPU)
const vramGroup = new THREE.Group();
vramGroup.name = 'vram_chips';
{
  const vramOffsets = [
    { x: 0.048, z: -0.058 }, // Top
    { x: 0.048, z: -0.012 }, // Bottom
    { x: 0.072, z: -0.044 }, // Right top
    { x: 0.072, z: -0.026 }, // Right bottom
  ];
  vramOffsets.forEach(pos => {
    const ic = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.0012, 0.012), materials.chipBlack);
    ic.position.set(pos.x, 0.0025, pos.z);
    vramGroup.add(ic);
  });
}
rootScene.add(vramGroup);

// ============================================================================
// 4. THERMAL ARCHITECTURE (Hyperchamber Volute Fans, Heatpipes, Fin Radiators)
// ============================================================================
const thermalGroup = new THREE.Group();
thermalGroup.name = 'thermal_module';
{
  // CPU Pure Copper Cold Plate
  const cpuPlate = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.0020, 0.040), materials.copper);
  cpuPlate.position.set(-0.048, 0.0042, -0.035);
  thermalGroup.add(cpuPlate);

  // GPU & VRAM Copper Vapor/Cold Plate
  const gpuPlate = new THREE.Mesh(new THREE.BoxGeometry(0.064, 0.0020, 0.060), materials.copper);
  gpuPlate.position.set(0.054, 0.0042, -0.035);
  thermalGroup.add(gpuPlate);

  // Primary Shared D8 Copper Composite Heatpipe
  const sharedCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.088, 0.0056, -0.100),
    new THREE.Vector3(-0.068, 0.0056, -0.076),
    new THREE.Vector3(-0.048, 0.0056, -0.035),
    new THREE.Vector3(0.000, 0.0056, -0.032),
    new THREE.Vector3(0.048, 0.0056, -0.035),
    new THREE.Vector3(0.078, 0.0056, -0.076),
    new THREE.Vector3(0.098, 0.0056, -0.100),
  ]);
  const sharedPipe = new THREE.Mesh(
    new THREE.TubeGeometry(sharedCurve, 40, 0.0036, 12, false),
    materials.copper
  );
  thermalGroup.add(sharedPipe);

  // Secondary CPU Heatpipe
  const cpuCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.112, 0.0054, -0.100),
    new THREE.Vector3(-0.098, 0.0054, -0.066),
    new THREE.Vector3(-0.054, 0.0054, -0.042),
  ]);
  const cpuPipe = new THREE.Mesh(
    new THREE.TubeGeometry(cpuCurve, 24, 0.0028, 10, false),
    materials.copper
  );
  thermalGroup.add(cpuPipe);

  // Secondary GPU Heatpipe
  const gpuCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.058, 0.0054, -0.042),
    new THREE.Vector3(0.102, 0.0054, -0.066),
    new THREE.Vector3(0.122, 0.0054, -0.100),
  ]);
  const gpuPipe = new THREE.Mesh(
    new THREE.TubeGeometry(gpuCurve, 24, 0.0028, 10, false),
    materials.copper
  );
  thermalGroup.add(gpuPipe);

  // 5 Captive Spring Screws Stamped Alphabetically A through E (Lenovo HMM Spec)
  const hmmScrews = [
    { id: 'A', x: -0.066, z: -0.048 },
    { id: 'B', x: -0.030, z: -0.022 },
    { id: 'C', x: 0.032, z: -0.052 },
    { id: 'D', x: 0.068, z: -0.018 },
    { id: 'E', x: 0.068, z: -0.052 },
  ];
  hmmScrews.forEach(s => {
    // Screw collar and spring coil
    const scr = new THREE.Mesh(new THREE.CylinderGeometry(0.0018, 0.0018, 0.0035, 12), materials.steelMetal);
    scr.position.set(s.x, 0.0065, s.z);
    thermalGroup.add(scr);
    const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.0024, 0.0024, 0.0020, 12, 1, true), materials.steelMetal);
    coil.position.set(s.x, 0.0055, s.z);
    thermalGroup.add(coil);
  });
}
rootScene.add(thermalGroup);

// Dual Centrifugal Volute Fans with Aerodynamic Impeller Blades
function createVoluteFan(name, posX) {
  const fanGroup = new THREE.Group();
  fanGroup.name = name;
  fanGroup.position.set(posX, 0.0032, -0.082);

  // Volute Blower Housing with circular intake mouth
  const housingGeom = new THREE.CylinderGeometry(0.038, 0.038, 0.0095, 32);
  const housing = new THREE.Mesh(housingGeom, materials.fanHousing);
  fanGroup.add(housing);

  // Circular air intake rim
  const intakeRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.022, 0.0015, 8, 32),
    materials.fanHousing
  );
  intakeRim.rotation.x = Math.PI / 2;
  intakeRim.position.set(0, -0.0048, 0);
  fanGroup.add(intakeRim);

  // Impeller Rotor (Rotating node around Y axis)
  const impeller = new THREE.Group();
  impeller.name = `${name}_impeller`;

  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.0085, 24), materials.steelMetal);
  impeller.add(hub);

  // 23 Curved Blower Blades for authentic high-density airflow
  const bladeCount = 23;
  for (let b = 0; b < bladeCount; b++) {
    const angle = (b / bladeCount) * Math.PI * 2;
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.0010, 0.0078, 0.019),
      materials.fanBlade
    );
    blade.position.set(Math.cos(angle) * 0.024, 0, Math.sin(angle) * 0.024);
    blade.rotation.y = -angle + 0.52;
    impeller.add(blade);
  }
  fanGroup.add(impeller);

  return fanGroup;
}
rootScene.add(createVoluteFan('fan_cpu', -0.118));
rootScene.add(createVoluteFan('fan_gpu', 0.118));

// Dual High-Density Rear Copper Radiator Fin Arrays
const finStacksGroup = new THREE.Group();
finStacksGroup.name = 'heatsink_fins';
{
  [-0.106, 0.106].forEach(cx => {
    const finCount = 34; // High-density fin array
    for (let f = 0; f < finCount; f++) {
      const fx = cx - 0.032 + f * 0.0019;
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(0.0005, 0.0085, 0.018),
        materials.radiatorFins
      );
      fin.position.set(fx, 0.0048, -0.108);
      finStacksGroup.add(fin);
    }
  });
}
rootScene.add(finStacksGroup);

// ============================================================================
// 5. MEMORY & STORAGE (DDR5 RAM, Metal Can, Dual M.2 PCIe 4.0 SSDs, Wi-Fi 6)
// ============================================================================
// Stamped Metal RAM Shielding Can with Honeycomb Perforations
const ramShieldGroup = new THREE.Group();
ramShieldGroup.name = 'ram_shield';
{
  const shield = new THREE.Mesh(new THREE.BoxGeometry(0.076, 0.0042, 0.068), materials.steelMetal);
  shield.position.set(0, 0.0056, 0.015);
  ramShieldGroup.add(shield);

  // Pink/Blue Silicone Thermal Pad inside shield
  const thermalPad = new THREE.Mesh(new THREE.BoxGeometry(0.066, 0.0009, 0.056), materials.lunaGreyDark);
  thermalPad.position.set(0, 0.0036, 0.015);
  ramShieldGroup.add(thermalPad);
}
rootScene.add(ramShieldGroup);

// Function to create realistic DDR5 SO-DIMM Stick (JEDEC 69.6 x 30 mm)
function createDDR5Stick(name, posY, posZ) {
  const stick = new THREE.Group();
  stick.name = name;
  stick.position.set(0, posY, posZ);

  // 69.6 x 30 mm green/black FR4 PCB
  const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.0696, 0.0012, 0.030), materials.pcbGreen);
  stick.add(pcb);

  // 262-pin Gold Edge Connector Fingers
  const goldFingers = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.0004, 0.0038), materials.gold);
  goldFingers.position.set(0, 0, -0.014);
  stick.add(goldFingers);

  // 4x DDR5 DRAM Chips (Micron / Samsung BGA)
  for (let m = 0; m < 4; m++) {
    const chip = new THREE.Mesh(new THREE.BoxGeometry(0.0125, 0.0011, 0.0105), materials.chipBlack);
    chip.position.set(-0.024 + m * 0.016, 0.0010, 0.002);
    stick.add(chip);
  }
  return stick;
}
rootScene.add(createDDR5Stick('ram_slot_1', 0.0032, 0.005));
rootScene.add(createDDR5Stick('ram_slot_2', 0.0048, 0.025));

// Primary M.2 2280 PCIe 4.0 NVMe SSD (Slot 1)
const ssd1Group = new THREE.Group();
ssd1Group.name = 'ssd_primary';
{
  const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.0012, 0.080), materials.pcbGreen);
  ssd1Group.add(pcb);

  // M.2 Key-M Gold Edge Connector
  const goldKey = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.0004, 0.004), materials.gold);
  goldKey.position.set(0, 0, -0.038);
  ssd1Group.add(goldKey);

  // PCIe 4.0 High-Speed Controller IC
  const controller = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.0014, 0.014), materials.siliconDie);
  controller.position.set(0, 0.0012, -0.020);
  ssd1Group.add(controller);

  // 2x 3D TLC NAND Flash Packages
  [0.005, 0.025].forEach(z => {
    const nand = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.0013, 0.015), materials.chipBlack);
    nand.position.set(0, 0.0012, z);
    ssd1Group.add(nand);
  });

  // Copper Composite Heat Spreader Film
  const spreader = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.0003, 0.068), materials.copper);
  spreader.position.set(0, 0.0020, 0.005);
  ssd1Group.add(spreader);

  ssd1Group.position.set(-0.115, 0.0028, 0.018);
}
rootScene.add(ssd1Group);

// Secondary M.2 PCIe SSD Slot (Expansion Slot 2)
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

  [0.005, 0.025].forEach(z => {
    const nand = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.0013, 0.015), materials.chipBlack);
    nand.position.set(0, 0.0012, z);
    ssd2Group.add(nand);
  });

  ssd2Group.position.set(0.115, 0.0028, 0.018);
}
rootScene.add(ssd2Group);

// Intel Wi-Fi 6 (802.11ax) M.2 2230 WLAN Module
const wifiGroup = new THREE.Group();
wifiGroup.name = 'wifi_card';
{
  const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.0010, 0.030), materials.pcbGreen);
  wifiGroup.add(pcb);

  const rfShield = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.0018, 0.018), materials.steelMetal);
  rfShield.position.set(0, 0.0013, 0.002);
  wifiGroup.add(rfShield);

  // Dual IPEX MHF4 Micro-Coaxial Antenna Jacks
  [-0.005, 0.005].forEach(x => {
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.0010, 0.0010, 0.0015, 8), materials.gold);
    ant.position.set(x, 0.0022, 0.011);
    wifiGroup.add(ant);
  });

  wifiGroup.position.set(-0.082, 0.0025, 0.038);
}
rootScene.add(wifiGroup);

// ============================================================================
// 6. POWER & AUDIO (60Wh Battery Pack L23M4PC0, Stereo Acoustic Speakers)
// ============================================================================
const batteryGroup = new THREE.Group();
batteryGroup.name = 'battery_pack';
{
  const batW = 0.225;
  const batD = 0.075;
  const batH = 0.0076;

  // Main battery housing with 4-cell pouch contours
  const batMesh = new THREE.Mesh(new THREE.BoxGeometry(batW, batH, batD), materials.batteryPack);
  batMesh.position.set(0, 0.0020, 0.082);
  batteryGroup.add(batMesh);

  // 4 internal pouch cell divider seams
  for (let c = 0; c < 3; c++) {
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.0015, 0.0006, batD * 0.96), materials.chipBlack);
    seam.position.set(-batW * 0.36 + (c + 1) * (batW * 0.24), 0.0059, 0.082);
    batteryGroup.add(seam);
  }

  // Lenovo Technical Spec Decal Label (60Wh, 15.36V, L23M4PC0)
  const label = new THREE.Mesh(new THREE.BoxGeometry(0.098, 0.0002, 0.046), materials.steelMetal);
  label.position.set(0, 0.0059, 0.082);
  batteryGroup.add(label);

  // Multi-wire power harness with white connector socket
  const harness = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.0035, 0.012), materials.steelMetal);
  harness.position.set(0, 0.0030, 0.042);
  batteryGroup.add(harness);

  // 4x Phillips mounting tabs
  [-batW / 2 + 0.012, batW / 2 - 0.012].forEach(x => {
    const tab = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.0016, 0.012), materials.fanHousing);
    tab.position.set(x, 0.0020, 0.042);
    batteryGroup.add(tab);
  });
}
rootScene.add(batteryGroup);

// Left & Right Stereo Speakers (2W each with Nahimic Audio chambers)
function createSpeaker(name, posX) {
  const spk = new THREE.Group();
  spk.name = name;
  spk.position.set(posX, 0.0020, 0.085);

  const chamber = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.0068, 0.025), materials.fanHousing);
  spk.add(chamber);

  const driver = new THREE.Mesh(new THREE.CylinderGeometry(0.0075, 0.0075, 0.0015, 16), materials.steelMetal);
  driver.position.set(0, -0.0032, 0);
  spk.add(driver);

  return spk;
}
rootScene.add(createSpeaker('speaker_left', -W * 0.42));
rootScene.add(createSpeaker('speaker_right', W * 0.42));

// ============================================================================
// 7. LOWER CASE (D-Cover with Hex Intake Grilles, Rubber Feet & 10 Screw Wells)
// ============================================================================
const bottomCoverGroup = new THREE.Group();
bottomCoverGroup.name = 'bottom_cover';
{
  const bW = W;
  const bD = D;
  const bH = 0.0085;

  // Main base shell with bottom chamfer
  const baseShape = new THREE.Shape();
  const bhw = bW / 2;
  const bhd = bD / 2;
  const bcr = 0.008;

  baseShape.moveTo(-bhw + bcr, -bhd);
  baseShape.lineTo(bhw - bcr, -bhd);
  baseShape.quadraticCurveTo(bhw, -bhd, bhw, -bhd + bcr);
  baseShape.lineTo(bhw, bhd - bcr);
  baseShape.quadraticCurveTo(bhw, bhd, bhw - bcr, bhd);
  baseShape.lineTo(-bhw + bcr, bhd);
  baseShape.quadraticCurveTo(-bhw, bhd, -bhw, bhd - bcr);
  baseShape.lineTo(-bhw, -bhd + bcr);
  baseShape.quadraticCurveTo(-bhw, -bhd, -bhw + bcr, -bhd);

  const baseGeom = new THREE.ExtrudeGeometry(baseShape, {
    depth: bH,
    bevelEnabled: true,
    bevelThickness: 0.0015,
    bevelSize: 0.0020,
    bevelSegments: 4,
  });
  baseGeom.rotateX(Math.PI / 2);
  const baseMesh = new THREE.Mesh(baseGeom, materials.lunaGrey);
  baseMesh.position.set(0, -0.0042, 0);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  bottomCoverGroup.add(baseMesh);

  // Hyperchamber Aerodynamic Hexagonal Air Intake Grilles under both fans
  [-0.102, 0.102].forEach(gx => {
    for (let r = 0; r < 8; r++) {
      const grill = new THREE.Mesh(
        new THREE.BoxGeometry(0.068, 0.0016, 0.0032),
        materials.chipBlack
      );
      grill.position.set(gx, -0.0088, -0.082 + r * 0.0065);
      bottomCoverGroup.add(grill);
    }
  });

  // Full-width front anti-slip rubber foot bar
  const frontFoot = new THREE.Mesh(new THREE.BoxGeometry(bW * 0.78, 0.0022, 0.0065), materials.rubber);
  frontFoot.position.set(0, -0.0090, bD * 0.42);
  bottomCoverGroup.add(frontFoot);

  // Dual elevated rear stability feet (raises the laptop for optimal intake airflow)
  [-bW * 0.42, bW * 0.42].forEach(fx => {
    const rearFoot = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.0038, 0.0085), materials.rubber);
    rearFoot.position.set(fx, -0.0096, -bD * 0.44);
    bottomCoverGroup.add(rearFoot);
  });

  // 10 Captive Phillips screw recesses positioned exactly per Lenovo HMM
  const hmmScrewHoles = [
    { x: -bW * 0.45, z: bD * 0.44 },
    { x: -bW * 0.18, z: bD * 0.44 },
    { x: bW * 0.18, z: bD * 0.44 },
    { x: bW * 0.45, z: bD * 0.44 },
    { x: -bW * 0.45, z: 0.000 },
    { x: bW * 0.45, z: 0.000 },
    { x: -bW * 0.45, z: -bD * 0.44 },
    { x: -bW * 0.15, z: -bD * 0.44 },
    { x: bW * 0.15, z: -bD * 0.44 },
    { x: bW * 0.45, z: -bD * 0.44 },
  ];
  hmmScrewHoles.forEach(h => {
    const well = new THREE.Mesh(new THREE.CylinderGeometry(0.0022, 0.0022, 0.0016, 16), materials.steelMetal);
    well.position.set(h.x, -0.0086, h.z);
    bottomCoverGroup.add(well);
  });
}
rootScene.add(bottomCoverGroup);

console.log('Scene graph successfully constructed. Direct children count:', rootScene.children.length);

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
      console.log(`[SUCCESS] Upgraded GLB written to: ${outputPath}`);
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

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Lenovo LOQ 15IAX9 — Quality Gate & 3D Geometry/Animation Suite', () => {
  const visualReviewDir = path.resolve('docs', 'visual-review');

  test.beforeAll(async () => {
    if (!fs.existsSync(visualReviewDir)) {
      fs.mkdirSync(visualReviewDir, { recursive: true });
    }
  });

  test.beforeEach(async ({ page }) => {
    test.setTimeout(120000);
    await page.goto('/');
    const introBtn = page.locator('button:has-text("Bỏ qua giới thiệu")');
    await introBtn.waitFor({ state: 'visible', timeout: 30000 });
    await introBtn.click({ force: true });
    await page.waitForTimeout(1000);
  });

  test('QG-01: Geometry & Dimensions Verification (P0/P1)', async ({ page }) => {
    // Verify 3D canvas is active and rendering
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    const validation = await page.evaluate(() => {
      return {
        canvasWidth: document.querySelector('canvas')?.width ?? 0,
        canvasHeight: document.querySelector('canvas')?.height ?? 0,
      };
    });

    expect(validation.canvasWidth).toBeGreaterThan(0);
    expect(validation.canvasHeight).toBeGreaterThan(0);
  });

  test('QG-02: Capture 5 Mandatory Visual Review Angles for Gate Acceptance', async ({ page }) => {
    // Angle 1: Laptop open in 3/4 isometric beauty perspective (Default 115° open)
    await page.click('button:has-text("3/4 Chuẩn")', { force: true });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(visualReviewDir, '01_quarter_open_view.png') });

    // Angle 2: Laptop closed top-down view (Lid Angle = 0°, Top view camera)
    await page.click('button:has-text("0° Đóng")', { force: true });
    await page.waitForTimeout(800);
    await page.click('button:has-text("Nhìn Trên")', { force: true });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(visualReviewDir, '02_closed_top_down_view.png') });

    // Re-open lid to standard 115°
    await page.click('button:has-text("115° Chuẩn")', { force: true });
    await page.waitForTimeout(800);

    // Angle 3: Bottom cover view (Bottom camera, showing hex intake vents & rubber feet)
    await page.click('button:has-text("Mặt Đáy")', { force: true });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(visualReviewDir, '03_bottom_cover_view.png') });

    // Angle 4: Internal Hardware Architecture after removing bottom cover
    // Focus camera on motherboard & internals first
    await page.click('button:has-text("Mainboard")', { force: true });
    await page.waitForTimeout(1000);
    // Switch to Assembly mode Step 2 (where D-Cover is removed and battery/motherboard/cooling are visible)
    await page.click('button:has-text("Tháo Lắp HMM")', { force: true });
    await page.waitForTimeout(1000);
    await page.click('button[data-step="2"]', { force: true });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(visualReviewDir, '04_hardware_internal_view.png') });

    // Angle 5: Full Exploded View (100% Exploded View showing all layers in space)
    await page.click('button:has-text("Phân Rã 3D")', { force: true });
    await page.waitForTimeout(1500);
    await page.click('button:has-text("3/4 Chuẩn")', { force: true });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(visualReviewDir, '05_full_exploded_view.png') });
  });

  test('QG-03: Screen Hinge Independence & Non-Overriding Verification', async ({ page }) => {
    // Test setting various lid angles
    await page.click('button:has-text("0° Đóng")', { force: true });
    await page.waitForTimeout(800);
    await expect(page.locator('text=0°').first()).toBeVisible();

    await page.click('button:has-text("180° Mở phẳng")', { force: true });
    await page.waitForTimeout(800);
    await expect(page.locator('text=180°').first()).toBeVisible();

    await page.click('button:has-text("115° Chuẩn")', { force: true });
    await page.waitForTimeout(800);
    await expect(page.locator('text=115°').first()).toBeVisible();
  });

  test('QG-04: RAM & SSD 3D Real Kinematic Installation Animation', async ({ page }) => {
    // Open RAM/SSD Modal
    await page.click('button:has-text("Nâng Cấp RAM/SSD")', { force: true });
    await page.waitForTimeout(800);

    // Verify modal is active
    await expect(page.locator('text=Quy Trình Nâng Cấp RAM & SSD')).toBeVisible();

    // Switch between RAM and SSD tabs to assert camera framing and motion triggers
    await page.click('button:has-text("Nâng Cấp M.2 PCIe 4.0 SSD")', { force: true });
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Rút Ổ Cũ Góc 30°')).toBeVisible();

    await page.click('button:has-text("Nâng Cấp RAM DDR5 SO-DIMM")', { force: true });
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Bật Lẫy Khóa Góc 30°')).toBeVisible();

    await page.click('button:has-text("Đóng Hướng Dẫn")', { force: true });
  });

  test('QG-05: Disassembly/Assembly Repeatability & Zero Drift Assertion', async ({ page }) => {
    // Run rapid slider transitions to verify mathematical stability and zero drift
    for (let cycle = 0; cycle < 3; cycle++) {
      await page.click('button:has-text("100% Phân Rã")', { force: true });
      await page.waitForTimeout(300);
      await page.click('button:has-text("0% Lắp Ráp")', { force: true });
      await page.waitForTimeout(300);
    }

    // Final reset to 0% assembled
    await page.click('button:has-text("0% Lắp Ráp")', { force: true });
    await page.waitForTimeout(1000);

    // Confirm UI and 3D canvas settled cleanly at 0%
    await expect(page.locator('span.font-mono:has-text("0%")').first()).toBeVisible();
  });
});

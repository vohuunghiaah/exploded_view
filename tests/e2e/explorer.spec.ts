import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Lenovo LOQ 15IAX9 — Interactive 3D Exploded View Suite', () => {
  const screenshotsDir = path.resolve('tests', 'screenshots');

  test.beforeAll(async () => {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test('01. Load application & verify 3D Canvas, Title and Cinematic Intro', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify Title and Subtitle in header
    await expect(page.locator('header h1')).toContainText('LENOVO LOQ 15IAX9');
    await expect(page.locator('text=Type 83GS')).toBeVisible();

    // Verify 3D Canvas exists and renders
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Cinematic Intro title card visible
    await expect(page.locator('text=Cinematic Showcase')).toBeVisible();
    await page.screenshot({ path: path.join(screenshotsDir, '02_cinematic_intro.png') });

    // Skip Intro
    await page.click('text=Bỏ qua giới thiệu');
    await page.waitForTimeout(1000);

    // Capture Assembled View
    await page.screenshot({ path: path.join(screenshotsDir, '01_assembled_view.png') });

    // Check no fatal WebGL or script errors
    const fatalErrors = consoleErrors.filter((e) => !e.includes('favicon'));
    expect(fatalErrors.length).toBe(0);
  });

  test('02. Mode B: Exploded View slider 0% to 100% and back', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.click('text=Bỏ qua giới thiệu');

    // Click Exploded View Mode tab
    await page.click('button:has-text("Phân Rã 3D")');
    await page.waitForTimeout(1500);

    // Verify percentage indicator shows 100%
    await expect(page.locator('span.font-mono:has-text("100%")').first()).toBeVisible();
    await page.screenshot({ path: path.join(screenshotsDir, '03_exploded_view_100.png') });

    // Click 50% quick button
    await page.click('button:has-text("50% Trung Gian")');
    await page.waitForTimeout(1000);
    await expect(page.locator('span.font-mono:has-text("50%")').first()).toBeVisible();

    // Click 0% Assemble quick button
    await page.click('button:has-text("0% Lắp Ráp")');
    await page.waitForTimeout(1000);
    await expect(page.locator('span.font-mono:has-text("0%")').first()).toBeVisible();
  });

  test('03. Mode C: Component Inspector & Verified Hardware Specs', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.click('text=Bỏ qua giới thiệu');

    // Click Component Inspector tab
    await page.click('button:has-text("Soi Linh Kiện")');
    await page.waitForTimeout(1000);

    // Search and select Battery Pack
    await page.fill('input[placeholder="Tìm linh kiện..."]', 'pin');
    await page.click('button:has-text("Bộ pin Lithium-Polymer 60Wh")');
    await page.waitForTimeout(1500);

    // Verify Right Inspector Panel shows verified status & specs
    await expect(page.locator('text=ĐÃ XÁC MINH CHÍNH HÃNG')).toBeVisible();
    await expect(page.locator('h2:has-text("Bộ pin Lithium-Polymer 60Wh")')).toBeVisible();
    await expect(page.locator('text=L23M4PC0')).toBeVisible();

    // Capture Inspector screenshot
    await page.screenshot({ path: path.join(screenshotsDir, '04_component_inspector_motherboard.png') });

    // Test Isolation button
    await page.click('button:has-text("Cô Lập Linh Kiện")');
    await page.waitForTimeout(1000);
    await expect(page.locator('button:has-text("Bỏ Cô Lập")')).toBeVisible();
    await page.click('button:has-text("Bỏ Cô Lập")');
  });

  test('04. Mode E: X-Ray View Transition', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.click('text=Bỏ qua giới thiệu');

    // Click X-Ray tab
    await page.click('button:has-text("Tia X (X-Ray)")');
    await page.waitForTimeout(1500);

    // Capture X-Ray screenshot
    await page.screenshot({ path: path.join(screenshotsDir, '05_xray_mode.png') });
  });

  test('05. Cooling System Simulation & Fan Controls', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.click('text=Bỏ qua giới thiệu');

    // Switch to Extreme 4200 RPM preset
    await page.click('button:has-text("Cực Đại")');
    await expect(page.locator('text=4200 RPM')).toBeVisible();

    // Enable heat gradient
    await page.check('input[type="checkbox"]:near(:text("Gradient nhiệt"))');
    await page.waitForTimeout(1500);

    // Capture Cooling Simulation screenshot
    await page.screenshot({ path: path.join(screenshotsDir, '06_cooling_system_simulation.png') });
  });

  test('06. Mode D: Step-by-Step Assembly / Disassembly Animation (HMM)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.click('text=Bỏ qua giới thiệu');

    // Click Assembly mode tab
    await page.click('button:has-text("Tháo Lắp HMM")');
    await page.waitForTimeout(1000);

    // Verify Step 1 is active
    await expect(page.locator('text=Bước 1: Tháo nắp đáy máy (Mặt D)')).toBeVisible();
    await expect(page.locator('text=CRU')).toBeVisible();

    // Advance to Step 2 (Battery removal)
    await page.click('button[title="Bước tiếp theo"]');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Bước 2: Rút đầu cắm nguồn & Tháo bộ pin 60Wh')).toBeVisible();

    // Advance to Step 4 (RAM) using unique data-step attribute
    await page.click('button[data-step="4"]');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Bước 4: Tháo lồng chắn kim loại & 2 thanh RAM DDR5')).toBeVisible();

    // Capture Step-by-Step screenshot
    await page.screenshot({ path: path.join(screenshotsDir, '07_assembly_step_by_step.png') });
  });

  test('07. RAM & SSD Upgrade Guide Modal (ANIM-07)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.click('text=Bỏ qua giới thiệu');

    // Click Nâng Cấp RAM/SSD button
    await page.click('button:has-text("Nâng Cấp RAM/SSD")');
    await page.waitForTimeout(500);

    // Verify Modal content
    await expect(page.locator('text=Quy Trình Nâng Cấp RAM & SSD')).toBeVisible();
    await expect(page.locator('text=Bật Lẫy Khóa Góc 30°')).toBeVisible();

    // Switch to SSD tab
    await page.click('button:has-text("Nâng Cấp M.2 PCIe 4.0 SSD")');
    await expect(page.locator('text=Rút Ổ Cũ Góc 30°')).toBeVisible();

    // Capture RAM/SSD Guide screenshot
    await page.screenshot({ path: path.join(screenshotsDir, '08_ram_ssd_upgrade_guide.png') });

    // Close Modal
    await page.click('button:has-text("Đóng Hướng Dẫn")');
    await expect(page.locator('text=Quy Trình Nâng Cấp RAM & SSD')).not.toBeVisible();
  });

  test('08. Guided Technical Tour (ANIM-10)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.click('text=Bỏ qua giới thiệu');

    // Start Tour
    await page.click('button:has-text("Tour Kỹ Thuật")');
    await page.waitForTimeout(1000);

    // Verify Tour overlay appears with Scene 1
    await expect(page.locator('text=CHUYẾN THAM QUAN KỸ THUẬT')).toBeVisible();
    await expect(page.locator('text=1. Thiết Kế Gaming Luna Grey Đẳng Cấp')).toBeVisible();

    // Advance to Scene 2
    await page.click('button[title="Cảnh tiếp"]');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=2. Màn Hình 144Hz & Bàn Phím Gaming Full Numpad')).toBeVisible();

    // Capture Guided Tour screenshot
    await page.screenshot({ path: path.join(screenshotsDir, '09_guided_technical_tour.png') });

    // Exit Tour
    await page.click('text=Bỏ qua Tour');
    await expect(page.locator('text=CHUYẾN THAM QUAN KỸ THUẬT')).not.toBeVisible();
  });
});

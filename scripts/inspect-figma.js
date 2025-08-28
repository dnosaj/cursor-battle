const { chromium } = require('playwright');

async function inspectFigmaSite() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to Figma site...');
    await page.goto('https://cloud-raft-91473432.figma.site/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // Get viewport and content dimensions
    const dimensions = await page.evaluate(() => {
      return {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        documentHeight: document.documentElement.scrollHeight,
        documentWidth: document.documentElement.scrollWidth,
        bodyHeight: document.body.scrollHeight,
        bodyWidth: document.body.scrollWidth
      };
    });
    
    console.log('Page Dimensions:', dimensions);
    
    // Look for the Policy YAML Preview section
    const yamlSection = await page.locator('text=Policy YAML Preview').first();
    if (await yamlSection.isVisible()) {
      const yamlBox = await yamlSection.boundingBox();
      console.log('YAML Preview section location:', yamlBox);
      
      // Get the parent container dimensions
      const parentElement = await yamlSection.locator('..').first();
      const parentBox = await parentElement.boundingBox();
      console.log('YAML Preview parent container:', parentBox);
    }
    
    // Check for any elements that might need specific minimum heights
    const mainContent = await page.locator('main, [role="main"], .main-content').first();
    if (await mainContent.isVisible()) {
      const mainBox = await mainContent.boundingBox();
      console.log('Main content area:', mainBox);
    }
    
    // Take a screenshot for reference
    await page.screenshot({ 
      path: './public/figma-reference.png', 
      fullPage: true 
    });
    
    console.log('Screenshot saved to ./public/figma-reference.png');
    
  } catch (error) {
    console.error('Error inspecting Figma site:', error);
  } finally {
    await browser.close();
  }
}

inspectFigmaSite();

// TODO(app): Implement real logo scraping service
// This service will extract logos from websites using web scraping

export interface LogoService {
  extractLogo(url: string): Promise<string>;
  getDefaultLogos(): Record<string, string>;
}

// Mock implementation for prototype
export class MockLogoService implements LogoService {
  private defaultLogos = {
    'tempo': '/vibe-code-tests/images/tempo-logo.svg',
    'v0': '/vibe-code-tests/images/v0-logo.svg', 
    'figma': '/vibe-code-tests/images/figma-logo.svg',
    'default': '/vibe-code-tests/images/default-app-logo.svg'
  };

  async extractLogo(url: string): Promise<string> {
    // Simulate logo extraction delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check for known domains
    if (url.includes('tempo.build')) return this.defaultLogos.tempo;
    if (url.includes('vercel.app') || url.includes('v0.dev')) return this.defaultLogos.v0;
    if (url.includes('figma.site') || url.includes('figma.com')) return this.defaultLogos.figma;
    
    return this.defaultLogos.default;
  }

  getDefaultLogos(): Record<string, string> {
    return this.defaultLogos;
  }
}

// TODO(app): Real implementation would use cheerio to scrape favicon and logos
export class WebScrapingLogoService implements LogoService {
  async extractLogo(url: string): Promise<string> {
    try {
      // TODO(app): Implement with cheerio
      // const response = await axios.get(url);
      // const $ = cheerio.load(response.data);
      // Extract favicon or logo from meta tags, link tags, etc.
      
      return '/vibe-code-tests/images/default-app-logo.svg';
    } catch (error) {
      console.error('Failed to extract logo:', error);
      return '/vibe-code-tests/images/default-app-logo.svg';
    }
  }

  getDefaultLogos(): Record<string, string> {
    return {
      'tempo': '/vibe-code-tests/images/tempo-logo.svg',
      'v0': '/vibe-code-tests/images/v0-logo.svg',
      'figma': '/vibe-code-tests/images/figma-logo.svg',
      'default': '/vibe-code-tests/images/default-app-logo.svg'
    };
  }
}

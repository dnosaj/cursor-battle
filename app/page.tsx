'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import { useAppStore } from '@/lib/store';

import { EditUrlModal } from '@/components/edit-url-modal';
import { PromptModal } from '@/components/prompt-modal';
import { AppViewer } from '@/components/app-viewer';


export default function HomePage() {
  const { 
    apps, 
    selectedAppUrl, 
    setSelectedApp, 
    removeApp,
    updateApp 
  } = useAppStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);

  // Creation prompt for the AgTech Carbon Credit Tracker
  const creationPrompt = `Prompt for Cursor AI:
Build a modern React dashboard called "AgTech Carbon Credit Tracker" - a comprehensive agricultural sustainability platform for farmers to track, optimize, and monetize their carbon footprint. This should feel like a professional enterprise application that KPMG would showcase as an innovation prototype.

Core Requirements:
1. Dashboard Overview Page:
- Hero metrics cards showing: Total Carbon Credits Earned (YTD), Estimated Revenue, Carbon Footprint Reduction %, Active Sustainable Practices
- Real-time carbon credit price ticker from major marketplaces
- Interactive line chart showing monthly carbon credits vs revenue trends
- Farm profile section with editable details (farm name, acres, location, primary crops)
- Weather integration showing current conditions and climate impact alerts

2. Carbon Footprint Calculator:
- Interactive form to input different farming practices:
  * Tillage methods (no-till, reduced-till, conventional)
  * Cover crop usage and types
  * Fertilizer application methods and amounts
  * Crop rotation patterns
  * Livestock integration
- Real-time carbon impact calculations as users input data
- Before/after comparison showing potential carbon reduction
- Cost-benefit analysis for each practice change
- Recommendations engine suggesting optimal practices

3. Regenerative Agriculture Scoring:
- Visual scoring system (0-100) for different sustainability metrics:
  * Soil health improvement
  * Biodiversity enhancement
  * Water conservation
  * Carbon sequestration potential
- Interactive radar chart showing current vs. target scores
- Practice-specific improvement recommendations
- Certification pathway tracker for organic/regenerative standards

4. Carbon Credit Revenue Estimator:
- Live pricing from major carbon credit marketplaces (Verra, Gold Standard, etc.)
- Revenue projections based on current practices and planned improvements
- Interactive scenario modeling - adjust practices and see revenue impact
- Market trends analysis with price forecasting
- ROI calculator for sustainability investments
- Integration mockups with marketplace APIs

5. Supply Chain Sustainability Reports:
- Breakdown of emissions by source (transportation, processing, packaging)
- Supplier sustainability scorecards
- Transportation optimization recommendations
- End-to-end carbon footprint visualization
- Compliance tracking for sustainability certifications
- Automated report generation for stakeholders

Technical Specifications:
- Use React with modern hooks (useState, useEffect)
- Implement Recharts for all data visualizations
- Use Lucide React icons throughout
- Responsive design that works on desktop and tablet
- Use a professional color scheme (greens for sustainability, blues for data)
- Include loading states and smooth transitions
- Add interactive tooltips and hover effects
- Mock realistic agricultural data throughout

Visual Design:
- Clean, modern interface similar to enterprise dashboards
- Card-based layout with subtle shadows and gradients
- Green accent colors to emphasize sustainability theme
- Data-rich but not overwhelming
- Professional typography and spacing
- Interactive elements with clear visual feedback

Key Features to Include:
- Tabbed navigation between different sections
- Real-time data updates (simulated)
- Export functionality for reports
- Practice recommendation alerts
- Market opportunity notifications
- Progress tracking over time
- Comparison tools (year-over-year, peer benchmarking)

Sample Data to Include:
- Create realistic farm scenarios with actual farming practices
- Use current carbon credit market prices
- Include various crop types and farming methods
- Show meaningful ROI calculations
- Display seasonal trends and patterns

Make this feel like a production-ready prototype that demonstrates real business value for agricultural operations. Focus on actionable insights rather than just data display. The goal is to show how technology can help farmers both improve sustainability AND increase profitability through carbon credit monetization.`;

  const selectedApp = apps.find(app => app.url === selectedAppUrl);

  const handleEditUrl = () => {
    if (selectedApp) {
      setEditingAppId(selectedApp.id);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveUrl = (newUrl: string) => {
    if (editingAppId) {
      updateApp(editingAppId, { url: newUrl });
    }
    setEditingAppId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto px-6 py-3 relative">
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">
              Cursor battle - Claude Code vs Agent Claude 4
            </h1>
          </div>
          
          {/* Prompt button in top right corner */}
          <button
            onClick={() => setIsPromptModalOpen(true)}
            className="absolute top-3 right-6 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="View creation prompt"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* App buttons section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* App buttons */}
          {apps.map((app) => (
            <div key={app.id} className="relative group">
              <button
                onClick={() => setSelectedApp(app.url)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  selectedAppUrl === app.url
                    ? 'bg-blue-50 border-blue-200 shadow-md'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                aria-label={`Load ${app.name} application`}
              >
                <img
                  src={app.logoUrl}
                  alt={`${app.name} logo`}
                  width={20}
                  height={20}
                  className="shrink-0"
                />
                <span className="font-medium text-gray-900">{app.name}</span>
              </button>
              
              {!app.isDefault && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeApp(app.id);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-xs hover:bg-red-600"
                  aria-label={`Remove ${app.name}`}
                >
                  ×
                </button>
              )}
            </div>
          ))}

        </div>
      </div>

      {/* Main viewer */}
      <main className="flex-1 p-6 overflow-hidden">
        <AppViewer 
          url={selectedAppUrl} 
          className="h-full min-h-[800px] overflow-auto"
          onEdit={selectedAppUrl ? handleEditUrl : undefined}
        />
      </main>

      {/* Edit URL Modal */}
      {selectedApp && editingAppId && (
        <EditUrlModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingAppId(null);
          }}
          currentUrl={selectedApp.url}
          appName={selectedApp.name}
          onSave={handleSaveUrl}
        />
      )}

      {/* Prompt Modal */}
      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        promptText={creationPrompt}
      />
    </div>
  );
}

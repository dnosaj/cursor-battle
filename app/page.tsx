'use client';

import { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { AppButton } from '@/components/app-button';
import { AddAppModal } from '@/components/add-app-modal';
import { EditUrlModal } from '@/components/edit-url-modal';
import { PromptModal } from '@/components/prompt-modal';
import { AppViewer } from '@/components/app-viewer';
import { Button } from '@/components/ui/button';
import { MockLogoService } from '@/lib/services/logo-service';
import { AddAppFormData } from '@/types/domain';

const logoService = new MockLogoService();

export default function HomePage() {
  const { 
    apps, 
    selectedAppUrl, 
    isAddModalOpen, 
    setSelectedApp, 
    addApp, 
    setAddModalOpen, 
    removeApp,
    updateApp 
  } = useAppStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);

  // Creation prompt for the three applications
  const creationPrompt = `You are an AI code generator. Build a clickable MVP web app called Action Scope Composer. The app lets a user define what an enterprise AI agent is allowed to do against selected SaaS targets, then run a simulated dry‑run. It outputs a downloadable policy YAML and a simple approval packet. Keep integrations mocked, focused on scope design and simulation.

Purpose
Move agent conversations from hype to practice by scoping actions, risks, and human‑in‑the‑loop stops, then simulating a run before any real access is granted.

Non‑goals
No OAuth, no real API calls, no storage beyond in‑memory. The focus is on the specification and simulation UX.

Stack
Next.js 14, TypeScript, Tailwind, shadcn/ui, Zustand for state.

Architecture
app/page.tsx: one‑screen builder with three sections: Target, Scope, Simulate.
components/: TargetPicker.tsx, ActionLibrary.tsx, Guardrails.tsx, RiskDial.tsx, DryRunTimeline.tsx, YamlPreview.tsx, ExportPanel.tsx.
lib/policy/: actions.ts (static library), policy.ts (build YAML), simulate.ts (produces a timeline of steps and blocks).
app/api/policy/route.ts: returns YAML string and a compact PDF or Markdown for the approval packet.
types.ts: AgentScope, AllowedAction, Guardrail, RiskLevel, DryRunEvent.

Data models
interface AgentScope { target: 'Jira'|'Slack'|'Salesforce'|'Gmail'; actions: AllowedAction[]; guardrails: Guardrail[]; risk: RiskLevel; owner: string; reviewers: string[] }
interface AllowedAction { id: string; label: string; intent: 'read'|'write'|'delete'|'admin'; hril: boolean }
interface Guardrail { id: string; label: string; rule: 'approval'|'regex'|'rate_limit'|'time_window'; config: Record<string, unknown> }
type RiskLevel = 'Low'|'Medium'|'High'
interface DryRunEvent { t: number; description: string; requiresApproval?: boolean; blocked?: boolean }

Action library (static)
Jira: create_issue (write), comment_issue (write), search_issues (read), transition_issue (write), delete_issue (delete).
Slack: post_message (write), read_channel (read), add_reaction (write), invite_user (admin).
Salesforce: create_lead (write), update_oppty (write), read_account (read), delete_lead (delete).
Gmail: draft_email (write), send_email (write), read_unread (read), delete_email (delete).

UI layout
TargetPicker: dropdown for target, owner text input, reviewers multi‑select chips.
ActionLibrary: list of checkboxes grouped by intent. Show HRIL (human review in loop) toggle per action.
Guardrails: presets as chips: "Manager approval for write," "Regex blocklist," "Rate limit 10 actions per hour," "Working hours only 9–6." Each editable via a small modal.
RiskDial: segmented control for Low, Medium, High with short tooltips that explain the posture.
DryRunTimeline: on "Simulate," render a timeline of 6–10 steps that reflect chosen actions and guardrails. Show where an approval pause or block would occur, with reason tags.
YamlPreview: right‑side panel showing policy YAML live.
ExportPanel: buttons to Download YAML and Download Approval Packet (Markdown or PDF).

Policy YAML shape
target: Jira
owner: alice@kpmg.com
reviewers: [bob@kpmg.com]
risk: Medium
actions:
- id: create_issue
intent: write
hril: true
- id: search_issues
intent: read
guardrails:
- rule: approval
applies_to: ["write","delete"]
- rule: regex
pattern: "(secret|password|pii)"
- rule: time_window
start: "09:00"
end: "18:00"

Interactions
Selecting target updates the available action set.
HRIL toggles annotate actions. Guardrail presets add structured entries. RiskDial toggles change timeline behavior.
Simulate builds a deterministic timeline based on selected actions and guardrails. Example events: "Agent proposes to create Jira issue. Awaiting manager approval."

Tasteful design
Two‑column layout on desktop: configuration left, YAML preview and export right. Cards with soft shadows and clear dividers. Minimal color accents. Clear empty states.

Acceptance criteria
User can select a target, choose actions, add guardrails, set risk, run simulate, and download the YAML and a Markdown approval packet.
No real API calls. TypeScript strict. Keyboard accessible controls.

Stretch (marked TODO only)
Real OAuth connectors, signed policy bundles, versioning and audit trail.`;

  const selectedApp = apps.find(app => app.url === selectedAppUrl);

  const handleAddApp = async (data: AddAppFormData) => {
    // Extract logo for the new app
    const logoUrl = await logoService.extractLogo(data.url);
    
    addApp({
      name: data.name,
      url: data.url,
      logoUrl,
    });
  };

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
              An exercise in vibe coding
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
          
          {/* Add App button */}
          <Button
            onClick={() => setAddModalOpen(true)}
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          >
            <Plus className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Add App</span>
          </Button>
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

      {/* Add App Modal */}
      <AddAppModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddApp}
      />

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

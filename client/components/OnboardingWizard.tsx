import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser, PersonaType, getPersonaConfig } from "@/contexts/UserContext";
import { useState } from "react";
import { ChevronRight, Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";

const personas: PersonaType[] = ['custodian', 'creator', 'regenerator', 'citizen'];

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to Atlas Sanctum',
    subtitle: 'Where capital becomes conscience and wealth becomes wisdom',
  },
  {
    id: 'persona',
    title: 'Choose Your Path',
    subtitle: 'Select the role that best describes your mission',
  },
  {
    id: 'values',
    title: 'Values Alignment',
    subtitle: 'Help us understand your regenerative priorities',
  },
  {
    id: 'complete',
    title: 'Your Sanctum Awaits',
    subtitle: 'Ready to transform finance for planetary healing',
  },
];

const valuesQuestions = [
  {
    id: 'priority',
    question: 'What is your primary focus?',
    options: [
      { value: 'environment', label: 'Environmental regeneration', icon: '🌍' },
      { value: 'social', label: 'Social justice & equity', icon: '⚖️' },
      { value: 'economic', label: 'Economic transformation', icon: '💰' },
      { value: 'cultural', label: 'Cultural preservation', icon: '🎭' },
    ],
  },
  {
    id: 'approach',
    question: 'How do you prefer to create change?',
    options: [
      { value: 'direct', label: 'Direct action & implementation', icon: '⚡' },
      { value: 'collaborative', label: 'Collaborative partnerships', icon: '🤝' },
      { value: 'creative', label: 'Creative storytelling', icon: '✨' },
      { value: 'analytical', label: 'Data-driven insights', icon: '📊' },
    ],
  },
];

export default function OnboardingWizard() {
  const { state, dispatch } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  const handlePersonaSelect = (persona: PersonaType) => {
    setSelectedPersona(persona);
    dispatch({ type: 'SET_PERSONA', payload: persona });
  };

  const handleValueSelect = (questionId: string, value: string) => {
    setValues(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Update user stats based on selections
    const personaConfig = getPersonaConfig(selectedPersona);
    if (personaConfig) {
      dispatch({ 
        type: 'UPDATE_STATS', 
        payload: { 
          level: personaConfig.level,
          dignityCoins: personaConfig.level === 'custodian' ? 1000 : 100,
          impactScore: 0,
          badges: ['Newly Awakened']
        } 
      });
    }
    
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  };

  const isStepValid = () => {
    switch (steps[currentStep].id) {
      case 'persona':
        return selectedPersona !== null;
      case 'values':
        return Object.keys(values).length === valuesQuestions.length;
      default:
        return true;
    }
  };

  const step = steps[currentStep];

  return (
    <Dialog open={state.showOnboarding}>
      <DialogContent className="sm:max-w-2xl bg-card border-border p-0 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1 bg-muted">
          <div 
            className="h-full bg-gradient-to-r from-atlas-gold to-atlas-cosmic transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-atlas-gold/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-atlas-gold" />
              </div>
              <div className="text-sm text-foreground/60">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            {currentStep > 0 && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-2">{step.title}</h2>
          <p className="text-lg text-foreground/70">{step.subtitle}</p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {step.id === 'welcome' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-atlas-gold/20 to-atlas-cosmic/20 flex items-center justify-center">
                  <span className="text-4xl">🌟</span>
                </div>
                <p className="text-lg text-foreground/80 leading-relaxed max-w-md mx-auto">
                  You're about to embark on a journey that transforms how finance serves life. 
                  Let's discover your unique path in the regenerative revolution.
                </p>
              </div>
            </div>
          )}

          {step.id === 'persona' && (
            <div className="space-y-4">
              {personas.map((persona) => {
                const config = getPersonaConfig(persona);
                if (!config) return null;

                return (
                  <button
                    key={persona}
                    onClick={() => handlePersonaSelect(persona)}
                    className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left group ${
                      selectedPersona === persona
                        ? `border-${config.color} bg-${config.color}/5`
                        : 'border-border hover:border-atlas-gold/50 hover:bg-atlas-gold/5'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{config.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">
                            {config.title}
                          </h3>
                          {selectedPersona === persona && (
                            <CheckCircle2 className={`w-5 h-5 text-${config.color}`} />
                          )}
                        </div>
                        <p className="text-foreground/70 mb-3">{config.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {config.workspaces.map((workspace) => (
                            <Badge key={workspace} variant="secondary" className="text-xs">
                              {workspace.replace('-', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {step.id === 'values' && (
            <div className="space-y-8">
              {valuesQuestions.map((question) => (
                <div key={question.id} className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    {question.question}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {question.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleValueSelect(question.id, option.value)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          values[question.id] === option.value
                            ? 'border-atlas-cosmic bg-atlas-cosmic/5'
                            : 'border-border hover:border-atlas-cosmic/50 hover:bg-atlas-cosmic/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{option.icon}</span>
                          <span className="font-medium text-foreground">{option.label}</span>
                          {values[question.id] === option.value && (
                            <CheckCircle2 className="w-4 h-4 text-atlas-cosmic ml-auto" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {step.id === 'complete' && (
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-atlas-regenerative/20 to-atlas-wisdom/20 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-atlas-regenerative" />
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed max-w-md mx-auto mb-6">
                Welcome, {getPersonaConfig(selectedPersona)?.title}! Your journey into regenerative finance begins now.
              </p>
              <div className="flex justify-center gap-4">
                <Badge variant="secondary">
                  🌟 Newly Awakened
                </Badge>
                <Badge variant="secondary">
                  Level: {getPersonaConfig(selectedPersona)?.level}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/20 px-8 py-4 flex justify-between items-center">
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-atlas-gold' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {currentStep === steps.length - 1 ? (
              <Button 
                onClick={handleComplete}
                className="bg-atlas-regenerative hover:bg-atlas-regenerative/90 text-white"
              >
                Enter Sanctum
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-atlas-gold hover:bg-atlas-gold/90 text-atlas-deep"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

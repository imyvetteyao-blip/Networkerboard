
export enum ContactStatus {
  LEAD = 'Lead',
  PENDING = 'Pending',
  CONNECTED = 'Connected',
  COFFEE_SCHEDULED = 'Coffee Scheduled',
  FOLLOW_UP_NEEDED = 'Follow-up Needed',
  NURTURING = 'Nurturing'
}

export type ReviewPeriod = 'W' | 'M' | 'Q' | 'Y';

export interface Interaction {
  id: string;
  date: string;
  duration: number;
  notes: string;
  hook: string;
  valueReceived: string;
  altruismRecord: string;
  score: number;
}

export interface OneOffEvent {
  id: string;
  name: string;
  eventDate: string;
  notifyDate: string;
  completed: boolean;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  position: string;
  location: string;
  education: string;
  linkedinUrl: string;
  status: ContactStatus;
  commonalities: string[];
  interactions: Interaction[];
  createdAt: string;
  followUpInterval: number;
  nextFollowUpDate: string;
  oneOffEvents: OneOffEvent[];
}

export interface PersonaProfile {
  traits: string[];
  background: string;
  seniority: string;
  summary: string;
}

export interface HitRate {
  name: string;
  percentage: number;
  description: string;
}

export interface MetricWithTrend {
  currentValue: number;
  comparisonValue: string; // e.g. "↑5% vs avg"
  isPositive: boolean;
}

export interface WeeklyInsight {
  funnel: {
    sent: number;
    responded: number;
    coffee: number;
    responseRate: MetricWithTrend;
    coffeeRate: MetricWithTrend;
  };
  personas: {
    success: PersonaProfile;
    failure: PersonaProfile;
    driftAnalysis?: string; // Analysis of how personas shifted over longer periods
  };
  featureHitRates: HitRate[];
  keywords: {
    myThoughts: string[];
    theirInfo: string[];
    evolutionNotes?: string; // How topics shifted
  };
  altruism: {
    helpCount: number;
    momentumScore: number;
    summary: string;
    topRecipientCategories: string[];
  };
}

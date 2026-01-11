
import React from 'react';
import { ContactStatus, Contact } from './types';

export const GLOBAL_DEFAULT_INTERVAL = 30; // 30 days default

export const STATUS_COLORS: Record<ContactStatus, string> = {
  [ContactStatus.LEAD]: 'bg-slate-100 text-slate-700 border-slate-200',
  [ContactStatus.PENDING]: 'bg-amber-50 text-amber-700 border-amber-200',
  [ContactStatus.CONNECTED]: 'bg-blue-50 text-blue-700 border-blue-200',
  [ContactStatus.COFFEE_SCHEDULED]: 'bg-purple-50 text-purple-700 border-purple-200',
  [ContactStatus.FOLLOW_UP_NEEDED]: 'bg-rose-50 text-rose-700 border-rose-200',
  [ContactStatus.NURTURING]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    company: 'TechFlow AI',
    position: 'Senior Product Manager',
    location: 'San Francisco, CA',
    education: 'Stanford University',
    linkedinUrl: 'https://linkedin.com/in/sarahchen',
    status: ContactStatus.NURTURING,
    commonalities: ['Stanford Alumni', 'Former Google', 'SF Based'],
    interactions: [
      {
        id: 'int1',
        date: '2024-05-10',
        duration: 45,
        notes: 'Discussed the future of generative AI in B2B SaaS.',
        hook: 'She loves bouldering at Mission Cliffs.',
        valueReceived: 'Insights on GTM strategy for AI startups.',
        altruismRecord: 'Introduced her to a lead investor at Sequoia.',
        score: 9
      }
    ],
    createdAt: '2024-01-15',
    followUpInterval: 90,
    nextFollowUpDate: '2024-08-10',
    oneOffEvents: [
      {
        id: 'e1',
        name: 'New Product Launch',
        eventDate: '2024-12-01',
        notifyDate: today,
        completed: false
      }
    ]
  },
  {
    id: '2',
    name: 'Marcus Thorne',
    company: 'GreenHorizon Ventures',
    position: 'Partner',
    location: 'London, UK',
    education: 'Oxford University',
    linkedinUrl: 'https://linkedin.com/in/marcusthorne',
    status: ContactStatus.CONNECTED,
    commonalities: ['Venture Capital', 'Oxford Alumni'],
    interactions: [],
    createdAt: '2024-03-22',
    followUpInterval: 30,
    nextFollowUpDate: yesterday,
    oneOffEvents: []
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    company: 'FinLeap',
    position: 'CTO',
    location: 'Berlin, Germany',
    education: 'TU Munich',
    linkedinUrl: 'https://linkedin.com/in/elenarodriguez',
    status: ContactStatus.PENDING,
    commonalities: ['Fintech Enthusiast', 'Europe Tech'],
    interactions: [],
    createdAt: '2024-05-01',
    followUpInterval: 14,
    nextFollowUpDate: '2024-06-15',
    oneOffEvents: []
  },
  {
    id: '4',
    name: 'David Kim',
    company: 'Meta',
    position: 'E6 Software Engineer',
    location: 'Seattle, WA',
    education: 'University of Washington',
    linkedinUrl: 'https://linkedin.com/in/davidkim',
    status: ContactStatus.COFFEE_SCHEDULED,
    commonalities: ['Former Coworker', 'Seattle Resident'],
    interactions: [
      {
        id: 'int2',
        date: '2024-05-05',
        duration: 30,
        notes: 'Catch up on distributed systems architecture.',
        hook: 'He is currently learning to play the cello.',
        valueReceived: 'Referral for an engineering lead position.',
        altruismRecord: 'Helped him debug a production issue in his side project.',
        score: 8
      }
    ],
    createdAt: '2024-04-10',
    followUpInterval: 30,
    nextFollowUpDate: today,
    oneOffEvents: []
  }
];

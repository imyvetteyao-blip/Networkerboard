
import React from 'react';
import { Contact } from '../types';
import { STATUS_COLORS } from '../constants';

interface ContactCardProps {
  contact: Contact;
  onClick: (contact: Contact) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onClick }) => {
  const interactionCount = contact.interactions.length;
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = contact.nextFollowUpDate && contact.nextFollowUpDate < today;
  const isDueToday = contact.nextFollowUpDate === today;
  
  const hasPendingEvent = contact.oneOffEvents.some(e => !e.completed && e.notifyDate <= today);

  return (
    <div 
      onClick={() => onClick(contact)}
      className={`bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden ${
        isOverdue ? 'border-rose-200' : 'border-slate-200'
      }`}
    >
      {/* Static Overdue Indicator - Left Bar */}
      {isOverdue && (
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-rose-500"></div>
      )}
      
      {/* Due Today/Event Highlight */}
      {(isDueToday || hasPendingEvent) && !isOverdue && (
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-400"></div>
      )}

      {/* Alert Status Background */}
      {isOverdue && (
        <div className="absolute inset-0 bg-rose-500/5 pointer-events-none"></div>
      )}

      <div className="flex justify-between items-start mb-2 pl-1">
        <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
          {contact.name}
        </h4>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[contact.status]}`}>
          {contact.status}
        </span>
      </div>
      
      <p className="text-xs text-slate-500 mb-1 leading-snug pl-1">
        {contact.position} @ {contact.company}
      </p>
      
      <div className="flex flex-wrap gap-1 mt-3 pl-1">
        {contact.commonalities.slice(0, 2).map((c, i) => (
          <span key={i} className="bg-slate-50 text-slate-600 text-[10px] px-1.5 py-0.5 rounded border border-slate-100">
            {c}
          </span>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] pl-1">
        <div className="flex items-center gap-1 text-slate-400">
          <i className="fa-regular fa-comments"></i>
          <span>{interactionCount} chats</span>
        </div>
        <div className={`flex items-center gap-1 font-medium ${isOverdue ? 'text-rose-600 bg-rose-50 px-1.5 rounded' : isDueToday ? 'text-amber-600' : 'text-slate-400'}`}>
          <i className="fa-solid fa-clock-rotate-left"></i>
          <span>{contact.nextFollowUpDate ? new Date(contact.nextFollowUpDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;

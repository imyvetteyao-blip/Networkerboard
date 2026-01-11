
import React, { useState } from 'react';
import { Contact, Interaction, OneOffEvent } from '../types';
import { STATUS_COLORS, GLOBAL_DEFAULT_INTERVAL } from '../constants';

interface ContactDetailProps {
  contact: Contact;
  onClose: () => void;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ contact, onClose }) => {
  const [activeSubTab, setActiveSubTab] = useState<'chats' | 'strategy'>('chats');
  const [followUpDays, setFollowUpDays] = useState(contact.followUpInterval || GLOBAL_DEFAULT_INTERVAL);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-gradient-to-r from-white to-slate-50">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-indigo-200">
              {contact.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">{contact.name}</h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[contact.status]}`}>
                  {contact.status}
                </span>
              </div>
              <p className="text-slate-500">{contact.position} at <span className="text-slate-900 font-medium">{contact.company}</span></p>
              <div className="flex gap-4 mt-2">
                <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-xs font-medium bg-blue-50 px-2 py-1 rounded">
                  <i className="fa-brands fa-linkedin"></i> Profile
                </a>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Inner Tabs */}
        <div className="flex px-6 border-b border-slate-100 bg-white">
          <button 
            onClick={() => setActiveSubTab('chats')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition ${activeSubTab === 'chats' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Interactions ({contact.interactions.length})
          </button>
          <button 
            onClick={() => setActiveSubTab('strategy')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition ${activeSubTab === 'strategy' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Nurturing Strategy
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="space-y-6">
              <section>
                <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">Core Bio</h3>
                <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-location-dot mt-1 text-slate-400"></i>
                    {contact.location}
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-graduation-cap mt-1 text-slate-400"></i>
                    {contact.education}
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">Reminders</h3>
                <div className={`p-4 rounded-xl border shadow-sm ${contact.nextFollowUpDate < today ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'}`}>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Next Catch-up</p>
                  <p className={`text-sm font-bold ${contact.nextFollowUpDate < today ? 'text-rose-600' : 'text-slate-900'}`}>
                    {new Date(contact.nextFollowUpDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </p>
                </div>
              </section>
            </div>

            <div className="lg:col-span-3">
              {activeSubTab === 'chats' ? (
                <div className="space-y-4">
                  {contact.interactions.map(interaction => (
                    <div key={interaction.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                          {interaction.date} • {interaction.duration}m
                        </span>
                        <div className="flex gap-1">
                          {[...Array(10)].map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i < interaction.score ? 'bg-amber-400' : 'bg-slate-100'}`}></div>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{interaction.notes}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-sliders text-indigo-500"></i>
                      Follow-up Cadence
                    </h4>
                    <div className="flex items-center gap-6">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Interval (Days)</label>
                        <div className="flex items-center gap-3">
                          <input 
                            type="number" 
                            value={followUpDays} 
                            onChange={(e) => setFollowUpDays(parseInt(e.target.value) || 0)}
                            className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-slate-500 font-medium">days between follow-ups</span>
                        </div>
                      </div>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition">
                        Update Cycle
                      </button>
                    </div>
                  </section>

                  <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="text-base font-bold text-slate-900 mb-4">One-off Events</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contact.oneOffEvents.map(event => (
                        <div key={event.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{event.name}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Date: {event.eventDate}</p>
                          </div>
                          <i className="fa-solid fa-calendar-check text-slate-300"></i>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;

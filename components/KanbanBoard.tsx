
import React from 'react';
import { Contact, ContactStatus } from '../types';
import ContactCard from './ContactCard';

interface KanbanBoardProps {
  contacts: Contact[];
  onContactClick: (contact: Contact) => void;
}

const COLUMNS: ContactStatus[] = [
  ContactStatus.LEAD,
  ContactStatus.PENDING,
  ContactStatus.CONNECTED,
  ContactStatus.COFFEE_SCHEDULED,
  ContactStatus.FOLLOW_UP_NEEDED,
  ContactStatus.NURTURING
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ contacts, onContactClick }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6">
      {COLUMNS.map(column => {
        const columnContacts = contacts.filter(c => c.status === column);
        return (
          <div key={column} className="flex-shrink-0 w-72 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2 uppercase tracking-wider">
                {column}
                <span className="bg-slate-200 text-slate-600 text-[10px] py-0.5 px-1.5 rounded-full">
                  {columnContacts.length}
                </span>
              </h3>
            </div>
            
            <div className="bg-slate-100/50 rounded-xl p-2 min-h-[500px] flex flex-col gap-3 border border-dashed border-slate-300">
              {columnContacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-20 text-slate-400 text-xs text-center px-4">
                  No contacts in this stage
                </div>
              ) : (
                columnContacts.map(contact => (
                  <ContactCard 
                    key={contact.id} 
                    contact={contact} 
                    onClick={onContactClick} 
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;

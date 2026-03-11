import React, { useState, useEffect } from 'react'
import { useAuth } from './contexts/AuthContext'
import './pages/Page.css'

const Mail = () => {
  const { access } = useAuth();
  const [emails, setEmails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (access) fetchEmails();
  }, [access]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://graph.microsoft.com/v1.0/me/messages?$top=50&$select=id,subject,from,receivedDateTime,bodyPreview,isRead,body', {
        headers: { 'Authorization': `Bearer ${access}` }
      });
      const data = await res.json();
      setEmails(data.value || []);
    } catch (e) { console.error("Fetch error", e); }
    setLoading(false);
  };

  const deleteMail = async (id) => {
    if (!confirm("Delete this email?")) return;
    await fetch(`https://graph.microsoft.com/v1.0/me/messages/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${access}` }
    });
    setEmails(emails.filter(m => m.id !== id));
    setSelectedMail(null);
  };

  return (
    <div className="page-container">
      <div className="mail-layout">
        <div className="mail-tabs">
          <button className="tab-button active">Inbox ({emails.length})</button>
          <button className="tab-button" onClick={fetchEmails}>🔄 Refresh</button>
        </div>
        <div className="mail-content">
          <div className="email-list-pane">
            <div className="email-list">
              {loading ? <div className="p-4 text-center text-sm opacity-50">Fetching live data...</div> : 
               emails.map(mail => (
                <div key={mail.id} className={`email-item ${!mail.isRead ? 'unread' : ''}`} onClick={() => setSelectedMail(mail)}>
                  <div className="email-avatar" style={{backgroundColor: '#0078d4', color: 'white'}}>
                    {(mail.from?.emailAddress?.name || "?")[0]}
                  </div>
                  <div className="email-details">
                    <div className="email-header">
                      <span className="email-sender truncate">{mail.from?.emailAddress?.name}</span>
                      <span className="email-time">{new Date(mail.receivedDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="email-subject truncate">{mail.subject}</div>
                    <div className="email-preview line-clamp-2">{mail.bodyPreview}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="email-view-pane">
            {selectedMail ? (
              <div className="email-viewer p-6">
                <div className="flex justify-between items-start mb-6 border-b pb-4">
                  <h2 className="text-xl font-bold">{selectedMail.subject}</h2>
                  <button onClick={() => deleteMail(selectedMail.id)} className="text-red-600 font-bold text-xs uppercase border border-red-100 px-2 py-1 rounded hover:bg-red-50">Delete</button>
                </div>
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {selectedMail.from?.emailAddress?.name[0]}
                   </div>
                   <div>
                      <div className="font-bold text-sm">{selectedMail.from?.emailAddress?.name}</div>
                      <div className="text-xs text-gray-400">{selectedMail.from?.emailAddress?.address}</div>
                   </div>
                </div>
                <div className="mail-body-content overflow-auto" dangerouslySetInnerHTML={{ __html: selectedMail.body.content }} />
              </div>
            ) : (
              <div className="empty-state">
                <p>Select an email to view real-time data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mail

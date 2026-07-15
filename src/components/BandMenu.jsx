import React, { useState } from 'react';
import {
  GENRES,
  VENUES,
  practiceBand,
  bookGig,
  recordAlbum,
  getAvailableVenues,
  getAvgMemberSkill,
  getBandCohesion,
  replaceMember,
  getRandomDrama,
} from '../logic/Band';
import './Modal.css';

export function BandMenu({
  person,
  onAction,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  const [view, setView] = useState('overview');
  const [bandName, setBandName] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('rock');
  const [drama, setDrama] = useState(null);
  const [gigResult, setGigResult] = useState(null);
  const [albumResult, setAlbumResult] = useState(null);
  const [practiceMsg, setPracticeMsg] = useState(null);

  if (!person.band) {
    return (
      <div className="modal-overlay">
        <div className="modal-content" style={{ maxWidth: '450px' }}>
          <div className="modal-header">
            <h2 className="modal-title">{t('band.title', '🎸 Band')}</h2>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            <h3>{t('band.formTitle', 'Form a Band')}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
              {t('band.formDesc', 'Pick a name and genre to start your music career!')}
            </p>
            <label>{t('band.bandName', 'Band Name:')}</label>
            <input
              type="text"
              value={bandName}
              onChange={e => setBandName(e.target.value.slice(0, 30))}
              placeholder={t('band.namePlaceholder', 'Enter band name...')}
              style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
            />
            <label>{t('band.genre', 'Genre:')}</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {GENRES.map(g => (
                <button
                  key={g.id}
                  type="button"
                  className={`language-chip ${selectedGenre === g.id ? 'active' : ''}`}
                  onClick={() => setSelectedGenre(g.id)}
                >
                  {g.name}
                </button>
              ))}
            </div>
            <button
              className="btn-primary"
              style={{ width: '100%' }}
              disabled={!bandName.trim()}
              onClick={() => {
                onAction('form_band', { name: bandName.trim(), genre: selectedGenre });
                setBandName('');
              }}
            >
              {t('band.formButton', '🎸 Form Band!')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const band = person.band;
  const avgSkill = getAvgMemberSkill(person);
  const cohesion = getBandCohesion(person);
  const availableVenues = getAvailableVenues(person);

  const renderOverview = () => (
    <div>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
        textAlign: 'center',
      }}>
        <h3 style={{ fontSize: '1.3em', marginBottom: '4px' }}>{band.name}</h3>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>
          {GENRES.find(g => g.id === band.genre)?.name || band.genre} &bull; Formed at age {band.formedAtAge}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        marginBottom: '16px',
      }}>
        <div className="list-item" style={{ textAlign: 'center', padding: '12px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {t('band.cohesion', 'Cohesion')}
          </div>
          <div style={{ fontSize: '1.2em', fontWeight: 700 }}>{cohesion}%</div>
          <div style={{ height: '4px', background: 'var(--bg-surface)', borderRadius: '2px', marginTop: '6px' }}>
            <div style={{ height: '100%', width: `${cohesion}%`, background: 'var(--accent-primary)', borderRadius: '2px' }} />
          </div>
        </div>
        <div className="list-item" style={{ textAlign: 'center', padding: '12px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {t('band.avgSkill', 'Avg Skill')}
          </div>
          <div style={{ fontSize: '1.2em', fontWeight: 700 }}>{avgSkill}%</div>
          <div style={{ height: '4px', background: 'var(--bg-surface)', borderRadius: '2px', marginTop: '6px' }}>
            <div style={{ height: '100%', width: `${avgSkill}%`, background: '#4caf50', borderRadius: '2px' }} />
          </div>
        </div>
        <div className="list-item" style={{ textAlign: 'center', padding: '12px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {t('band.albums', 'Albums')}
          </div>
          <div style={{ fontSize: '1.2em', fontWeight: 700 }}>{band.albums?.length || 0}</div>
        </div>
        <div className="list-item" style={{ textAlign: 'center', padding: '12px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {t('band.earnings', 'Earnings')}
          </div>
          <div style={{ fontSize: '1.2em', fontWeight: 700, color: '#4caf50' }}>
            ${(band.totalEarnings || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {gigResult && (
        <div style={{
          background: '#1b5e20',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '12px',
          color: '#c8e6c9',
          fontSize: '0.85rem',
        }}>
          {gigResult}
          <button
            style={{ marginLeft: '8px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}
            onClick={() => setGigResult(null)}
          >
            &times;
          </button>
        </div>
      )}
      {albumResult && (
        <div style={{
          background: '#1b5e20',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '12px',
          color: '#c8e6c9',
          fontSize: '0.85rem',
        }}>
          {albumResult}
          <button
            style={{ marginLeft: '8px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}
            onClick={() => setAlbumResult(null)}
          >
            &times;
          </button>
        </div>
      )}
      {practiceMsg && (
        <div style={{
          background: '#1a237e',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '12px',
          color: '#c5cae9',
          fontSize: '0.85rem',
        }}>
          {practiceMsg}
          <button
            style={{ marginLeft: '8px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}
            onClick={() => setPracticeMsg(null)}
          >
            &times;
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button className="list-item" onClick={() => {
          const result = practiceBand(person);
          if (result?.message) setPracticeMsg(result.message);
          if (!result?.success) setPracticeMsg(result?.message || 'Something went wrong.');
          onAction('_refresh');
        }}>
          <div>
            <div className="bold">{t('band.practice', '🎸 Practice')}</div>
            <div className="list-item-subtitle">{t('band.practiceDesc', 'Improve cohesion and member skills')}</div>
          </div>
        </button>

        <button className="list-item" onClick={() => setView('gig')}>
          <div>
            <div className="bold">{t('band.bookGig', '🎤 Book a Gig')}</div>
            <div className="list-item-subtitle">
              {availableVenues.length > 0
                ? t('band.venuesAvailable', `${availableVenues.length} venues available`)
                : t('band.needMoreFame', 'Need more fame/cohesion to book venues')}
            </div>
          </div>
        </button>

        <button className="list-item" onClick={() => setView('album')}>
          <div>
            <div className="bold">{t('band.recordAlbum', '💿 Record Album')}</div>
            <div className="list-item-subtitle">{t('band.recordDesc', 'Costs ~$20-50k, earn royalties')}</div>
          </div>
        </button>

        <button className="list-item" onClick={() => setView('members')}>
          <div>
            <div className="bold">{t('band.members', '👥 Members')}</div>
            <div className="list-item-subtitle">
              {band.members.length} {t('band.membersCount', 'members')}
            </div>
          </div>
        </button>

        {band.albums?.length > 0 && (
          <button className="list-item" onClick={() => setView('discography')}>
            <div>
              <div className="bold">{t('band.discography', '💿 Discography')}</div>
              <div className="list-item-subtitle">
                {band.albums.length} {t('band.albumsReleased', 'albums released')}
              </div>
            </div>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <button className="btn-secondary" style={{ flex: 1 }} onClick={() => {
          onAction('disband');
        }}>
          {t('band.disband', '💔 Disband')}
        </button>
        <button className="btn-secondary" style={{ flex: 1 }} onClick={() => onAction('rest')}>
          {t('band.rest', '😴 Rest')}
        </button>
      </div>
    </div>
  );

  const renderGigBooking = () => (
    <div>
      <button onClick={() => setView('overview')} style={{ marginBottom: '16px' }}>
        &larr; {t('band.back', 'Back')}
      </button>
      <h3>{t('band.bookGigTitle', 'Book a Gig')}</h3>
      {availableVenues.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>
          {t('band.noVenues', 'No venues available. Gain more fame or practice to increase cohesion.')}
        </p>
      ) : (
        <div className="list-container">
          {availableVenues.map(venue => (
            <div key={venue.id} className="list-item">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div className="bold">{venue.name}</div>
                  <div className="list-item-subtitle">
                    {t('band.capacity', 'Cap:')} {venue.capacity.toLocaleString()} &bull;
                    {t('band.payout', 'Pay:')} ${venue.payout.toLocaleString()} &bull;
                    {t('band.stress', 'Energy:')} -{venue.stress}
                  </div>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => {
                    const result = bookGig(person, venue.id);
                    if (result?.success) {
                      setGigResult(result.message);
                      setView('overview');
                      onAction('_refresh');
                    } else {
                      setPracticeMsg(result?.message || 'Could not book gig.');
                    }
                  }}
                >
                  {t('band.play', '▶️ Play')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAlbumRecording = () => (
    <div>
      <button onClick={() => setView('overview')} style={{ marginBottom: '16px' }}>
        &larr; {t('band.back', 'Back')}
      </button>
      <h3>{t('band.recordTitle', 'Record Album')}</h3>
      <div className="list-item">
        <p style={{ marginBottom: '8px' }}>
          {t('band.recordCost', 'Recording costs between $20,000 and $50,000. Quality depends on band skill and cohesion.')}
        </p>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          {t('band.avgSkill', 'Avg Skill:')} {avgSkill}% &bull;
          {t('band.cohesion', 'Cohesion:')} {cohesion}%
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            const result = recordAlbum(person);
            if (result?.success) {
              setAlbumResult(result.message);
              setView('overview');
              onAction('_refresh');
            } else {
              setPracticeMsg(result?.message || 'Could not record album.');
            }
          }}
        >
          {t('band.record', '💿 Record Now')}
        </button>
      </div>
    </div>
  );

  const renderMembers = () => (
    <div>
      <button onClick={() => setView('overview')} style={{ marginBottom: '16px' }}>
        &larr; {t('band.back', 'Back')}
      </button>
      <h3>{t('band.members', '👥 Members')}</h3>
      <div className="list-container">
        {band.members.map(m => (
          <div key={m.id} className="list-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="bold">{m.name}</div>
                <div className="list-item-subtitle">
                  {m.role} &bull; {t('band.skill', 'Skill:')} {m.skill}%
                </div>
                <div className="list-item-subtitle">
                  {t('band.loyalty', 'Loyalty:')} {m.loyalty}% &bull;
                  {t('band.happiness', 'Happiness:')} {m.happiness}%
                </div>
              </div>
              <button
                className="btn-danger"
                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                onClick={() => {
                  const result = replaceMember(person, m.id);
                  if (result?.message) setPracticeMsg(result.message);
                  onAction('_refresh');
                }}
              >
                {t('band.fire', 'Fire')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDiscography = () => (
    <div>
      <button onClick={() => setView('overview')} style={{ marginBottom: '16px' }}>
        &larr; {t('band.back', 'Back')}
      </button>
      <h3>{t('band.discography', '💿 Discography')}</h3>
      {(!band.albums || band.albums.length === 0) ? (
        <p style={{ color: 'var(--text-secondary)' }}>{t('band.noAlbums', 'No albums recorded yet.')}</p>
      ) : (
        <div className="list-container">
          {[...band.albums].reverse().map((album, i) => (
            <div key={i} className="list-item">
              <div className="bold">{album.tier}</div>
              <div className="list-item-subtitle">
                {t('band.sold', 'Sold:')} {album.sales.toLocaleString()} &bull;
                {t('band.royalty', 'Royalty:')} ${album.royalty.toLocaleString()} &bull;
                {t('band.age', 'Age')} {album.year}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2 className="modal-title">🎸 {band.name}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {view === 'overview' && renderOverview()}
          {view === 'gig' && renderGigBooking()}
          {view === 'album' && renderAlbumRecording()}
          {view === 'members' && renderMembers()}
          {view === 'discography' && renderDiscography()}
        </div>
      </div>
    </div>
  );
}

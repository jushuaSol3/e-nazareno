import './openBook.css';
import { useState, useRef, useEffect } from 'react';

import { useParams } from 'react-router-dom';
import bookDataToRead from '../data/openBook.json';

const API_BASE = 'https://enazareno-audio.onrender.com';

export default function OpenBook() {

  const { id } = useParams();
  const openBook = bookDataToRead.find(book => book.id === parseInt(id));

  const prefaceBody = openBook.preface.body;

  // this is for all stats realatead to the audio player
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioError, setAudioError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [showPreface, setShowPreface] = useState(true);

  // Preface audio player refs and state (inside modal)
  const prefaceAudioRef = useRef(null);
  const [prefaceIsPlaying, setPrefaceIsPlaying] = useState(false);
  const [prefaceDuration, setPrefaceDuration] = useState(0);
  const [prefaceCurrentTime, setPrefaceCurrentTime] = useState(0);
  const [prefaceAudioError, setPrefaceAudioError] = useState(null);

  // Story audio player refs and state (under story title)
  const storyAudioRef = useRef(null);
  const [storyIsPlaying, setStoryIsPlaying] = useState(false);
  const [storyDuration, setStoryDuration] = useState(0);
  const [storyCurrentTime, setStoryCurrentTime] = useState(0);
  const [storyAudioError, setStoryAudioError] = useState(null);

  // Build the stream URLs from the current book id
  const audioSrc = `${API_BASE}/api/audio/${id}`;
  const prefaceAudioSrc = `${API_BASE}/api/audio/${id}`;
  const storyAudioSrc = `${API_BASE}/api/audio/${id}/story`;

  // Reset player whenever the book id changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioError(null);
    setShowPreface(true);

    // Reset preface player
    setPrefaceIsPlaying(false);
    setPrefaceCurrentTime(0);
    setPrefaceDuration(0);
    setPrefaceAudioError(null);

    // Reset story player
    setStoryIsPlaying(false);
    setStoryCurrentTime(0);
    setStoryDuration(0);
    setStoryAudioError(null);

    if (audioRef.current) {
      audioRef.current.load(); // forces the browser to re-fetch for the new id
    }
    if (prefaceAudioRef.current) {
      prefaceAudioRef.current.load();
    }
    if (storyAudioRef.current) {
      storyAudioRef.current.load();
    }
  }, [id]);

  function handlePlayPause() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // .play() returns a Promise — catch errors so the UI doesn't break
      audioRef.current.play().catch(err => {
        console.error('Play failed:', err);
        setAudioError('Could not play audio. Is the backend running?');
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }

  // function handleTimeUpdate() {
  //   if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  // }

  // function handleLoadedMetadata() {
  //   if (audioRef.current) setDuration(audioRef.current.duration);
  // }

  // function handleSeek(e) {
  //   const newTime = parseFloat(e.target.value);
  //   if (audioRef.current) audioRef.current.currentTime = newTime;
  //   setCurrentTime(newTime);
  // }

  // function handleAudioError(e) {
  //   const err = audioRef.current?.error;
  //   const msg = err ? `Audio error (code ${err.code}): ${err.message}` : 'Unknown audio error';
  //   console.error(msg, '\nSrc:', audioSrc);
  //   setAudioError(`Cannot load audio. Check that the backend is running at ${API_BASE}`);
  //   setIsPlaying(false);
  // }


  function highlightText(text, query) {
    if (!query.trim()) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part)
        ? <mark key={i} className="ob-highlight">{part}</mark>
        : part
    );
  }



  function formatTime(secs) {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // ── Preface audio handlers ───────────────────────────────
  function handlePrefacePlayPause() {
    if (!prefaceAudioRef.current) return;
    if (prefaceIsPlaying) {
      prefaceAudioRef.current.pause();
      setPrefaceIsPlaying(false);
    } else {
      prefaceAudioRef.current.play().catch(err => {
        console.error('Preface play failed:', err);
        setPrefaceAudioError('Could not play preface audio. Is the backend running?');
        setPrefaceIsPlaying(false);
      });
      setPrefaceIsPlaying(true);
    }
  }

  function handlePrefaceTimeUpdate() {
    if (prefaceAudioRef.current) setPrefaceCurrentTime(prefaceAudioRef.current.currentTime);
  }

  function handlePrefaceLoadedMetadata() {
    if (prefaceAudioRef.current) setPrefaceDuration(prefaceAudioRef.current.duration);
  }

  function handlePrefaceSeek(e) {
    const newTime = parseFloat(e.target.value);
    if (prefaceAudioRef.current) prefaceAudioRef.current.currentTime = newTime;
    setPrefaceCurrentTime(newTime);
  }

  function handlePrefaceAudioError() {
    const err = prefaceAudioRef.current?.error;
    const msg = err ? `Audio error (code ${err.code}): ${err.message}` : 'Unknown audio error';
    console.error(msg, '\nSrc:', prefaceAudioSrc);
    setPrefaceAudioError(`Cannot load preface audio. Check that the backend is running at ${API_BASE}`);
    setPrefaceIsPlaying(false);
  }

  // ── Story audio handlers ─────────────────────────────────
  function handleStoryPlayPause() {
    if (!storyAudioRef.current) return;
    if (storyIsPlaying) {
      storyAudioRef.current.pause();
      setStoryIsPlaying(false);
    } else {
      storyAudioRef.current.play().catch(err => {
        console.error('Story play failed:', err);
        setStoryAudioError('Could not play story audio. Is the backend running?');
        setStoryIsPlaying(false);
      });
      setStoryIsPlaying(true);
    }
  }

  function handleStoryTimeUpdate() {
    if (storyAudioRef.current) setStoryCurrentTime(storyAudioRef.current.currentTime);
  }

  function handleStoryLoadedMetadata() {
    if (storyAudioRef.current) setStoryDuration(storyAudioRef.current.duration);
  }

  function handleStorySeek(e) {
    const newTime = parseFloat(e.target.value);
    if (storyAudioRef.current) storyAudioRef.current.currentTime = newTime;
    setStoryCurrentTime(newTime);
  }

  function handleStoryAudioError() {
    const err = storyAudioRef.current?.error;
    const msg = err ? `Audio error (code ${err.code}): ${err.message}` : 'Unknown audio error';
    console.error(msg, '\nSrc:', storyAudioSrc);
    setStoryAudioError(`Cannot load story audio. Check that the backend is running at ${API_BASE}`);
    setStoryIsPlaying(false);
  }


  return (
    <div className="ob-root">

      {/* Preface Modal */}
      {showPreface && (
        <div className="ob-modal-overlay">
          <div className="ob-modal">
            <div className="ob-modal-hero">
              <h1 className="ob-title">{openBook.preface.title}</h1>
              <p className="ob-subtitle">Paunang Sulat</p>

              {/* Preface audio player inside modal */}
              <div className="ob-audio-player ob-modal-audio" aria-label="Preface audio player">
                <audio
                  ref={prefaceAudioRef}
                  onTimeUpdate={handlePrefaceTimeUpdate}
                  onLoadedMetadata={handlePrefaceLoadedMetadata}
                  onEnded={() => setPrefaceIsPlaying(false)}
                  onError={handlePrefaceAudioError}
                  preload="metadata"
                >
                  <source key={`preface-${id}`} src={prefaceAudioSrc} type="audio/wav" />
                </audio>

                <button onClick={handlePrefacePlayPause}>
                  {prefaceIsPlaying ? 'pause' : 'play'}
                </button>

                <input
                  className="ob-seek-bar"
                  type="range"
                  min={0}
                  max={prefaceDuration || 0}
                  step={0.1}
                  value={prefaceCurrentTime}
                  onChange={handlePrefaceSeek}
                  style={{ flex: 1 }}
                />

                <span style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                  {formatTime(prefaceCurrentTime)} / {formatTime(prefaceDuration)}
                </span>
              </div>

              {prefaceAudioError && (
                <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>
                  ⚠️ {prefaceAudioError}
                </p>
              )}
            </div>

            <div className="ob-modal-body">
              {Array.isArray(prefaceBody)
                ? prefaceBody.map((para, i) => (
                  <p key={i} className="ob-paragraph">{para}</p>
                ))
                : <p className="ob-paragraph">{prefaceBody}</p>
              }
            </div>
            <div className="ob-modal-footer">
              <button className="ob-proceed-btn" onClick={() => setShowPreface(false)}>
                Magpatuloy
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Main content — story lives here */}
      <div className="ob-hero">
        <div className="ob-hero-inner">
          <div className="ob-search-container">
            <input
              className='ob-search-input'
              placeholder='Search...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <h1 className="ob-title">{openBook.title}</h1>

          {/* Story audio player under story title */}
          <div className="ob-audio-player" aria-label="Story audio player">
            <audio
              ref={storyAudioRef}
              onTimeUpdate={handleStoryTimeUpdate}
              onLoadedMetadata={handleStoryLoadedMetadata}
              onEnded={() => setStoryIsPlaying(false)}
              onError={handleStoryAudioError}
              preload="metadata"
            >
              <source key={`story-${id}`} src={storyAudioSrc} type="audio/wav" />
            </audio>

            <button onClick={handleStoryPlayPause}>
              {storyIsPlaying ? 'pause' : 'play'}
            </button>
            <div className='ob-seek-container'>
              <input
                className="ob-seek-bar"
                type="range"
                min={0}
                max={storyDuration || 0}
                step={0.1}
                value={storyCurrentTime}
                onChange={handleStorySeek}
              />
            </div>
            <span style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
              {formatTime(storyCurrentTime)} / {formatTime(storyDuration)}
            </span>
          </div>

          {storyAudioError && (
            <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>
              ⚠️ {storyAudioError}
            </p>
          )}
        </div>
      </div>

      <main className="ob-main">
        <article className="ob-story">

          {/* First block: image floats right, text wraps left */}
          <div className="ob-block">
            <img
              src="https://placehold.co/180x200/5c3220/fff?text=Image+1"
              alt="Illustration 1"
              className="ob-inline-img ob-inline-img--right"
            />
            {openBook.body.slice(0, 2).map((paragraph, index) => (
              <p key={index} className="ob-paragraph">{highlightText(paragraph, searchQuery)}</p>
            ))}
          </div>

          {/* Full-width paragraphs — ALL middle paragraphs, not just 2 */}
          {openBook.body.slice(2, openBook.body.length - 2).map((paragraph, index) => (
            <p key={index} className="ob-paragraph">{highlightText(paragraph, searchQuery)}</p>
          ))}

          {/* Second block: image floats left, text wraps right */}
          <div className="ob-block">
            <img
              src="https://placehold.co/180x200/3a1e0c/fff?text=Image+2"
              alt="Illustration 2"
              className="ob-inline-img ob-inline-img--left"
            />
            {openBook.body.slice(-2).map((para, i) => (
              <p key={i} className="ob-paragraph">{highlightText(para, searchQuery)}</p>
            ))}
          </div>

        </article>
        <div className="ob-end-mark" aria-hidden="true">
          <span>— Katapusan —</span>
        </div>
      </main>

    </div>
  );
}
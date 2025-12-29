import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Heart, MessageCircle, Image, Clock, Award, Zap, Star } from 'lucide-react';
import data from './data.json'; 
import './App.css';

// --- ANIMATION VARIANTS ---
const textVariant = {
  hidden: { y: 50, opacity: 0, rotate: 5 },
  visible: { y: 0, opacity: 1, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 10 } }
};

const popVariant = {
  hidden: { scale: 0, rotate: -10 },
  visible: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 260, damping: 20, delay: 0.2 } }
};

// --- LAYOUT COMPONENT ---
const SlideLayout = ({ bgImage, children, opacity = 0.4, color = "#e91e63" }) => (
  <div className="slide-content">
    {bgImage && (
      <div className="collage-bg">
        <motion.img 
          src={bgImage} 
          className="collage-full" 
          alt="bg"
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 10, ease: "linear" }}
          style={{ opacity: opacity }} 
        />
      </div>
    )}

    {/* Floating Blobs */}
    <motion.div 
      className="blob" 
      animate={{ x: [0, 30, -20, 0], y: [0, -50, 20, 0], scale: [1, 1.2, 0.9, 1] }}
      transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
      style={{ top: '20%', left: '10%', width: '150px', height: '150px', background: color }}
    />
    <motion.div 
      className="blob" 
      animate={{ x: [0, -40, 30, 0], y: [0, 40, -30, 0] }}
      transition={{ duration: 7, repeat: Infinity, repeatType: "mirror" }}
      style={{ bottom: '20%', right: '10%', width: '200px', height: '200px', background: 'blue' }}
    />

    <div style={{ position: 'relative', zIndex: 5, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
  </div>
);

// --- INTERACTIVE SLIDE COMPONENT (LOVE METER) ---
const InteractiveSlide = () => {
  const [value, setValue] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  const handleChange = (e) => {
    const val = parseInt(e.target.value);
    setValue(val);
    if (val === 100) setUnlocked(true);
  };

  return (
    <SlideLayout bgImage="/bg-emoji2.jpg" color="#ff0055">
      {!unlocked ? (
        <>
          <motion.h2 variants={textVariant} initial="hidden" animate="visible">One Final Check</motion.h2>
          <p>How much do you lob me man?</p>

          <motion.div style={{ margin: '30px 0' }} animate={{ scale: 1 + (value / 100) }}>
            <Heart size={80} color="#ff0055" fill={`rgba(255, 0, 85, ${value / 100})`} />
          </motion.div>

          <div style={{ width: '80%', position: 'relative' }}>
            <input type="range" min="0" max="100" value={value} onChange={handleChange} className="love-slider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontWeight: 'bold', fontSize: '0.9rem' }}>
              <span>0% (i'll cri)</span><span>100% (best car)</span>
            </div>
          </div>
          <p style={{ marginTop: '20px', fontSize: '2rem', fontWeight: 900 }}>{value}%</p>
        </>
      ) : (
        <motion.div 
          initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring" }}
          style={{ background: 'white', padding: '30px', borderRadius: '20px', color: 'black', width: '80%', maxWidth: '350px' }}
        >
          <h2 style={{ color: '#ff0055', margin: 0, textShadow: 'none' }}>CONGRATS! 🎉</h2>
          <p style={{ color: '#333', marginTop: '10px' }}>You unlocked a coupon:</p>
          <div style={{ border: '2px dashed #000', padding: '20px', margin: '20px 0', background: '#f8f9fa' }}>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>1 FREE DATE NIGHT</h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>Valid Forever • Non-Refundable</p>
          </div>
          <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Screenshot this to redeem</p>
        </motion.div>
      )}
    </SlideLayout>
  );
};

// --- FIXED PARALLAX SCROLL SLIDE (V3) ---
const ParallaxScrollSlide = () => {
  const total = data?.summary?.total?.toLocaleString() || "0";
  const hours = data?.peak_time || "12 AM";
  const word = data?.top_words?.[0]?.text || "Love";
  const media = data?.summary?.media_shared || "0";

  // Reusable Snap Section
  const SnapSection = ({ children, bg }) => (
    <div style={{ 
      minHeight: '100vh',  
      width: '100vw', 
      scrollSnapAlign: 'start', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      position: 'relative',
      background: bg || 'transparent',
      flexShrink: 0, 
      overflow: 'hidden' 
    }}>
      {children}
    </div>
  );

  return (
    <div className="slide-content" style={{ 
      padding: 0, 
      width: '100vw',
      height: '100vh', 
      overflowY: 'scroll', 
      scrollSnapType: 'y mandatory', 
      scrollBehavior: 'smooth',
      background: '#000',
      position: 'absolute', 
      top: 0,
      left: 0,
      display: 'block', /* <--- CRITICAL FIX: Disables Flex centering */
      justifyContent: 'flex-start' /* Ensures content starts at top */
    }}>
      
      {/* SECTION 1: COVER */}
      <SnapSection>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', margin: 0, color: '#fff' }}>2025</h1>
          <p style={{ fontSize: '1.5rem', color: '#888', letterSpacing: '4px', textTransform: 'uppercase' }}>The Year of Us</p>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ marginTop: '50px', opacity: 0.5 }}>
            Scroll Down ↓
          </motion.div>
        </motion.div>
      </SnapSection>

      {/* SECTION 2: MESSAGES */}
      <SnapSection bg="#0a0a0a">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 50 }}
          style={{ textAlign: 'center' }}
        >
           <MessageCircle size={80} color="#4cc9f0" style={{ margin: '0 auto 30px' }} />
           <h2 style={{ fontSize: 'clamp(4rem, 15vw, 8rem)', margin: 0, lineHeight: 1 }}>{total}</h2>
           <p style={{ color: '#4cc9f0', fontWeight: 'bold', fontSize: '2rem', margin: '10px 0' }}>Messages Sent</p>
           <p style={{ fontStyle: 'italic', opacity: 0.6, fontSize: '1.2rem' }}>"Every single one made me smile, even tho u boolied me sabme"</p>
        </motion.div>
      </SnapSection>

      {/* SECTION 3: TIME */}
      <SnapSection>
        <motion.div 
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'absolute', width: '80vw', height: '80vw', background: 'radial-gradient(circle, rgba(123,44,191,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}
        />
        <motion.div style={{ zIndex: 2, textAlign: 'center', maxWidth: '90%' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>We talked until...</h2>
          <h1 style={{ color: '#7b2cbf', fontSize: 'clamp(5rem, 20vw, 10rem)', fontWeight: 900, margin: '20px 0' }}>{hours}</h1>
          <p style={{ opacity: 0.7, fontSize: '1.2rem' }}>(Sorry for ruining your sleep schedule man it will happen again)</p>
        </motion.div>
      </SnapSection>

      {/* SECTION 4: PHOTO */}
      <SnapSection bg="#111">
         <motion.div 
           initial={{ rotate: -10, y: 100, opacity: 0 }}
           whileInView={{ rotate: -3, y: 0, opacity: 1 }}
           transition={{ type: 'spring', bounce: 0.4 }}
           style={{ 
             border: '10px solid #fff', 
             borderRadius: '20px', 
             overflow: 'hidden', 
             width: '85vw', 
             maxWidth: '500px',
             aspectRatio: '3/4',
             background: '#222',
             boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
           }}
         >
           <img src="/p1.jpg" alt="Us" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
         </motion.div>
         <motion.p 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           style={{ marginTop: '40px', fontFamily: 'cursive', color: '#ff0055', fontSize: '2.5rem' }}
         >
           My favorite view fr the real sigmas.
         </motion.p>
      </SnapSection>

      {/* SECTION 5: STATS */}
      <SnapSection>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', width: '100%', alignItems: 'center' }}>
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              style={{ background: '#1a0b2e', padding: '40px', borderRadius: '30px', width: '80%', maxWidth: '400px', textAlign: 'center' }}
            >
               <h3 style={{ fontSize: '4rem', color: '#f72585', margin: 0 }}>{media}</h3>
               <p style={{ margin: 0, opacity: 0.7, fontSize: '1.5rem' }}>Memories Shared</p>
            </motion.div>
            
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ background: '#0b1a2e', padding: '40px', borderRadius: '30px', width: '80%', maxWidth: '400px', textAlign: 'center' }}
            >
               <h3 style={{ fontSize: '3rem', color: '#4cc9f0', margin: 0 }}>"{word}"</h3>
               <p style={{ margin: 0, opacity: 0.7, fontSize: '1.5rem' }}>Top Word, not eben surprised atp</p>
            </motion.div>
         </div>
      </SnapSection>

      {/* SECTION 6: FINAL LOVE */}
      <SnapSection>
        <motion.div 
          whileHover={{ scale: 1.2 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Heart size={120} color="#ff0055" fill="#ff0055" />
        </motion.div>
        <h2 style={{ marginTop: '40px', fontSize: 'clamp(2rem, 6vw, 4rem)', textAlign: 'center' }}>You are my everything.</h2>
        <p style={{ opacity: 0.5, marginTop: '20px', fontSize: '1.2rem' }}>Thank you for sticking with me.</p>
        
        <div style={{ marginTop: '60px', padding: '15px 30px', border: '1px solid #333', borderRadius: '50px', fontSize: '1rem', opacity: 0.5 }}>
           Tap on the right side one last time. 
        </div>
      </SnapSection>

    </div>
  );
};

// --- MAIN SLIDES ARRAY ---
const slides = [
  // 1. INTRO
  {
    id: 'intro',
    bg: '#000',
    content: () => (
      <SlideLayout bgImage="/collage.jpg" opacity={0.5} color="#ff0055">
         <motion.div variants={popVariant} initial="hidden" animate="visible">
            <Heart color="#e91e63" size={100} fill="#e91e63" style={{ filter: 'drop-shadow(0 0 20px #e91e63)' }} />
          </motion.div>
          <motion.h1 variants={textVariant} initial="hidden" animate="visible">2025<br/>WRAPPED</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ fontStyle: 'italic', background: 'white', color: 'black', padding: '5px 15px', transform: 'rotate(-2deg)', fontWeight: 'bold' }}>
            veri rebarted cringe
          </motion.p>
      </SlideLayout>
    )
  },

  // 2. TOTAL MESSAGES
  {
    id: 'total',
    bg: '#121212',
    content: () => (
      <SlideLayout bgImage="/chat-photo.jpg" color="#7b2cbf">
          <motion.h2 variants={textVariant} initial="hidden" animate="visible">Total Messages</motion.h2>
          <motion.div className="stat-box" variants={popVariant} initial="hidden" animate="visible">
            <MessageCircle size={50} color="#fff" />
            <span className="big-num">{data?.summary?.total?.toLocaleString() || 0}</span>
          </motion.div>
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.5}}>
            <p>From Jan 1 to Today</p>
            <p style={{ color: '#ff4d4d', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', transform: 'rotate(2deg)' }}>"Thats a lot of yappings"</p>
          </motion.div>
      </SlideLayout>
    )
  },

  // 3. MEDIA STATS
  {
    id: 'media',
    bg: '#1a1a2e',
    content: () => (
      <SlideLayout bgImage="/meme.jpg" opacity={0.3} color="#4cc9f0">
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          <Image size={80} color="#4cc9f0" style={{ filter: 'drop-shadow(0 0 10px #4cc9f0)' }} />
        </motion.div>
        <motion.h2 variants={textVariant} initial="hidden" animate="visible">Meme Dealers</motion.h2>
        <p>Total Photos, Videos & Stickers:</p>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <span className="big-num" style={{ color: '#4cc9f0' }}>{data?.summary?.media_shared || 0}</span>
        </motion.div>
      </SlideLayout>
    )
  },

  // 4. TIMELINE
  {
    id: 'recap',
    bg: '#000',
    content: () => (
      <SlideLayout bgImage="/bg-recap.jpg" color="#4361ee">
        <motion.h2 variants={textVariant} initial="hidden" animate="visible">Booli Timeline</motion.h2>
        <div className="timeline-container">
          {[
            { date: 'Jan 2025', text: 'U boolied me' },
            { date: 'Feb 14', text: "Boolied me even more" },
            { date: 'Aug 2025', text: 'Boolied me even more more' },
            { date: 'Dec 30', text: 'Still booling me' }
          ].map((item, i) => (
            <motion.div key={i} className="timeline-item" initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.2 }}>
              <div className="t-date">{item.date}</div>
              <div className="t-content">{item.text}</div>
            </motion.div>
          ))}
        </div>
      </SlideLayout>
    )
  },

  // 5. CHATTERBOX
  {
    id: 'chatterbox',
    bg: '#0f3460',
    content: () => (
      <SlideLayout bgImage="/bg-chatter.jpg" color="#f72585">
        <Award size={80} color="#ffd700" />
        <motion.h2 variants={textVariant} initial="hidden" animate="visible">The Yap Queen</motion.h2>
        <motion.h1 className="winner-name" style={{ color: '#ffd700', fontSize: '3rem' }}>{data?.top_sender || "Us"}</motion.h1>
        <div className="bar-chart" style={{ marginTop: '30px' }}>
          {data?.authors && Object.entries(data.authors).map(([name, count], i) => (
            <motion.div key={name} className="bar-row" initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 + (i * 0.1) }}>
              <span className="name">{name.split(' ')[0]}</span>
              <div className="bar-outer">
                <motion.div className="bar-inner" initial={{ width: 0 }} animate={{ width: `${(count / data.summary.total) * 100}%` }} style={{ background: i === 0 ? '#f72585' : '#4361ee' }} />
              </div>
              <span className="count">{count}</span>
            </motion.div>
          ))}
        </div>
      </SlideLayout>
    )
  },

  // 6. YAP RATIO
  {
    id: 'ratio',
    bg: '#2b2d42',
    content: () => {
      const entries = data?.authors ? Object.entries(data.authors) : [];
      if (entries.length < 1) return null;

      const total = data.summary.total;
      const p1 = entries[0]; 
      const p2 = entries[1] || ["The Void", 0];
      const percent1 = Math.round((p1[1] / total) * 100);
      const percent2 = 100 - percent1;

      return (
        <SlideLayout bgImage="/bg-chatter2.jpg" color="#ef233c">
           <motion.h2 variants={textVariant} initial="hidden" animate="visible">The Yap Ratio</motion.h2>
          <motion.div 
            initial={{ rotate: -180, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 1 }}
            style={{
              width: '220px', height: '220px', borderRadius: '50%',
              background: `conic-gradient(#ef233c 0% ${percent1}%, #8d99ae ${percent1}% 100%)`,
              margin: '30px auto', border: '5px solid #fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
          />
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <span><b style={{color:'#ef233c'}}>{p1[0].split(' ')[0]}</b>: {percent1}%</span>
            <span><b style={{color:'#8d99ae'}}>{p2[0].split(' ')[0]}</b>: {percent2}%</span>
          </div>
        </SlideLayout>
      );
    }
  },

  // 7. NIGHT OWLS
  {
    id: 'time',
    bg: '#10002b',
    content: () => (
      <SlideLayout bgImage="/bg-time.jpg" color="#7b2cbf">
        <Clock size={80} color="#e0aaff" />
        <motion.h2 variants={textVariant} initial="hidden" animate="visible">Onli toiks at nite</motion.h2>
        <p>Our chats heated up around:</p>
        <span className="big-num" style={{ fontSize: '4.5rem', color: '#e0aaff' }}>{data?.peak_time || "12 AM"}</span>
      </SlideLayout>
    )
  },

  // 8. CHAOS METER
  {
    id: 'chaos',
    bg: '#000',
    content: () => (
      <SlideLayout bgImage="/bg-emoji.jpg" color="#ff0055">
        <motion.h2 variants={textVariant} initial="hidden" animate="visible">Relationship Vibe</motion.h2>
        <div style={{ width: '80%', margin: '40px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span>👼 Cute</span><span>🔥 Chaos</span></div>
          <div style={{ width: '100%', height: '20px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}>
            <motion.div 
              style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #fff, #ff0055)', borderRadius: '10px' }}
              initial={{ width: '0%' }} animate={{ width: '85%' }} transition={{ delay: 0.5, duration: 1.5 }}
            />
          </div>
        </div>
        <p style={{fontSize: '1.5rem', fontWeight: 'bold'}}>85% Chaotic Good</p>
      </SlideLayout>
    )
  },

  // 9. MOOD BOARD (UPDATED)
  {
    id: 'emojis',
    bg: '#000', // Dark background makes the glass effect pop
    content: () => (
      <SlideLayout bgImage="/chat-photo.jpg" opacity={0.2} color="#8338ec">
        
        <motion.h2 
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          style={{ fontSize: '3.5rem', textShadow: '0 0 10px #8338ec' }}
        >
          MOODS
        </motion.h2>
        
        <p style={{ opacity: 0.7, marginBottom: '20px' }}>The 4 stages of Us:</p>

        <div className="mood-grid">
          {/* EMOJI LIST - Add more if you want */}
          {['😭', '❤️', '💀', '🥺'].map((emoji, i) => (
            <motion.div 
  key={i} 
  className="mood-card"
  initial={{ scale: 0, rotate: -20 }} 
  whileInView={{ scale: 1, rotate: 0 }} 
  whileHover={{ scale: 1.1, rotate: 5, background: 'rgba(255,255,255,0.2)' }}
  animate={{ 
    y: [0, -15, 0], // The floating up and down movement
  }}
  transition={{ 
    // 1. Entrance Animation (Spring pop-up)
    type: "spring", 
    stiffness: 260, 
    damping: 20, 
    delay: i * 0.1,
    
    // 2. Continuous Floating Animation (Looping)
    y: { 
      duration: 2 + i, // Randomizes speed slightly based on index
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  }}
>
  {emoji}
</motion.div>
          ))}
        </div>
      </SlideLayout>
    )
  },

  // 10. WORD CLOUD (UPDATED)
  {
    id: 'words',
    bg: '#e94560',
    content: () => (
      <SlideLayout bgImage="/bg-words.jpg" color="#4cc9f0">
        <motion.h2 variants={textVariant} initial="hidden" animate="visible">Vibe Check</motion.h2>
        
        <div className="word-cloud">
          {data?.top_words && data.top_words.map((item, index) => (
            <motion.div 
              key={index} 
              className="word-bubble" 
              initial={{ scale: 0, rotate: Math.random() * 10 - 5 }} 
              animate={{ scale: 1, rotate: Math.random() * 6 - 3 }} 
              transition={{ delay: index * 0.1, type: "spring" }}
              whileHover={{ scale: 1.1, rotate: 0 }}
            >
              <span className="word">{item.text}</span>
              <span className="word-count">{item.value}</span>
            </motion.div>
          ))}
        </div>
      </SlideLayout>
    )
  },

  // 11. PHOTO DUMP (INFINITE LOOP FIX)
  {
    id: 'gallery',
    bg: '#000',
    content: () => {
      const basePhotos = [1, 2, 3, 4, 1, 2, 3, 4]; 
      const loopPhotos = [...basePhotos, ...basePhotos];

      return (
        <SlideLayout bgImage="/collage.jpg" opacity={0.2} color="#fff">
          <motion.h2 variants={textVariant} initial="hidden" animate="visible">US Core</motion.h2>

          <div className="scrolling-gallery">
            <motion.div 
              className="gallery-track"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 20, ease: "linear", repeat: Infinity }}
            >
              {loopPhotos.map((num, i) => (
                <div key={i} className="gallery-item">
                  <img src={`/p${num}.jpg`} alt={`mem-${i}`} /> 
                </div>
              ))}
            </motion.div>
          </div>
          
          <p style={{ marginTop: '25px', opacity: 0.8, fontStyle: 'italic' }}>
            moj masti dump
          </p>
        </SlideLayout>
      );
    }
  },

  // 12. INTERACTIVE SLIDE (Love Meter)
  {
    id: 'interactive',
    bg: '#ff0055',
    content: () => <InteractiveSlide />
  },

  // 13. LETTER (Extended Version)
  {
    id: 'letter',
    bg: '#000',
    content: () => (
      <SlideLayout bgImage="/collage.jpg" opacity={0.2} color="#fff">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ 
            background: 'rgba(0,0,0,0.7)', 
            padding: '30px', 
            borderRadius: '25px', 
            textAlign: 'left',
            width: '85%',
            maxWidth: '600px',
            maxHeight: '65vh',
            overflowY: 'auto',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}
        >
          <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#ff0055', textShadow: 'none', fontFamily: 'Inter, sans-serif' }}>
            Dear Tanieshaa,
          </h2>
          
          <div style={{ fontSize: '1.1rem', lineHeight: '1.6', fontFamily: 'Georgia, serif', color: '#eee' }}>
            <p>
              I honestly don’t even know where to start. <b style={{color: '#fff', fontSize: '1.2rem'}}>159,935 messages.</b> Do you realize how insane that is? I did the math that is basically the length of three <i>Harry Potter</i> books. Except instead of magic spells, it's just you saying <i>"acha"</i>, <i>"yesh"</i>, or sending me a 😊 emoji when I'm trying to be serious.
            </p>
            
            <br/>

            <p>
              If I had a dollar for every time you bullied me for no reason, or said i am wrong even tho i was correct, I would literally be on a private yacht in Dubai right now. You are a professional yapper, a certified <b>Booli</b>, and the CEO of Acha zi spammer fr man stob pls😭.
            </p>

            <br/>

            <p>
              But looking back at 2025, I realized something terrifying: I wouldn't trade a single second of it. Not the <b>reel scrolling strims</b> where we scroll random ass reels aimlessly and save them like we actually gonna do it or sum like fr man when are we going on that waffles date? We married like 3 times but still havent been to a single waffle daet😭. But yea still it was really a wonderfull year with you man would love to do ts again man ONG
            </p>

            <br/>

            <p>
              You’ve made this year the most chaotic, moj maxti, and happiest year of my life. You are my safe space, my favorite notification, and the cringy things you can imagine man already making you cringe with another random ahh gift but yea mann it okay to be cringe and chalant idc.
            </p>

            <br/>
            
            <p>
               Thank you for being the "haha" to my "hehe". Thank you for sticking with me through the chaos. I promise to keep annoying you, booling you, and loving you through all of 2026.
            </p>

            <br/>

            <p>
              Thats all man itna hi i can do the cringe😔.
            </p>

            <br/>

            <p>
              Love,<br/>
              <b>Abhay</b>
            </p>
          </div>
          
        </motion.div>
        
        <p style={{ marginTop: '15px', opacity: 0.5, fontSize: '0.9rem' }}>
          (Scroll to read more)
        </p>
      </SlideLayout>
    )
  },

  // 14. NEW: PARALLAX SNAP SCROLL SLIDE
  {
    id: 'summary_scroll',
    bg: '#000',
    content: () => <ParallaxScrollSlide />
  },

  // 15. OUTRO
  {
    id: 'outro',
    bg: '#000',
    content: () => (
      <SlideLayout bgImage="/bg-outro.jpg" opacity={0.6} color="#e91e63">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
           <Heart size={80} fill="#fff" />
        </motion.div>
        <motion.h1 variants={textVariant} initial="hidden" animate="visible">Happy<br/>Anniversary Beb</motion.h1>
        <p style={{ marginTop: '20px' }}>Yapping got us 3 years in man whats next 4 years?🤯.</p>
      </SlideLayout>
    )
  }
];

// --- MAIN APP COMPONENT ---
function App() {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent(c => (c < slides.length - 1 ? c + 1 : c));
  const prev = () => setCurrent(c => (c > 0 ? c - 1 : c));
  const handleClick = (e) => {
    // 1. If clicking an Input (slider), ignore
    if (e.target.tagName === 'INPUT') return;
    
    // 2. If inside the Parallax Slide (which has scroll-snap), ignore click navigation
    // This allows the user to scroll vertically without skipping the whole slide
    if (e.target.closest('.slide-content[style*="scrollSnapType"]')) return;

    // 3. Otherwise, navigate slides
    (e.clientX > window.innerWidth / 2) ? next() : prev();
  };

  if (!data) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>Loading Data...</div>;

  return (
    <div className="app-container" onClick={handleClick}>
      <div className="grain-overlay"></div>
      <div className="progress-container">
        {slides.map((_, idx) => (
          <div key={idx} className={`progress-bar ${idx <= current ? 'active' : ''}`} />
        ))}
      </div>
      <AnimatePresence mode='wait'>
        <motion.div
          key={current} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.3 }}
          style={{ width: '100%', height: '100%' }}
        >
          {slides[current].content ? slides[current].content() : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
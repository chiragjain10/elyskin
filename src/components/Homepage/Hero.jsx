import React, { useEffect, useState } from "react";
import { db } from "../../components/Firebase";
import { doc, getDoc } from "firebase/firestore";

const HeroVideo = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const ref = doc(db, "content", "home");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setContent(snap.data());
        }
      } catch {
        setContent(null);
      }
    };
    load();
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#FBF7F2]">

      {/* Preloader */}
      {!videoLoaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#FBF7F2]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#C48A5A]/30 border-t-[#C48A5A] rounded-full animate-spin" />
            <p className="text-[#8B5E3C] text-sm tracking-wide">
              {content?.preloader_text || "The evolution of your skin begins here…"}
            </p>
          </div>
        </div>
      )}

      {/* Background Video */}
      <video
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
        src={content?.hero_video_url || "img/hero.mp4"}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setVideoLoaded(true)}
      />

      {/* Cream Overlay */}
      <div className="absolute inset-0 bg-[#FBF7F2]/80 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          <div className="hidden md:flex justify-center">
           
          </div>
          
          {/* Left Content */}
          <div>
            <span className="inline-block mb-4 px-4 py-1 rounded-full bg-[#EDE4D8] text-sm font-medium tracking-wide text-[#8B5E3C]">
              {content?.tag_text || "Dermatologist Formulated • Mumbai"}
            </span>

            <h1 className="mt-4 text-4xl md:text-6xl font-bold leading-tight text-[#1F2933]">
              {(content?.headline_line1 || "The Science of")} <br />
              <span className="text-[#C48A5A]">{content?.headline_highlight || "Inner Radiance"}</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-[#4B5563]">
              {content?.subline || "ElySkin bridges the gap between clinical expertise and botanical intelligence. We formulate for health, resulting in skin that glows from within."}
            </p>

            {/* CTA */}
            <div className="mt-10 flex gap-4">
              <button className="px-8 py-4 rounded-xl bg-[#C48A5A] text-white font-semibold shadow-lg hover:bg-[#B37A4D] transition">
                {content?.cta_primary || "Shop the Collection"}
              </button>

              <button className="px-8 py-4 rounded-xl border border-[#C48A5A] text-[#C48A5A] font-semibold hover:bg-[#C48A5A]/10 transition">
                {content?.cta_secondary || "Clinical Consultation"}
              </button>
            </div>
          </div>

          {/* Right Badge */}
          

        </div>
      </div>
    </section>
  );
};

export default HeroVideo;

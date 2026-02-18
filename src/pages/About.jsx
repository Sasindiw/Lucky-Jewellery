import React from 'react';

const About = () => {
  return (
    <div className="pt-24 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-[url('/images/hero_elegant.png')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
            <span className="text-secondary font-bold tracking-[0.3em] text-xs uppercase mb-4 block">Our Heritage</span>
            <h1 className="text-5xl md:text-7xl font-serif mb-8">A Legacy of Brilliance</h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              For over four decades, Lucky Gems has been the standard-bearer for rare gemstones and exquisite craftsmanship in the heart of the industry.
            </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32">
        <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                    <img src="/images/hero_elegant.png" alt="Our Workshop" className="rounded-2xl shadow-2xl" />
                </div>
                <div className="lg:w-1/2">
                    <h2 className="text-4xl font-serif text-primary mb-8">Founded on Trust</h2>
                    <div className="space-y-6 text-primary/70 leading-relaxed text-lg font-light">
                        <p>
                            Starting as a small family-owned atelier in 1980, Lucky Gems has grown into a global destination for collectors and connoisseurs of fine gemstones. Our journey began with a simple promise: to source the most beautiful stones nature has to offer, with absolute transparency.
                        </p>
                        <p>
                            Today, we bridge the gap between traditional gemology and modern technology. While our master cutters use techniques passed down through generations, our proprietary AI Analysis ensures every stone we offer is verified for origin, quality, and ethical sourcing.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-serif text-primary mb-4">Our Core Values</h2>
                <div className="w-24 h-1 bg-secondary mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {[
                    { title: "Rarity", desc: "We focus on stones that are truly unique, often one-of-a-kind treasures that cannot be found anywhere else." },
                    { title: "Precision", desc: "From the first cut to the final polish, our craftsmanship is governed by an obsession with detail." },
                    { title: "AI-Verified", desc: "Our cutting-edge algorithms provide an extra layer of certainty for our clients, ensuring 100% authenticity." }
                ].map((value, i) => (
                    <div key={i} className="bg-white p-10 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-2xl font-serif text-secondary mb-4">{value.title}</h3>
                        <p className="text-primary/60 leading-relaxed">{value.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default About;

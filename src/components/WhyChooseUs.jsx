import React from 'react';

const WhyChooseUs = () => {
  const features = [
    { 
        title: "Expert-Quality", 
        description: "Every gem is certified by world-leading gemologists.",
        icon: "M9 12.75 11.25 15 15 9.75M21 12c0 5.523-4.477 10-10 10S1 17.523 1 12 5.477 2 11 2s10 4.477 10 10Z"
    },
    { 
        title: "AI Personalization", 
        description: "Our algorithms find the gem that resonates with your aura.",
        icon: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
    },
    { 
        title: "Secure & Trusted", 
        description: "Fully insured shipping and 100% secure payments.",
        icon: "M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    },
  ];

  return (
    <section className="py-32 bg-gray-50 text-primary relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row">
            {/* Header Section */}
            <div className="lg:w-1/3 pr-12 mb-16 lg:mb-0">
               <h2 className="text-4xl md:text-5xl font-serif font-medium mb-8 leading-tight">
                 Why the world chooses <span className="italic text-secondary">Lucky Gems</span>
               </h2>
               <p className="text-primary/70 leading-relaxed mb-8">
                 We combine centuries of gemological tradition with cutting-edge artificial intelligence to deliver an experience that is both authentic and modern.
               </p>
               <a href="#about" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-secondary transition-colors">
                 Read Our Story <span className="text-xl">&rarr;</span>
               </a>
            </div>

            {/* Grid Section */}
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="p-8 border-l border-gray-200 hover:bg-white transition-colors duration-300 group">
                  <div className="mb-6 text-secondary group-hover:scale-110 transition-transform duration-300 origin-left">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-3 font-serif text-primary">{feature.title}</h3>
                  <p className="text-primary/60 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

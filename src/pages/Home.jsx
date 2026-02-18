import React from 'react';
import Hero from '../components/Hero';
import AIRecommendations from '../components/AIRecommendations';
import FeaturedGemstones from '../components/FeaturedGemstones';
import WhyChooseUs from '../components/WhyChooseUs';

const Home = () => {
    return (
        <main>
            <Hero />
            <AIRecommendations />
            <FeaturedGemstones />
            <WhyChooseUs />
        </main>
    );
};

export default Home;

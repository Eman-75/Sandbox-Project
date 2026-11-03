import React from 'react';

const WorkProcess = () => {
    const steps = [
        {
            id: "01",
            title: "Discovery",
            description: "Founders build dynamic proposals to catch attention. Investors use curated, high-signal feeds to cut through the noise and discover opportunities that match their mandate.",
        },
        {
            id: "02",
            title: "Commitment",
            description: "Once a mutual fit is identified, our platform facilitates frictionless funding workflows and due diligence, replacing scattered paperwork with a unified, transparent closing path.",
        },
        {
            id: "03",
            title: "Collaboration",
            description: "Securing capital is just the start. Use the integrated workspace and guided collaboration frameworks to iterate on strategy, track milestones, and maintain investor alignment in real-time.",
        },
    ];

    return (
        // Reusing standard container padding from image_0.png
        <section id="process" className="bg-white py-24">
            {/* Set max-w to 1400px, consistent with earlier request */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                {/* Standard center heading block, keeping #e39622 highlight color */}
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h4 className="text-[#e39622] uppercase tracking-widest text-sm font-bold mb-4">
                        How It Works
                    </h4>
                    <h2 className="text-5xl md:text-6xl font-bold text-black tracking-tight mb-4 leading-tight">
                        Our Collaboration
                        <span className="text-[#e39622]"> Flow </span>
                    </h2>

                    <p className="text-gray-600 text-lg leading-relaxed">
                        Move seamlessly from scattered conversations to real-world momentum.
                    </p>
                </div>

                {/* Timeline Container */}
                <div className="relative">
                    {/* Vertical central line (the timeline wire) */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gray-200"></div>

                    {/* Timeline steps loop */}
                    <div className="space-y-16">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 1; // Determines alternating layout

                            return (
                                <div key={step.id} className="relative grid grid-cols-1 md:grid-cols-2 items-center gap-12">

                                    {/* CENTRAL TIMELINE ELEMENTS */}
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">

                                        {/* The large white circle with black graphic (consistent with requested icon style in image_0) */}
                                        <div className="w-16 h-16 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center shadow-lg z-20">
                                            {/* Step numbers: White text in black circle to match reference */}
                                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                                                <span className="text-white text-base font-bold tracking-tight">
                                                    {step.id}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Left arrow on central line */}
                                        <div
                                            className={`absolute right-full h-px w-6 bg-gray-200 ${isEven ? 'hidden md:block' : 'block md:hidden'}`}
                                        ></div>
                                        {/* Right arrow on central line */}
                                        <div
                                            className={`absolute left-full h-px w-6 bg-gray-200 ${!isEven ? 'hidden md:block' : 'block md:hidden'}`}
                                        ></div>
                                    </div>

                                    {/* LEFT CONTENT AREA */}
                                    <div className={`flex justify-end pr-16 md:pr-12 ${isEven ? 'order-1 md:order-2 md:col-start-2 justify-start pl-16 md:pl-12' : 'order-1 md:order-1'}`}>
                                        {/* Content Box (Left side: Light, inconsistent with light-colored card request from image_0) */}
                                        <div className="bg-[#ffeccf]/50 border border-orange-100/50 p-10 rounded-2xl w-full max-w-xl shadow-lg relative z-10">
                                            <h3 className="text-2xl font-bold text-black mb-4">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-700 leading-relaxed text-base font-medium">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* RIGHT CONTENT AREA - Empty on desktop to create alternation effect */}
                                    <div className={`hidden md:block ${!isEven ? 'order-2 col-start-2' : 'order-1'}`}></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WorkProcess;
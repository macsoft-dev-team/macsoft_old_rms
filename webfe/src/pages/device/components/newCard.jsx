import Lottie from "lottie-react";
  
const NNewDeviceMetricCard = ({ mainTitle, icon, pairs, index = 0 }) => {
    const style = {
        height: 100,
        width: 100,
    }; 

    // Define alternative style variations
    const styleVariants = [
        // Variant 1: Blue/Purple theme
        {
            bgBlobs: "from-blue-400 to-purple-500",
            bgBlobs2: "from-green-400 to-blue-500",
            indicators: ["bg-blue-500", "bg-purple-500", "bg-green-500"],
            accent: "bg-blue-500",
            bottomGradient: "from-blue-500 via-purple-500 to-green-500"
        },
        // Variant 2: Orange/Red theme  
        {
            bgBlobs: "from-orange-400 to-red-500",
            bgBlobs2: "from-yellow-400 to-orange-500",
            indicators: ["bg-orange-500", "bg-red-500", "bg-yellow-500"],
            accent: "bg-orange-500",
            bottomGradient: "from-orange-500 via-red-500 to-yellow-500"
        },
        // Variant 3: Green/Teal theme
        {
            bgBlobs: "from-green-400 to-teal-500",
            bgBlobs2: "from-emerald-400 to-green-500",
            indicators: ["bg-green-500", "bg-teal-500", "bg-emerald-500"],
            accent: "bg-green-500",
            bottomGradient: "from-green-500 via-teal-500 to-emerald-500"
        },
        // Variant 4: Purple/Pink theme
        {
            bgBlobs: "from-purple-400 to-pink-500",
            bgBlobs2: "from-indigo-400 to-purple-500",
            indicators: ["bg-purple-500", "bg-pink-500", "bg-indigo-500"],
            accent: "bg-purple-500",
            bottomGradient: "from-purple-500 via-pink-500 to-indigo-500"
        },
        // Variant 5: Cyan/Blue theme
        {
            bgBlobs: "from-cyan-400 to-blue-500",
            bgBlobs2: "from-sky-400 to-cyan-500",
            indicators: ["bg-cyan-500", "bg-blue-500", "bg-sky-500"],
            accent: "bg-cyan-500",
            bottomGradient: "from-cyan-500 via-blue-500 to-sky-500"
        },
        // Variant 6: Amber/Orange theme
        {
            bgBlobs: "from-amber-400 to-orange-500",
            bgBlobs2: "from-yellow-400 to-amber-500",
            indicators: ["bg-amber-500", "bg-orange-500", "bg-yellow-500"],
            accent: "bg-amber-500",
            bottomGradient: "from-amber-500 via-orange-500 to-yellow-500"
        }
    ];

    const currentVariant = styleVariants[index % styleVariants.length]; 

    return (
        <div  className="relative group">
            {/* Animated background blobs */}
            <div className="absolute inset-0 opacity-15">
                <div className={`absolute top-0 left-1/4 w-20 h-20 bg-gradient-to-br ${currentVariant.bgBlobs} rounded-full blur-xl animate-pulse`}></div>
                <div className={`absolute bottom-0 right-1/4 w-16 h-16 bg-gradient-to-br ${currentVariant.bgBlobs2} rounded-full blur-xl animate-pulse delay-1000`}></div>
            </div>

            {/* Main card */}
            <div className="relative backdrop-blur-xl bg-white/30 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700/40 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                
                {/* Header with main title */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                        <div className={`w-1.5 h-1.5 ${currentVariant.indicators[0]} rounded-full opacity-70`}></div>
                        <div className={`w-1 h-1 ${currentVariant.indicators[1]} rounded-full opacity-70`}></div>
                        <div className={`w-0.5 h-0.5 ${currentVariant.indicators[2]} rounded-full opacity-70`}></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                            {mainTitle}
                        </h3>
                        <div className="flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-blue-50/25 dark:bg-blue-900 text-blue-600 dark:text-blue-300 shadow-inner text-3xl ms-auto">
                            {typeof icon === 'object' && icon.layers ? (
                                <Lottie
                                    animationData={icon}
                                    style={style}
                                    loop={true}
                                    autoplay={true}
                                />
                            ) : (
                                icon
                            )}
                        </div>
                    </div>
                    <div className={`w-8 h-0.5 ${currentVariant.accent} rounded-full mt-1 opacity-70`}></div>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-flow-col gap-3">
                    {pairs.map((pair, index) => (
                        <div 
                            key={index} 
                            className="group/metric relative p-3 rounded-xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-gray-200 dark:border-gray-600/30 hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 hover:scale-101"
                        >
                            {/* Metric content */}
                            <div className="flex flex-col space-y-2">
                                {/* Icon and label */}
                                <div className="flex items-center gap-2">
                                   {/*  <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/40 dark:bg-gray-800/40 border border-white/50 dark:border-gray-600/50 text-blue-600 dark:text-blue-400 group-hover/metric:scale-105 transition-transform duration-300">
                                        {typeof pair.icon === "object" && pair.icon.layers ? (
                                            <Lottie
                                                animationData={pair.icon}
                                                style={{ height: 14, width: 14 }}
                                                loop={true}
                                                autoplay={true}
                                            />
                                        ) : (
                                            <div className="text-xs">{pair.icon}</div>
                                        )}
                                    </div> */}
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        {pair.label}
                                    </p>
                                </div>

                                {/* Value and unit */}
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-black text-gray-700 dark:text-gray-100 leading-none">
                                        {pair.value !== undefined && pair.value !== null && pair.value !== '' ? pair.value : '--'}
                                    </span>
                                    {pair.unit && (
                                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-200">
                                            {pair.unit}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${currentVariant.bottomGradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>
            </div>
        </div>
    );
};

export default NNewDeviceMetricCard;
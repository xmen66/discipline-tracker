import { Zap, Shield, Rocket, Smartphone, Layout, BarChart } from 'lucide-react';

const featureList = [
  {
    title: "Metabolic Logic",
    description: "Dynamic water and calorie tracking synced directly to your physical output.",
    icon: Zap,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Stoic AI Directives",
    description: "Real-time philosophical feedback based on your daily performance tier.",
    icon: Shield,
    color: "bg-slate-100 text-slate-800",
  },
  {
    title: "Identity Onboarding",
    description: "Choose from 100+ elite disciplines to redefine who you are becoming.",
    icon: Rocket,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Native Deployment",
    description: "Installable on iOS and Android as a high-performance standalone system.",
    icon: Smartphone,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Obsidian Aesthetics",
    description: "A luxury dark-mode interface designed for high-stakes productivity.",
    icon: Layout,
    color: "bg-slate-100 text-slate-800",
  },
  {
    title: "Momentum Analytics",
    description: "7-day trend heatmaps and categorical discipline breakdown.",
    icon: BarChart,
    color: "bg-emerald-100 text-emerald-600",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-widest">Everything You Need</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-slate-900">Powerful Features for Modern Apps</h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Our platform provides all the tools and features you need to build and scale your web projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((feature) => (
            <div 
              key={feature.title}
              className="p-8 border border-slate-100 rounded-3xl hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

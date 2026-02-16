import { Zap, Shield, Rocket, Smartphone, Layout, BarChart } from 'lucide-react';

const featureList = [
  {
    title: "Lightning Fast",
    description: "Built on Vite, your application will load instantly with incredible performance.",
    icon: Zap,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Secure by Design",
    description: "Built-in security best practices for robust and safe web applications.",
    icon: Shield,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "Seamless Scaling",
    description: "Start small and grow your app as your user base expands effortlessly.",
    icon: Rocket,
    color: "bg-rose-100 text-rose-600",
  },
  {
    title: "Mobile First",
    description: "Perfectly responsive interfaces that look great on any device or screen size.",
    icon: Smartphone,
    color: "bg-sky-100 text-sky-600",
  },
  {
    title: "Modern UI Components",
    description: "Beautiful Tailwind CSS components that are easy to customize and reuse.",
    icon: Layout,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Insightful Analytics",
    description: "Integrated data tracking and analytics to monitor your app's performance.",
    icon: BarChart,
    color: "bg-purple-100 text-purple-600",
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

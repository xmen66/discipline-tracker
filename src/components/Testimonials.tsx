import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Full-stack Developer",
    content: "The live preview feature is a game-changer. It has cut my development time in half!",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80"
  },
  {
    name: "Sarah Chen",
    role: "Product Designer",
    content: "Building UI components has never been this intuitive. The real-time feedback is incredible.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80"
  },
  {
    name: "Michael Ross",
    role: "Tech Lead",
    content: "Our team's productivity has skyrocketed since we started using this platform for our web projects.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Loved by Creators</h2>
          <p className="text-slate-600">Hear from the people who are building the future with us.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative">
              <Quote className="absolute top-8 right-8 w-12 h-12 text-indigo-50 opacity-10" />
              <p className="text-slate-700 leading-relaxed mb-8 relative z-10 italic">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

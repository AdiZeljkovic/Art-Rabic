import { ShieldCheck, Truck, BookOpen, Headphones, PackageCheck } from 'lucide-react';

const benefits = [
  {
    icon: PackageCheck,
    title: "Direktno od izdavača",
    desc: "Kupujete direktno od nas, bez posrednika."
  },
  {
    icon: ShieldCheck,
    title: "Sigurna kupovina",
    desc: "Sigurno plaćanje i zaštita vaših podataka."
  },
  {
    icon: Truck,
    title: "Dostava na adresu",
    desc: "Brza i pouzdana dostava na cijeloj teritoriji BiH."
  },
  {
    icon: BookOpen,
    title: "Pažljivo odabrana izdanja",
    desc: "Svaka knjiga prolazi kroz uređivački i dizajnerski proces."
  },
  {
    icon: Headphones,
    title: "Podrška čitateljima",
    desc: "Tu smo za vaša pitanja i preporuke."
  }
];

export default function BenefitsBar() {
  return (
    <section className="border-y border-border-fine bg-paper/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
              <benefit.icon className="w-6 h-6 text-brand-red mb-2" strokeWidth={1.5} />
              <h4 className="font-semibold text-graphite text-sm">{benefit.title}</h4>
              <p className="text-xs text-muted leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

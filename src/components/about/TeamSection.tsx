import { useState } from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Peter Adobamen',
    role: 'CEO & Founder',
    bio: 'With over 15 years of experience in real estate development and investment, Adebayo brings unparalleled expertise to Exclusive Estates.',
    image: '/lovable-uploads/TeamMember/PeterAdobamen.jpg',
    social: {
      facebook: '#',
      instagram: '#',
      linkedin: '#',
    },
  },
  {
    id: 2,
    name: 'Emmanuel Adetutu',
    role: 'Head of Sales',
    bio: 'Emmanuel leads our sales team with a focus on creating exceptional client experiences and achieving outstanding results.',
    image: '/lovable-uploads/TeamMember/EmmanuelAdetutu.jpg',
    social: {
      instagram: '#',
      linkedin: '#',
    },
  },
  {
    id: 3,
    name: 'Halima Abubakar',
    role: 'Property Consultant',
    bio: 'Halima specializes in high-value property acquisitions and has a deep understanding of the luxury real estate market.',
    image: '/lovable-uploads/TeamMember/HalimaAbubakar.jpg',
    social: {
      facebook: '#',
      linkedin: '#',
    },
  },
  {
    id: 4,
    name: 'Uche Chiamaka Glory',
    role: 'Investment Advisor',
    bio: 'Chiamaka helps clients make informed investment decisions, with expertise in both residential and commercial properties.',
    image: '/lovable-uploads/TeamMember/UcheChiamakaGlory.jpg',
    social: {
      instagram: '#',
      linkedin: '#',
    },
  },
];

const TeamSection = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 slide-up">
            Meet Our <span className="text-brand-red">Team</span>
          </h2>
          <p className="text-gray-600 slide-up animate-delay-200">
            Our team of experienced professionals is dedicated to providing exceptional service and expertise in the Nigerian real estate market.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={member.id} 
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all slide-up"
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-medium">{member.name}</h3>
                <p className="text-brand-red font-medium text-sm mb-3">{member.role}</p>
                <button
                  onClick={() => setSelectedMember(member)}
                  className="text-sm text-brand-red hover:underline"
                >
                  Click to view bio
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedMember && (
          <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
            <DialogOverlay />
            <DialogContent>
              <div className="text-center">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="font-serif text-xl font-medium mb-2">{selectedMember.name}</h3>
                <p className="text-brand-red font-medium text-sm mb-4">{selectedMember.role}</p>
                <p className="text-gray-600 text-sm">{selectedMember.bio}</p>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="mt-4 text-sm text-brand-red hover:underline"
                >
                  Close
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
};

export default TeamSection;

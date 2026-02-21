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
    name: 'Bishop Israel Morakinyo',
    role: 'Chairman',
    bio: 'Bishop Israel Morakinyo stands as a titan in the realm of real estate management, boasting an impressive 25-year entrepreneurial journey that has left an indelible mark on the Nigerian estate management sector.\n\nHis accolades extend beyond his entrepreneurial success, as he is a distinguished fellow of esteemed professional bodies, including the Chartered Institute of Public Administration of Nigeria, showcasing his commitment to excellence in his field.\n\nIn 1987, he served as the estate management agency manager at Harriman & Co., the trailblazing indigenous firm of estate surveyors and valuers in the Federal Republic of Nigeria. He studied Accounting at the Federal Polytechnic, Ibadan, Oyo State, and emerged at the top of his class with a distinction.\n\nMorakinyo made history as the first African indigenous to be ordained Bishop in the state of Israel. He is the presiding Bishop of Family Altar Assembly International, US, bringing a unique blend of leadership, spirituality, and business acumen.\n\nCurrently, he serves as the Chairman at Step Synergy and Atlangrove Heights Ltd., where he continues to shape the industry while dedicating himself to capacity development programs for youths and emerging leaders across business, spirituality, and politics.',
    image: '/lovable-uploads/TeamMember/PeterAdobamen.jpg',
    social: {
      facebook: '#',
      instagram: '#',
      linkedin: '#',
    },
  },
  {
    id: 2,
    name: 'Mr. Ayodele O. Aroloye',
    role: 'Managing Director/CEO',
    bio: 'Mr. Ayodele O. Aroloye is an accomplished serial entrepreneur, inventor, and adept administrator with a wealth of experience spanning two decades. His journey includes the establishment of manufacturing concerns and active involvement on multiple business boards.\n\nWith a foundation in Industrial Mathematics, Aroloye commenced his professional career at NCR & Associates Limited, Nigeria, showcasing early expertise. He further developed his skills through high-level investment and management roles at the National Association of REALTORS (NNAR) and The Estate Surveyors and Valuers Registration Board of Nigeria (ESVARBON), a regulatory body in real estate and valuation practices.\n\nHis well-rounded development was enhanced through experience at the Citizenship and Leadership organization. As the visionary Founder and CEO of Atlangrove Engineering and Homes Ltd., he leads with innovation and excellence.\n\nBeyond business, Aroloye is actively involved in philanthropy, volunteering with NGOs dedicated to community welfare and fitness. His career is a testament to strategic leadership, diverse expertise, and a strong commitment to positive societal impact.',
    image: '/lovable-uploads/TeamMember/EmmanuelAdetutu.jpg',
    social: {
      instagram: '#',
      linkedin: '#',
    },
  },
  {
    id: 3,
    name: 'Ayomikun Fred Bulu',
    role: 'Chief Administrative Officer',
    bio: 'Ayomikun Fred Bulu is a dynamic Chief Administrative Officer with over 5 years of post-university experience across business development, integrated marketing communications, publishing, and training. As a seasoned economist, Ayomikun\'s professional journey began in 2000 at Palnapina International, where he showcased his early expertise in various capacities, setting the stage for a rich and diverse career.\n\nHe has been instrumental in establishing manufacturing concerns and actively shaping the trajectory of multiple business boards. His expertise includes strategic research, start-up guidance, operational process advisory, and brand equity building through integrated marketing communications.\n\nNotably, Ayomikun served as an Associate Partner at alGROWithm, the No.1 indigenous Growth Agency in Africa, focusing on Growth Marketing at Jumia. His ventures demonstrate a commitment to innovation and excellence in the African business landscape.\n\nBeyond the boardroom, Ayomikun is passionate about youth and leadership development, volunteering with NGOs to contribute to capacity building programs for emerging leaders in business and sustainability.\n\nCurrently, he serves as the dynamic Business & Strategic Development Consultant to Atlangrove Engineering and Homes Ltd., Africa\'s emerging game changer in the Real Estate sector, where his strategic vision continues to drive impactful growth and innovation.',
    image: '/lovable-uploads/TeamMember/HalimaAbubakar.jpg',
    social: {
      facebook: '#',
      linkedin: '#',
    },
  },
  {
    id: 4,
    name: 'Mrs. Yemi Mercy Obideyi-Aroloye',
    role: 'Executive Secretary',
    bio: 'Mrs. Yemi Mercy Obideyi-Aroloye is a triumphant accomplished entrepreneurial trailblazer, demonstrating profound expertise cultivated over decades of post-university experience and practical application. Her distinguished career is marked by the establishment of several manufacturing concerns and strategic roles on multiple boards overseeing dynamic business entities.\n\nShe began her professional journey with a robust foundation in Environmental Health Technology, initially serving as an Environmental Supervisor at T-CON Restaurant Limited, one of Nigeria\'s preeminent Fast-Moving Food Vendors. In this role, she developed her professional acumen and leadership skills.\n\nCurrently, Mrs. Obideyi-Aroloye serves as the esteemed Superior Secretary at AtlanGrove Engineering and Homes Limited, where her entrepreneurial spirit and administrative finesse converge to play an integral role in the organization\'s continued success. Her ability to combine strategic vision with operational excellence makes her an invaluable asset to the company\'s leadership team.',
    image: '/lovable-uploads/TeamMember/Yemi_Mercy.jpeg',
    social: {
      twitter: '#',
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
            Meet Our <span className="text-brand-blue">Team</span>
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
                <p className="text-brand-blue font-medium text-sm mb-3">{member.role}</p>
                <button
                  onClick={() => setSelectedMember(member)}
                  className="text-sm text-brand-blue hover:underline"
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
                <h3 className="text-2xl font-semibold text-gray-900">{selectedMember.name}</h3>
                <p className="text-brand-blue font-medium mt-1">{selectedMember.role}</p>
                <div className="mt-4 text-gray-600 max-h-60 overflow-y-auto pr-4 team-member-bio">
                  {selectedMember.bio.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="mt-4 text-sm text-brand-blue hover:underline"
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

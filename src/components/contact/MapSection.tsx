
const MapSection = () => {
  return (
    <section className="py-12">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-serif font-semibold mb-3">Our Office Address</h2>
          <p className="text-gray-600">
            Visit us at our office in Atlangrove Homes, Suit FF037 Block C, AICL Neighbourhood Shopping Complex, Garki Area 3, Abuja.
          </p>
        </div>
        
        <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
          {/* Google Maps iframe for the Abuja office */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15767.303325681223!2d7.47244!3d9.0761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b1a26736b4d%3A0xf2af578b0d9b992c!2sWuse%20II%2C%20Abuja!5e0!3m2!1sen!2sng!4v1695903213789!5m2!1sen!2sng"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Atlangrove Homes"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default MapSection;

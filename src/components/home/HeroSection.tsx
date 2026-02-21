import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const propertyTypes = [
	{ value: 'all', label: 'All Properties' },
	{ value: 'house', label: 'Houses' },
	{ value: 'apartment', label: 'Apartments' },
	{ value: 'land', label: 'Land' },
	{ value: 'commercial', label: 'Commercial' },
];

const locations = [
	{ value: 'all', label: 'Any Location' },
	{ value: 'lagos', label: 'Lagos' },
	{ value: 'abuja', label: 'Abuja' },
	{ value: 'port-harcourt', label: 'Port Harcourt' },
	{ value: 'kano', label: 'Kano' },
	{ value: 'ibadan', label: 'Ibadan' },
];

// Array of background images for the carousel
const backgroundImages = [
	'https://images.unsplash.com/photo-1472396961693-142e6e269027', // Luxury estate
	'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d', // Modern villa
	'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea', // Luxury apartment interior
	'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', // Luxury home
	'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', // Modern architecture house
];

const HeroSection = () => {
	const [searchParams, setSearchParams] = useState({
		keyword: '',
		propertyType: 'all',
		location: 'all',
	});

	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);

	// Effect to handle the background image carousel
	useEffect(() => {
		const interval = setInterval(() => {
			// Start the transition effect
			setIsTransitioning(true);

			// Wait for the transition to complete before changing the image
			setTimeout(() => {
				setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
				setIsTransitioning(false);
			}, 500); // This should match the CSS transition duration
		}, 5000); // Change image every 5 seconds

		return () => clearInterval(interval);
	}, []);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		// Construct URL with search params
		const queryParams = new URLSearchParams();
		if (searchParams.keyword) queryParams.set('keyword', searchParams.keyword);
		if (searchParams.propertyType !== 'all') queryParams.set('type', searchParams.propertyType);
		if (searchParams.location !== 'all') queryParams.set('location', searchParams.location);

		// Navigate programmatically
		window.location.href = `/ properties ? ${queryParams.toString()} `;
	};

	return (
		<section className="relative min-h-screen bg-gray-900 flex items-center overflow-hidden">
			{/* Background image carousel with transitions */}
			{backgroundImages.map((image, index) => (
				<div
					key={image}
					className={`absolute inset - 0 z - 0 transition - opacity duration - 500 ease -in -out ${index === currentImageIndex ? 'opacity-50' : 'opacity-0'
						} ${isTransitioning && index === currentImageIndex ? 'opacity-0' : ''} `}
				>
					<img
						src={image}
						alt={`Luxury Real Estate ${index + 1} `}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
				</div>
			))}

			{/* Content */}
			<div className="section-container relative z-10 text-white">
				<div className="max-w-3xl slide-up animate-delay-200">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-white leading-tight mb-6 slide-up">
						Redefining <span className="text-brand-blue">Modern Living</span> in Nigeria
					</h1>
					<p className="text-lg md:text-xl text-gray-200 font-light mb-8 max-w-2xl text-left slide-up animate-delay-200">
						Discover premium residential communities that blend modern living with timeless design.
						Experience architectural excellence and sustainable living with Atlangrove Homes.
					</p>

					{/* Search Form */}
					<div className="bg-white/10 backdrop-blur-md p-4 rounded-lg mb-8 max-w-4xl mx-auto slide-up animate-delay-400">
						<form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
							<div className="flex-1">
								<div className="relative">
									<Input
										type="text"
										placeholder="Search by property name or features..."
										className="pl-10 bg-white/20 border-white/20 text-white placeholder:text-white/70"
										value={searchParams.keyword}
										onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
									/>
									<Search className="absolute left-3 top-3 h-4 w-4 text-white/70" />
								</div>
							</div>

							<div className="w-full md:w-48">
								<Select
									value={searchParams.propertyType}
									onValueChange={(value) => setSearchParams({ ...searchParams, propertyType: value })}
								>
									<SelectTrigger className="bg-white/20 border-white/20 text-white">
										<SelectValue placeholder="Property Type" />
									</SelectTrigger>
									<SelectContent>
										{propertyTypes.map((type) => (
											<SelectItem key={type.value} value={type.value}>
												{type.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="w-full md:w-48">
								<Select
									value={searchParams.location}
									onValueChange={(value) => setSearchParams({ ...searchParams, location: value })}
								>
									<SelectTrigger className="bg-white/20 border-white/20 text-white">
										<div className="flex items-center">
											<MapPin className="mr-2 h-4 w-4" />
											<SelectValue placeholder="Location" />
										</div>
									</SelectTrigger>
									<SelectContent>
										{locations.map((location) => (
											<SelectItem key={location.value} value={location.value}>
												{location.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<Button
								type="submit"
								size="lg"
								className="bg-brand-blue hover:bg-brand-blue-dark active:bg-brand-blue-dark text-white text-base py-6 px-8 transition-colors duration-300 hover:shadow-lg hover:shadow-brand-blue/20"
							>
								<Search className="mr-2 h-4 w-4" /> Search
							</Button>
						</form>
					</div>

					<div className="flex flex-wrap gap-4">
						<Button asChild size="lg" className="text-base">
							<Link to="/properties">
								Explore Properties <ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg" className="text-base bg-transparent border-white text-white hover:bg-white/10">
							<Link to="/contact">
								Contact Us
							</Link>
						</Button>
					</div>
				</div>
			</div>

			{/* Down arrow for scrolling */}
			<div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
				<div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6 text-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 14l-7 7m0 0l-7-7m7 7V3"
						/>
					</svg>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;

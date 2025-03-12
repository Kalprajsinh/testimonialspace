"use client";

import { useUser } from "@clerk/nextjs";
import { SignUpButton } from "@clerk/nextjs";

import { Video,Shield,Zap, Star, Layout, Check } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { user, isSignedIn } = useUser();
  console.log(user);

  return (
    <div className="flex flex-col bg-black text-white">

    <section className="flex flex-col items-center justify-center flex-1 text-center p-8 bg-black min-h-screen">
        <h1 className="text-4xl font-bold mb-4">Collect & Showcase Customer Testimonials Effortlessly</h1>
        <p className="text-lg text-gray-400 max-w-2xl">
          Testimonial Space helps businesses collect, manage, and display customer feedback through an easy-to-use platform.
          Boost conversions by embedding authentic testimonials on your website.
        </p>
        <div className="mt-6 flex gap-4">
          {isSignedIn ? (
            <Link href="/dashboard">
              <button className="cursor-pointer bg-blue-900 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700">Dashboard</button>
            </Link>
          ) : (
            <SignUpButton mode="modal">
              <button className="cursor-pointer bg-blue-900 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700">Get Started for Free</button>
            </SignUpButton>
          )}
          
          <Link href="#features">
            <button className="cursor-pointer bg-gray-300 text-black px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-gray-400">Learn More</button>
          </Link>
        </div>

      </section>

      <section id="features" className="py-20 bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Everything you need to collect and showcase authentic customer testimonials
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Video className="w-10 h-10 text-white" />,
                title: "Video Testimonials",
                description: "Capture authentic video testimonials that build trust and credibility."
              },
              {
                icon: <Layout className="w-10 h-10 text-white" />,
                title: "Custom Layouts",
                description: "Choose from beautiful layouts that match your brand perfectly."
              },
              {
                icon: <Shield className="w-10 h-10 text-white" />,
                title: "Advanced Security",
                description: "Keep your testimonials safe with enterprise-grade security."
              },
              {
                icon: <Zap className="w-10 h-10 text-white" />,
                title: "Quick Integration",
                description: "Embed testimonials with a single line of code."
              },
              {
                icon: <Star className="w-10 h-10 text-white" />,
                title: "Multiple Spaces",
                description: "Organize testimonials for different products or services."
              },
              {
                icon: <Layout className="w-10 h-10 text-white" />,
                title: "Smart Dashboard",
                description: "Manage everything from an intuitive dashboard."
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-all duration-300">
                <div className="bg-black/50 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: 1,
                title: "Create Your Space",
                description: "Sign up and create a dedicated space for your testimonials."
              },
              {
                step: 2,
                title: "Collect Stories",
                description: "Share your unique link or embed the form on your site."
              },
              {
                step: 3,
                title: "Convert Visitors",
                description: "Display testimonials and watch your conversion rates soar."
              }
            ].map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-zinc-900 rounded-lg p-8 text-center transform group-hover:-translate-y-2 transition-transform duration-300 border border-zinc-800">
                  <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-zinc-400">{step.description}</p>
                </div>
                <div className="bg-zinc-800 rounded-lg transform group-hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Simple Pricing</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Choose the perfect plan for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Free",
                price: "0",
                description: "Perfect for getting started",
                features: [
                  "10 testimonials",
                  "Basic analytics",
                  "Simple embed",
                  "Email support"
                ]
              },
              {
                name: "Pro",
                price: "19",
                description: "Most popular for growing businesses",
                features: [
                  "Unlimited testimonials",
                  "Advanced analytics",
                  "Custom branding",
                  "Video testimonials",
                  "Priority support"
                ]
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations",
                features: [
                  "All Pro features",
                  "Dedicated support",
                  "API access",
                  "Custom integrations",
                  "SLA guarantee"
                ]
              }
            ].map((plan, index) => (
              <div key={index} className={`rounded-lg p-8 border ${
                index === 1 
                  ? 'bg-white text-black border-white transform scale-105' 
                  : 'bg-zinc-800 border-zinc-700'
              }`}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={`${index === 1 ? 'text-zinc-600' : 'text-zinc-400'} mb-6`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {typeof plan.price === 'number' ? '$' : ''}{plan.price}
                  </span>
                  {typeof plan.price === 'number' && (
                    <span className={`${index === 1 ? 'text-zinc-600' : 'text-zinc-400'}`}>/mo</span>
                  )}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className={`w-5 h-5 ${
                        index === 1 ? 'text-black' : 'text-white'
                      }`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-300 ${
                  index === 1
                    ? 'bg-black text-white hover:bg-zinc-800'
                    : 'bg-white text-black hover:bg-zinc-200'
                }`}>
                  {index === 2 ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Customer Success Stories</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              See how businesses like yours are growing with our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                role: "Marketing Director, TechStart",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
                content: "We saw a 30% increase in conversions after implementing the video testimonials feature. The ROI has been incredible."
              },
              {
                name: "Michael Chen",
                role: "Founder, GrowthLabs",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
                content: "The best testimonial platform we've used. It's intuitive, powerful, and our customers love how easy it is to share their stories."
              },
              {
                name: "Emma Williams",
                role: "Small Business Owner",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
                content: "As a small business owner, the free tier was perfect to get started. The platform grew with us as we scaled."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-zinc-900 rounded-lg p-8 border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-zinc-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-zinc-300 leading-relaxed">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

{/* <div className="flex flex-col items-center justify-center group w-fit sm:m-40">
      <div className="bg-black border-2 rounded-2xl border-gray-300 text-white max-w-lg hover:-rotate-6 transform transition duration-500 ease-in-out">
      <div className="flex justify-between p-4">
        <div className="flex items-center gap-4">
        <img src="https://as1.ftcdn.net/jpg/03/38/30/80/1000_F_338308078_iiXC8b9lxpxmjGKaKu4dtXHSIVfzE8qm.jpg" alt="" width={100} height={100} className=" rounded-full"/>
        <div>
          <h1 className="text-xl font-semibold">Apple Inc</h1>
          <p className="text-sm text-gray-400">Cupertino, California</p>
        </div>
        </div>
        <div className="w-12 h-12 rounded-full mr-5">
          <br />
        <img src="https://images.freeimages.com/image/large-previews/f35/x-twitter-logo-on-black-circle-5694247.png" alt="" />
        </div>
      </div>
        <hr className="text-gray-500" />
        <div className="w-full p-5 flex justify-between gap-5">
        <div className="w-2/5">
          <p className="font-blod font-serif sm:text-3xl text-lg">The fastest way to get a snapshot of our business</p>
        </div>
        <div className="w-3/5">
        <p className="font-sans text-sm text-gray-400"><QuoteIcon className="sm:block hidden"></QuoteIcon>
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem maxime, facilis consectetur fuga rem aliquid excepturi beatae. Dolorum quas nostrum quaerat ut doloremqs impedit."
          </p>
          <p className="font-sans text-sm text-gray-400 text-right sm:block hidden"> - Lorem</p>
        </div>
      </div>
      </div>
      <div className="bg-black border-2 rounded-2xl border-gray-300 text-white max-w-lg absolute -z-20 group-hover:-rotate-12 transform transition duration-500 ease-in-out">
      <div className="flex justify-between p-4">
        <div className="flex items-center gap-4">
        <img src="https://as1.ftcdn.net/jpg/03/38/30/80/1000_F_338308078_iiXC8b9lxpxmjGKaKu4dtXHSIVfzE8qm.jpg" alt="" width={100} height={100} className=" rounded-full"/>
        <div>
          <h1 className="text-xl font-semibold">Apple Inc</h1>
          <p className="text-sm text-gray-400">Cupertino, California</p>
        </div>
        </div>
        <div className="w-12 h-12 rounded-full">
          <br />
        <img src="https://www.freeiconspng.com/thumbs/apple-logo-icon/blue-apple-logo-icon-0.png" alt="" />
        </div>
      </div>
        <hr className="text-gray-500" />
        <div className="w-full p-5 flex justify-between gap-5">
        <div className="w-2/5">
          <p className="font-blod font-serif text-3xl">The fastest way to get a snapshot of our business</p>
        </div>
        <div className="w-3/5">
        <p className="font-sans text-sm text-gray-400"><QuoteIcon></QuoteIcon>
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem maxime, facilis consectetur fuga rem aliquid excepturi beatae. Dolorum quas nostrum quaerat ut doloremqs impedit."
          </p>
          <p className="font-sans text-sm text-gray-400 text-right"> - Lorem</p>
        </div>
      </div>
      </div>

      <div className="bg-black border-2 rounded-2xl border-gray-300 text-white max-w-lg absolute -z-10 group-hover:rotate-16 transform transition duration-500 ease-in-out">
      <div className="flex justify-between p-4">
        <div className="flex items-center gap-4">
        <img src="https://as1.ftcdn.net/jpg/02/65/72/98/1000_F_265729869_mYcOBHGd1ifo9ocwmfDIc4tl5jN7M7sy.jpg" alt="" width={100} height={100} className=" rounded-full"/>
        <div>
          <h1 className="text-xl font-semibold">Apple Inc</h1>
          <p className="text-sm text-gray-400">Cupertino, California</p>
        </div>
        </div>
        <div className="w-12 h-12 rounded-full">
          <br />
        <img src="https://www.freeiconspng.com/thumbs/apple-logo-icon/blue-apple-logo-icon-0.png" alt="" />
        </div>
      </div>
        <hr className="text-gray-500" />
        <div className="w-full p-5 flex justify-between gap-5">
        <div className="w-2/5">
          <p className="font-blod font-serif text-3xl">The fastest way to get a snapshot of our business</p>
        </div>
        <div className="w-3/5">
        <p className="font-sans text-sm text-gray-400"><QuoteIcon></QuoteIcon>
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem maxime, facilis consectetur fuga rem aliquid excepturi beatae. Dolorum quas nostrum quaerat ut doloremqs impedit."
          </p>
          <p className="font-sans text-sm text-gray-400 text-right"> - Lorem</p>
        </div>
      </div>
      </div>
    </div> */}

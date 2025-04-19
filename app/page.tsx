"use client";

import { useUser } from "@clerk/nextjs";
import { SignUpButton } from "@clerk/nextjs";

import { Video,Shield,Zap, Star, Layout, Check } from "lucide-react";
import Link from "next/link";
// import Image from 'next/image';

export const runtime = "edge";

export default function HomePage() {
  const { user, isSignedIn } = useUser();
  console.log(user);

  return (
    <div className="flex flex-col bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold pb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
          Collect & Showcase Testimonials Effortlessly
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Testimonial Space helps businesses collect, manage, and display customer feedback through an easy-to-use platform.
            Boost conversions by embedding authentic testimonials on your website.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {isSignedIn ? (
              <Link href="/dashboard">
                <button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Go to Dashboard
                </button>
              </Link>
            ) : (
              <SignUpButton mode="modal">
                <button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started for Free
                </button>
              </SignUpButton>
            )}
            <Link href="#features">
              <button className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
              Powerful Features
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Everything you need to collect and showcase authentic customer testimonials
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Video className="w-10 h-10 text-blue-400" />,
                title: "Video Testimonials",
                description: "Capture authentic video testimonials that build trust and credibility."
              },
              {
                icon: <Layout className="w-10 h-10 text-blue-400" />,
                title: "Custom Layouts",
                description: "Choose from beautiful layouts that match your brand perfectly."
              },
              {
                icon: <Shield className="w-10 h-10 text-blue-400" />,
                title: "Advanced Security",
                description: "Keep your testimonials safe with enterprise-grade security."
              },
              {
                icon: <Zap className="w-10 h-10 text-blue-400" />,
                title: "Quick Integration",
                description: "Embed testimonials with a single line of code."
              },
              {
                icon: <Star className="w-10 h-10 text-blue-400" />,
                title: "Multiple Spaces",
                description: "Organize testimonials for different products or services."
              },
              {
                icon: <Layout className="w-10 h-10 text-blue-400" />,
                title: "Smart Dashboard",
                description: "Manage everything from an intuitive dashboard."
              }
            ].map((feature, index) => (
              <div key={index} className="group p-8 bg-zinc-900/50 rounded-2xl border border-zinc-800 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
     
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors duration-300">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
              How It Works
            </h2>
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
                <div className="bg-zinc-900/50 rounded-2xl p-8 text-center transform transition-all duration-300 border border-zinc-800 hover:shadow-blue-500">
                  <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 group-hover:bg-blue-500/20 transition-all duration-300">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors duration-300">{step.title}</h3>
                  <p className="text-zinc-400">{step.description}</p>
                </div>
                <div className="absolute inset-0 bg-blue-500/5 rounded-2xl transform group-hover:scale-105 transition-transform duration-300 -z-10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold pb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
            Select your plan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Perfect for getting started",
                features: [
                  "1 organization",
                  "50 testimonial",
                  "Basic analytics",
                  "Simple embed",
                  "layout access",
                  "with watermark"
                ]
              },
              {
                name: "Standard",
                price: "$6",
                description: "Most popular for growing businesses",
                features: [
                  "3 organization",
                  "Unlimited testimonials",
                  "Custom branding",
                  "remove watermarks",
                  "Priority support",
                  "Custom integrations",
                ]
              },
              {
                name: "Pro",
                price: "$12",
                description: "For large organizations",
                features: [
                  "Unlimited organization",
                  "Unlimited testimonials",
                  "All Pro features",
                  "Dedicated support",
                  "API access",
                  "Custom integrations",
                ]
              }
            ].map((plan, index) => (
              <div key={index} className={`rounded-2xl p-8 border ${
                index === 1 
                  ? 'bg-gradient-to-b from-blue-500/10 to-transparent border-zinc-800 text-white shadow-xl' 
                  : 'bg-zinc-900/50 border-zinc-800'
              }`}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={`${index === 1 ? 'text-blue-400' : 'text-zinc-400'} mb-6`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {typeof plan.price === 'number' ? '$' : ''}{plan.price}
                  </span>
                  {typeof plan.price === 'number' && (
                    <span className={`${index === 1 ? 'text-blue-400' : 'text-zinc-400'}`}>/mo</span>
                  )}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className={`w-5 h-5 ${
                        index === 1 ? 'text-blue-400' : 'text-white'
                      }`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 px-6 rounded-xl font-bold transition-all cursor-pointer duration-300 ${
                  index === 1
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}>
                  {index === 2 ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold pb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
            Example of testimonials
            </h2>
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
              <div key={index} className="group bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                <div className="flex items-center gap-4 mb-6">
                  {/* <div className="relative">
                    <div className="w-16 h-16 rounded-xl overflow-hidden">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-blue-500/20 p-2 rounded-lg">
                      <Star className="w-4 h-4 text-blue-400" />
                    </div>
                  </div> */}
                  <div>
                    <h4 className="font-bold group-hover:text-blue-400 transition-colors duration-300">{testimonial.name}</h4>
                    <p className="text-zinc-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-zinc-300 leading-relaxed">&quot;{testimonial.content}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
                  TestimonialSpace
                </span>
              </div>
              <p className="text-zinc-400 text-sm">
                The all-in-one platform for collecting and showcasing customer testimonials.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-zinc-400 hover:text-blue-400 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-zinc-400 hover:text-blue-400 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-zinc-400 hover:text-blue-400 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-zinc-400 hover:text-blue-400 transition-colors duration-300">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-zinc-400 hover:text-blue-400 transition-colors duration-300">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className="text-zinc-400 hover:text-blue-400 transition-colors duration-300">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="text-zinc-400 hover:text-blue-400 transition-colors duration-300">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-zinc-400 hover:text-blue-400 transition-colors duration-300">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-zinc-400 hover:text-blue-400 transition-colors duration-300">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-zinc-400 hover:text-blue-400 transition-colors duration-300">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-zinc-400 hover:text-blue-400 transition-colors duration-300">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-zinc-400 hover:text-blue-400 transition-colors duration-300">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-zinc-400 hover:text-blue-400 transition-colors duration-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-zinc-400 hover:text-blue-400 transition-colors duration-300">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-zinc-400">
              &copy; {new Date().getFullYear()} TestimonialSpace. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors duration-300">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors duration-300">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors duration-300">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

{/* <div className="flex flex-col items-center justify-center group w-fit sm:m-40">
      <div className="bg-black border-2 rounded-2xl border-gray-300 text-white max-w-lg hover:-rotate-6 transform transition duration-500 ease-in-out">
      <div className="flex justify-between p-4">
        <div className="flex items-center gap-4">
        <Image src="https://as1.ftcdn.net/jpg/03/38/30/80/1000_F_338308078_iiXC8b9lxpxmjGKaKu4dtXHSIVfzE8qm.jpg" alt="" width={100} height={100} className=" rounded-full"/>
        <div>
          <h1 className="text-xl font-semibold">Apple Inc</h1>
          <p className="text-sm text-gray-400">Cupertino, California</p>
        </div>
        </div>
        <div className="w-12 h-12 rounded-full mr-5">
          <br />
        <Image src="https://images.freeimages.com/image/large-previews/f35/x-twitter-logo-on-black-circle-5694247.png" alt="" />
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
        <Image src="https://as1.ftcdn.net/jpg/03/38/30/80/1000_F_338308078_iiXC8b9lxpxmjGKaKu4dtXHSIVfzE8qm.jpg" alt="" width={100} height={100} className=" rounded-full"/>
        <div>
          <h1 className="text-xl font-semibold">Apple Inc</h1>
          <p className="text-sm text-gray-400">Cupertino, California</p>
        </div>
        </div>
        <div className="w-12 h-12 rounded-full">
          <br />
        <Image src="https://www.freeiconspng.com/thumbs/apple-logo-icon/blue-apple-logo-icon-0.png" alt="" />
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
        <Image src="https://as1.ftcdn.net/jpg/02/65/72/98/1000_F_265729869_mYcOBHGd1ifo9ocwmfDIc4tl5jN7M7sy.jpg" alt="" width={100} height={100} className=" rounded-full"/>
        <div>
          <h1 className="text-xl font-semibold">Apple Inc</h1>
          <p className="text-sm text-gray-400">Cupertino, California</p>
        </div>
        </div>
        <div className="w-12 h-12 rounded-full">
          <br />
        <Image src="https://www.freeiconspng.com/thumbs/apple-logo-icon/blue-apple-logo-icon-0.png" alt="" />
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

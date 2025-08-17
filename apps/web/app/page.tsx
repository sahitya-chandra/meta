"use client"
import Head from 'next/head'; // For meta tags (or use Next.js 13+ metadata API in layout/page)

export default function Home() {
  return (
    <>
      <Head>
        <title>META - Connect Instantly, Chat Securely</title>
        <meta name="description" content="Connect instantly with friends and colleagues. Send messages, create groups, and stay connected anytime, anywhere with ChatApp." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 font-sans antialiased text-gray-800">

        {/* Hero Section */}
        <section className="flex flex-col-reverse lg:flex-row items-center justify-center px-6 sm:px-12 py-24 gap-16 lg:gap-32 flex-grow max-w-7xl mx-auto w-full">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-left space-y-8 animate-fade-in-up">
            <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
              <span className="block text-blue-600 drop-shadow-md">ChatApp</span>
              Your World, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Connected</span>.
            </h1>
            <p className="text-gray-700 text-xl max-w-md mx-auto lg:mx-0 leading-relaxed">
              Connect instantly with friends and colleagues. Send messages, create groups, and stay connected anytime, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5 mt-10">
              <a
                href="/signin"
                className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full shadow-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75"
                aria-label="Sign In to ChatApp"
              >
                Sign In
              </a>
              <a
                href="/signup"
                className="px-8 py-4 border-2 border-gray-300 text-gray-800 font-semibold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-opacity-75"
                aria-label="Sign Up for ChatApp"
              >
                Sign Up
              </a>
            </div>
          </div>

          {/* Illustration / Placeholder */}
          <div className="flex-1 flex justify-center items-center p-4">
            <div className="relative w-[420px] h-[420px] bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full shadow-2xl flex items-center justify-center animate-blob transform transition-transform duration-1000 ease-in-out hover:scale-105 group">
              <div className="absolute inset-4 rounded-full bg-white opacity-10 blur-xl"></div>
              <svg className="w-56 h-56 text-blue-600 opacity-75 group-hover:text-blue-700 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 14v-2h8v2H6zm10 0h2v-2h-2v2zm0-4h2V8h-2v2zM6 8h8v2H6V8z"/>
              </svg>
              {/* Using default Tailwind sizes and colors for the dots */}
              <span className="absolute top-1/4 left-1/4 w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-ping-fast animation-delay-500"></span> {/* Renamed 'animate-ping-fast' for clarity */}
            </div>
          </div>
        </section>

        {/* Video Demonstration Section */}
        <section className="px-6 sm:px-12 py-20 bg-white text-center shadow-lg max-w-7xl mx-auto w-full rounded-xl mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12">See ChatApp in Action</h2>
          <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl aspect-video bg-gray-200 flex items-center justify-center border-4 border-blue-600">
            <p className="text-gray-600 text-xl font-medium">Your awesome product video goes here! 🎬</p>
            {/* VIDEO */}
          </div>
        </section>


        <section className="px-6 sm:px-12 py-20 bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-center max-w-7xl mx-auto w-full">
        
          <div className="space-y-5 p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-4xl text-blue-600">
              💬
            </div>
            <h3 className="font-bold text-2xl text-gray-900">Instant Messaging</h3>
            <p className="text-gray-700 text-lg">Send messages instantly to anyone, anywhere, with real-time updates and notifications.</p>
          </div>

        
          <div className="space-y-5 p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center text-4xl text-green-600">
              👥
            </div>
            <h3 className="font-bold text-2xl text-gray-900">Dynamic Group Chats</h3>
            <p className="text-gray-700 text-lg">Create and manage groups effortlessly, fostering seamless collaboration with friends or teammates.</p>
          </div>

      
          <div className="space-y-5 p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-gray-100">
            <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto flex items-center justify-center text-4xl text-purple-600">
              🔒
            </div>
            <h3 className="font-bold text-2xl text-gray-900">Secure & Private</h3>
            <p className="text-gray-700 text-lg">Your conversations are protected with industry-leading end-to-end encryption for ultimate privacy and peace of mind.</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-sm text-gray-600 bg-gray-100 border-t border-gray-200">
          <p className="mb-2">&copy; {new Date().getFullYear()} ChatApp. All rights reserved.</p>
          <div className="space-x-6">
            <a href="/privacy" className="hover:underline text-blue-600 text-sm">Privacy Policy</a>
            <a href="/terms" className="hover:underline text-blue-600 text-sm">Terms of Service</a>
            <a href="/contact" className="hover:underline text-blue-600 text-sm">Contact Us</a>
          </div>
        </footer>
      </div>

      {/* Custom CSS for animations (since we're not touching tailwind.config.js) */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        @keyframes blob {
          0%, 100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
        }
        .animate-blob {
          animation: blob 7s infinite alternate;
        }

        /* Using default Tailwind 'animate-pulse' and 'animate-ping' */
        /* To create a different speed for ping, we define a new keyframe for it */
        @keyframes ping-fast {
          0% {
            transform: scale(0.2);
            opacity: 0.8;
          }
          80%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ping-fast {
          animation: ping-fast 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        /* Basic animation delay utility (not in default Tailwind) */
        .animation-delay-500 {
            animation-delay: 0.5s;
        }
      `}</style>
    </>
  );
}
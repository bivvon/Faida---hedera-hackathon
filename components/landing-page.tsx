"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { WalletConnect } from "@/components/wallet-connect"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ChevronRight, Shield, BarChart3, TrendingUp, Leaf, Zap, BarChart2, LineChart } from "lucide-react"

export function LandingPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    setMounted(true)
  }, [])

  const handleWalletConnected = () => {
    router.push("/dashboard")
  }

  // Add this class to the main div to ensure theme classes are applied
  return (
    <div className={`relative min-h-screen flex flex-col ${mounted ? (theme === "dark" ? "dark" : "light") : ""}`}>
      <Navbar />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="matrix-background"></div>
      </div>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-20 md:py-32">
          <div
            className="max-w-5xl w-full text-center space-y-8 transition-all duration-1000 transform 
            translate-y-0 opacity-100"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight md:leading-tight font-display">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9CCD62] to-[#E0DDCA] dark:from-[#9CCD62] dark:to-[#E0DDCA]">
                Faida:
              </span>{" "}
              Your{" "}
              <span className="relative inline-block">
                <span className="relative z-10">AI-Powered</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-[#9CCD62]/20 -z-10 skew-x-3"></span>
              </span>{" "}
              Web3 Wealth Manager
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
              Experience the future of finance with Hedera's enterprise-grade security. Access tokenized capital markets, including the Nairobi Stock Exchange, with AI-optimized strategies for maximum returns.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-[#9CCD62] hover:bg-[#8bbc51] text-[#3C3D42] font-medium px-8 rounded-full shadow-glow"
                onClick={() => setShowWalletModal(true)}
              >
                Connect Wallet
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="rounded-full border-[#E0DDCA]/30 hover:bg-[#E0DDCA]/10">
                Learn More
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="flex flex-col items-center p-4 rounded-xl bg-background/20 backdrop-blur-sm border border-border/20">
                <div className="w-12 h-12 rounded-full bg-[#9CCD62]/20 flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-[#9CCD62]" />
                </div>
                <span className="font-medium">Enterprise Security</span>
                <span className="text-sm text-muted-foreground">Hedera Powered</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-background/20 backdrop-blur-sm border border-border/20">
                <div className="w-12 h-12 rounded-full bg-[#9CCD62]/20 flex items-center justify-center mb-3">
                  <BarChart3 className="h-6 w-6 text-[#9CCD62]" />
                </div>
                <span className="font-medium">NSE Integration</span>
                <span className="text-sm text-muted-foreground">Tokenized Markets</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-background/20 backdrop-blur-sm border border-border/20">
                <div className="w-12 h-12 rounded-full bg-[#9CCD62]/20 flex items-center justify-center mb-3">
                  <TrendingUp className="h-6 w-6 text-[#9CCD62]" />
                </div>
                <span className="font-medium">AI Optimization</span>
                <span className="text-sm text-muted-foreground">Smart Strategies</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-background/20 backdrop-blur-sm border border-border/20">
                <div className="w-12 h-12 rounded-full bg-[#9CCD62]/20 flex items-center justify-center mb-3">
                  <Leaf className="h-6 w-6 text-[#9CCD62]" />
                </div>
                <span className="font-medium">Sustainable</span>
                <span className="text-sm text-muted-foreground">ESG Focus</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-background/50 backdrop-blur-sm border-t border-border/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Why Choose Faida?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto font-body">
                Our AI-powered platform optimizes your crypto investments for maximum returns with minimal risk.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background/30 backdrop-blur-sm rounded-xl p-6 border border-border/20 transition-all hover:bg-background/50 hover:border-[#9CCD62]/20">
                <div className="w-12 h-12 rounded-full bg-[#9CCD62]/20 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-[#9CCD62]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Enterprise-Grade Security</h3>
                <p className="text-muted-foreground">
                  Built on Hedera's enterprise-grade blockchain, ensuring maximum security and reliability for your investments.
                </p>
              </div>

              <div className="bg-background/30 backdrop-blur-sm rounded-xl p-6 border border-border/20 transition-all hover:bg-background/50 hover:border-[#9CCD62]/20">
                <div className="w-12 h-12 rounded-full bg-[#9CCD62]/20 flex items-center justify-center mb-4">
                  <BarChart2 className="h-6 w-6 text-[#9CCD62]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Capital Markets Access</h3>
                <p className="text-muted-foreground">
                  Direct access to tokenized securities from the Nairobi Stock Exchange and other major markets through Hedera's secure infrastructure.
                </p>
              </div>

              <div className="bg-background/30 backdrop-blur-sm rounded-xl p-6 border border-border/20 transition-all hover:bg-background/50 hover:border-[#9CCD62]/20">
                <div className="w-12 h-12 rounded-full bg-[#9CCD62]/20 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-[#9CCD62]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Real-time Analytics</h3>
                <p className="text-muted-foreground">
                  Comprehensive market data and AI-powered insights for informed investment decisions across traditional and digital assets.
                </p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Button
                size="lg"
                className="bg-[#9CCD62] hover:bg-[#8bbc51] text-[#3C3D42] font-medium px-8 rounded-full shadow-glow"
                onClick={() => setShowWalletModal(true)}
              >
                Start Investing Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials/Stats Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Trusted by Potential Web3 Investors</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto font-body">
                Join thousands of forward-thinking investors who are maximizing their returns with Faida.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9CCD62]">$24M+</div>
                <p className="text-muted-foreground">Assets Under Management</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9CCD62]">12.4%</div>
                <p className="text-muted-foreground">Average APY</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9CCD62]">5,000+</div>
                <p className="text-muted-foreground">Active Users</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9CCD62]">24/7</div>
                <p className="text-muted-foreground">AI Monitoring</p>
              </div>
            </div>
          </div>
        </section>

        {/* Capital Markets Section */}
        <section className="py-20 px-4 bg-background/50 backdrop-blur-sm border-t border-border/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Capital Markets Integration</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Access traditional financial markets with the security and efficiency of Hedera's enterprise-grade blockchain.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-background/30 backdrop-blur-sm rounded-xl p-6 border border-border/20">
                <h3 className="text-xl font-bold mb-4">Market Features</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center">
                    <Shield className="h-5 w-5 text-[#9CCD62] mr-2" />
                    Enterprise-grade security powered by Hedera
                  </li>
                  <li className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-[#9CCD62] mr-2" />
                    Direct NSE market access and tokenized securities
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-[#9CCD62] mr-2" />
                    Seamless integration with traditional markets
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#9CCD62] mr-2" />
                    High-performance transaction processing
                  </li>
                </ul>
              </div>
              <div className="bg-background/30 backdrop-blur-sm rounded-xl p-6 border border-border/20">
                <h3 className="text-xl font-bold mb-4">Security Benefits</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center">
                    <Shield className="h-5 w-5 text-[#9CCD62] mr-2" />
                    Byzantine fault tolerance consensus
                  </li>
                  <li className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-[#9CCD62] mr-2" />
                    Enterprise-grade network security
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-[#9CCD62] mr-2" />
                    Regulatory compliance ready
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#9CCD62] mr-2" />
                    High-performance transaction processing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-20 px-4 bg-background/50 backdrop-blur-sm border-t border-border/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Our Partners</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto font-body">
                Working with leading institutions to bring you the best investment opportunities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-background/30 backdrop-blur-sm rounded-xl p-8 border border-border/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#9CCD62]/20 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-[#9CCD62]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-display">Nairobi Stock Exchange</h3>
                  <p className="text-muted-foreground font-body">
                    Direct access to East Africa's premier stock market
                  </p>
                </div>
              </div>
              <div className="bg-background/30 backdrop-blur-sm rounded-xl p-8 border border-border/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#9CCD62]/20 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-[#9CCD62]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-display">Hedera Network</h3>
                  <p className="text-muted-foreground font-body">
                    Enterprise-grade security and performance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-[#9CCD62]/10 border-t border-[#9CCD62]/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Maximize Your Crypto Returns?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Connect your wallet now and let our AI-powered platform optimize your investments for maximum returns.
            </p>
            <Button
              size="lg"
              className="bg-[#9CCD62] hover:bg-[#8bbc51] text-[#3C3D42] font-medium px-8 rounded-full shadow-glow"
              onClick={() => setShowWalletModal(true)}
            >
              Connect Wallet & Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-12 px-4 border-t border-border/20 bg-background/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#9CCD62] to-[#E0DDCA] dark:from-[#9CCD62] dark:to-[#E0DDCA] font-display">
                Faida
              </span>
              <p className="mt-2 text-sm text-muted-foreground font-body">
                AI-powered Web3 wealth management platform
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-display">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-body">
                <li>Dashboard</li>
                <li>Capital Markets</li>
                <li>Portfolio</li>
                <li>Analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-display">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-body">
                <li>Documentation</li>
                <li>API</li>
                <li>Support</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-display">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-body">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Security</li>
                <li>Compliance</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/20 text-center text-sm text-muted-foreground font-body">
            © 2025 Faida. All rights reserved.
          </div>
        </div>
      </footer>

      <WalletConnect open={showWalletModal} onOpenChange={setShowWalletModal} onConnect={handleWalletConnected} />
    </div>
  )
}


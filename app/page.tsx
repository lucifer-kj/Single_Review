import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Shield, BarChart3, Share2, Smartphone, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mobile-container max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Crux</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/auth/signin" className="text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Button asChild>
                <Link href="/auth/signin">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main id="main-content" className="mobile-container max-w-7xl mx-auto">
        <section className="py-20 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Smart Review Management
              <span className="block text-primary">Made Simple</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Intelligently route customer feedback based on ratings. High ratings redirect to Google Business reviews, 
              while low ratings collect private feedback for improvement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/signin">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#demo">View Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Crux?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional review management with intelligent routing and comprehensive analytics.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="fade-in">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Smart Routing</CardTitle>
                <CardDescription>
                  Automatically redirect high ratings to Google Business while collecting private feedback for low ratings.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="fade-in">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive insights into your review performance with detailed metrics and trends.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="fade-in">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Share2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Easy Sharing</CardTitle>
                <CardDescription>
                  Generate QR codes and shareable links to collect reviews from customers effortlessly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="fade-in">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Mobile Optimized</CardTitle>
                <CardDescription>
                  PWA support ensures your review forms work perfectly on all devices and can be installed as an app.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="fade-in">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Enterprise-grade security with private feedback collection and data protection.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="fade-in">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Professional Design</CardTitle>
                <CardDescription>
                  Clean, accessible interface built with the Crux design system for optimal user experience.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of businesses using Crux to manage their customer reviews intelligently.
            </p>
            <Button size="lg" asChild>
              <Link href="/auth/signin">Start Your Free Trial</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mobile-container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Star className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Crux</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Alpha Business Digital. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

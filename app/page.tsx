import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowRight, Zap, Shield, Sparkles, BarChart, X } from "lucide-react"
import Link from "next/link"

const pricing = [
  {
    name: "Hobby",
    description: "Perfect for side projects and experiments.",
    price: "Free",
    features: [
      "Up to 3 projects",
      "Basic analytics",
      "Community support",
      "1GB storage",
    ],
    limitations: [
      "No custom domain",
      "No priority support",
      "Limited API calls",
    ],
  },
  {
    name: "Pro",
    description: "For serious developers and small teams.",
    price: "$19",
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "10GB storage",
      "Custom domain",
      "API access",
      "Team collaboration",
    ],
    limitations: [
      "No enterprise features",
    ],
  },
  {
    name: "Enterprise",
    description: "For large teams with custom needs.",
    price: "Custom",
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "24/7 phone support",
      "Custom integrations",
      "SLA guarantee",
      "Dedicated account manager",
      "On-premise deployment",
    ],
    limitations: [],
  },
]

const testimonials = [
  {
    quote: "This platform has completely transformed how we handle our workflow.",
    author: "Sarah Johnson",
    role: "CTO at TechCorp",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  },
  {
    quote: "The best investment we've made in our development process.",
    author: "Michael Chang",
    role: "Lead Developer at StartupX",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
  },
  {
    quote: "Incredible features and even better support team.",
    author: "Emily Rodriguez",
    role: "Product Manager at InnovateCo",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
  },
]

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex flex-col min-h-svh">
      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="flex flex-col items-center text-center gap-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
              🚀 Announcing our $10M Series A <ArrowRight className="ml-1 h-4 w-4" />
            </div>
            <h1 className="text-4xl font-bold lg:text-6xl">
              Transform Your Business with Our{" "}
              <span className="text-primary">Revolutionary Platform</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[42rem] leading-normal">
              Streamline your workflow, boost productivity, and scale your business with our all-in-one solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {session ? (
                <Button asChild size="lg">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg">
                    <Link href="/login">Get Started</Link>
                  </Button>
                  <Button variant="outline" size="lg">
                    <a href="#pricing">View Pricing</a>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t bg-muted/40">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <h2 className="text-3xl font-bold">Everything you need to succeed</h2>
            <p className="text-muted-foreground max-w-[58rem]">
              Our platform provides all the tools you need to manage and grow your business efficiently.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>Experience blazing fast performance with our optimized infrastructure.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {["99.9% uptime", "Global CDN", "Edge computing"].map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>Bank-grade security to protect your sensitive data.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {["SOC2 compliant", "End-to-end encryption", "2FA authentication"].map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Sparkles className="h-10 w-10 text-primary mb-2" />
                <CardTitle>AI-Powered</CardTitle>
                <CardDescription>Leverage the power of AI to automate your workflows.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {["Smart automation", "Predictive analytics", "Custom AI models"].map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { number: "10k+", label: "Active Users" },
              { number: "200+", label: "Integrations" },
              { number: "99.9%", label: "Uptime SLA" },
              { number: "24/7", label: "Support" },
            ].map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold">{stat.number}</CardTitle>
                  <CardDescription>{stat.label}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="border-t bg-muted/40">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
            <p className="text-muted-foreground max-w-[58rem]">
              Choose the perfect plan for your needs. No hidden fees.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pricing.map((plan) => (
              <Card key={plan.name} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="font-medium mb-2">Features</p>
                      <ul className="space-y-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center text-sm">
                            <Check className="h-4 w-4 text-primary mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {plan.limitations.length > 0 && (
                      <div>
                        <p className="font-medium mb-2">Limitations</p>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation) => (
                            <li key={limitation} className="flex items-center text-sm text-muted-foreground">
                              <X className="h-4 w-4 mr-2" />
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <Button className="mt-8 w-full" variant={plan.name === "Pro" ? "default" : "outline"}>
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-t">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <h2 className="text-3xl font-bold">Loved by developers worldwide</h2>
            <p className="text-muted-foreground max-w-[58rem]">
              Don&apos;t just take our word for it. Here&apos;s what our users have to say.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.author} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <CardTitle className="text-base">{testimonial.author}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">&quot;{testimonial.quote}&quot;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center text-center gap-8 max-w-2xl mx-auto">
            <BarChart className="h-16 w-16" />
            <h2 className="text-3xl font-bold">Ready to get started?</h2>
            <p className="text-primary-foreground/80">
              Join thousands of satisfied customers who are already using our platform.
            </p>
            {!session && (
              <Button size="lg" variant="secondary" asChild>
                <Link href="/login">Start Your Free Trial</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

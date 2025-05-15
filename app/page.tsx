import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ChevronRight, Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react"
import ScrollHeader from "@/components/scroll-header"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <ScrollHeader>
        <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/abstract-sl.png" alt="StreamLine Logo" width={32} height={32} className="rounded" />
              <span className="text-xl font-bold">StreamLine</span>
            </div>
            <nav className="hidden md:flex gap-6">
              <Link href="#features" className="text-sm font-medium hover:text-primary">
                Features
              </Link>
              <Link href="#testimonials" className="text-sm font-medium hover:text-primary">
                Testimonials
              </Link>
              <Link href="#pricing" className="text-sm font-medium hover:text-primary">
                Pricing
              </Link>
              <Link href="#contact" className="text-sm font-medium hover:text-primary">
                Contact
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
                Log in
              </Link>
              <Button  asChild>
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </div>
          </div>
        </header>
      </ScrollHeader>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="grid gap-6 md:grid-cols-[1fr_300px] md:gap-8 lg:grid-cols-[1fr_450px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl xl:text-6xl/none">
                    Navigate the Digital Flux with Intelligent Resource Management
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-lg lg:text-xl">
                    In today's digital landscape, businesses emerge and vanish rapidly. Our powerful search-driven agent
                    technology helps you adapt by dynamically managing your resource ecosystem when it matters most.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/dashboard">Start Free Trial</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#features" className="flex items-center gap-1">
                      Learn More <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/modern-saas-dashboard.jpg"
                  alt="StreamLine Dashboard"
                  width={600}
                  height={600}
                  className="w-full max-w-[300px] md:max-w-[300px] lg:max-w-[450px] xl:max-w-[600px] aspect-video overflow-hidden rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

       

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-stone-400 px-3 py-1 text-sm text-primary-foreground">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Loved by Businesses Worldwide</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Don't just take our word for it. Here's what our customers have to say.
                </p>
              </div>
            </div>
            <div className="grid gap-6 py-12 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Image
                      src="/diverse-group.png"
                      alt="Sarah Johnson"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <CardTitle>Sarah Johnson</CardTitle>
                      <CardDescription>CEO, TechStart</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "StreamLine has transformed how we manage our projects. The automation features alone have saved us
                    countless hours each week."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Image
                      src="/diverse-group.png"
                      alt="Mark Williams"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <CardTitle>Mark Williams</CardTitle>
                      <CardDescription>CTO, GrowthLabs</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "The analytics dashboard gives us insights we never had before. We can now make data-driven
                    decisions with confidence."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Image src="/diverse-group.png" alt="Lisa Chen" width={40} height={40} className="rounded-full" />
                    <div>
                      <CardTitle>Lisa Chen</CardTitle>
                      <CardDescription>COO, Innovate Inc</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "The customer support team is exceptional. They've been with us every step of the way as we scaled
                    our operations."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-stone-400 px-3 py-1 text-sm text-primary-foreground">
                  Pricing
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Simple, Transparent Pricing</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Choose the plan that's right for your business.
                </p>
              </div>
            </div>
            <div className="grid gap-6 py-12 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">$29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>Perfect for small teams just getting started.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Up to 5 team members</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Basic automation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Standard analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Email support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className=" bg-stone-400" asChild>
                    <Link href="#">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card className="border-primary">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Professional</CardTitle>
                    <div className="inline-block rounded-lg bg-stone-400 px-3 py-1 text-xs text-primary-foreground">
                      Popular
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">$79</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>Ideal for growing businesses with more needs.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Up to 20 team members</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Advanced automation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Enhanced analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Custom integrations</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className=" bg-stone-400" asChild>
                    <Link href="#">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">$199</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>For large organizations with complex requirements.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Unlimited team members</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Full automation suite</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Advanced analytics & reporting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>24/7 dedicated support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Custom development</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>SLA guarantees</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className=" bg-stone-400" asChild>
                    <Link href="#">Contact Sales</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="cta" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to Transform Your Business?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Join thousands of companies already using StreamLine to boost productivity and growth.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link href="/dashboard">Start Your Free Trial</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#contact">Schedule a Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Get in Touch</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Have questions? Our team is here to help.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <form className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="sr-only">
                      Name
                    </label>
                    <input
                      id="name"
                      placeholder="Name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="email" className="sr-only">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Email"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="message" className="sr-only">
                      Message
                    </label>
                    <textarea
                      id="message"
                      placeholder="Message"
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <Button className=" bg-stone-400" type="submit">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/abstract-sl.png" alt="StreamLine Logo" width={24} height={24} className="rounded" />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} StreamLine. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Cookies
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

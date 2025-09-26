import { Users, DollarSign, Clock, Shield, CheckCircle, Star, UserCheck, FileText, Zap, Award } from 'lucide-react';

export const stats = [
    { icon: Users, value: '68%', label: 'Conversion Rate' },
    { icon: DollarSign, value: '$22K', label: 'Avg. Job Value' },
    { icon: Clock, value: '24hr', label: 'Response Time' }
  ];

  export const benefits = [
    {
      title: 'Pre-Qualified Homeowners',
      description: 'Every lead has confirmed hail damage and approved insurance claims'
    },
    {
      title: 'Insurance-Backed Projects',
      description: 'Guaranteed payment through insurance companies - no collection issues'
    },
    {
      title: 'Exclusive Territory Rights',
      description: 'Limited contractors per area - less competition, higher close rates'
    },
    {
      title: 'Complete CRM System',
      description: 'Track leads, manage projects, and grow your business efficiently'
    }
  ];

  export const faqs = [
    {
      question: "How quickly will I receive my first leads?",
      answer: "Your first 5 free leads will be delivered within 24-48 hours of account approval. We verify your license and insurance first to ensure quality for homeowners. After that, you'll receive 2-5 new leads per week based on your service area and capacity.",
      icon: Clock
    },
    {
      question: "What makes your leads different from other companies?",
      answer: "Our leads are pre-qualified with confirmed insurance claims and verified storm damage. Unlike other services that sell the same lead to 10+ contractors, we limit each lead to maximum 3 contractors in your area. Every homeowner has already filed their claim and been approved by their insurance company.",
      icon: Star
    },
    {
      question: "What's your money-back guarantee policy?",
      answer: "If you're not satisfied with your first 5 leads, we'll refund every penny within 30 days. No questions asked, no fine print. We're confident in our lead quality because 78% of our contractors close at least 3 out of their first 5 leads.",
      icon: Shield
    },
    {
      question: "How much can I expect to earn per lead?",
      answer: "Our contractors average $28,000 per closed deal, with most insurance claims ranging from $15,000 to $45,000. With a 78% average conversion rate, contractors typically earn $21,840 for every lead they receive ($28K × 78% conversion rate).",
      icon: DollarSign
    },
    {
      question: "Do you require contracts or monthly commitments?",
      answer: "No contracts, no monthly fees, no commitments. You only pay for leads you receive after your free trial. You can pause or cancel anytime, and you keep all the leads you've already received. Most contractors stay because the ROI is exceptional.",
      icon: CheckCircle
    },
    {
      question: "What areas do you service?",
      answer: "We currently service all major metropolitan areas in Texas, Oklahoma, Kansas, Nebraska, and Colorado - the primary hail belt regions. We're expanding to additional storm-prone states throughout 2025. Check if your area is covered during signup.",
      icon: Users
    },
    {
      question: "How do you verify the leads are legitimate?",
      answer: "Every lead goes through our 4-step verification: (1) Insurance policy verification, (2) Professional damage assessment with photos, (3) Homeowner qualification call, (4) Claim approval confirmation. We reject 60% of potential leads that don't meet our standards.",
      icon: Shield
    },
    {
      question: "Can I choose my service radius and lead volume?",
      answer: "Yes! You set your service radius (typically 25-50 miles) and preferred lead volume (2-10 leads per week). You can adjust these settings anytime in your CRM dashboard. We respect your capacity and won't overwhelm you with more leads than you can handle.",
      icon: Users
    }
  ];

  export const steps = [
    {
      icon: UserCheck,
      number: '01',
      title: 'Sign Up & Get Verified',
      description: 'Complete our quick contractor verification process. Licensed, insured contractors only.',
      details: ['License verification', 'Insurance check', 'Background screening']
    },
    {
      icon: FileText,
      title: 'Receive Premium Leads',
      number: '02',
      description: 'Get pre-qualified homeowners with confirmed hail damage and approved insurance claims.',
      details: ['Insurance pre-approved', 'Damage confirmed', 'Ready to hire']
    },
    {
      icon: Zap,
      title: 'Connect & Close',
      number: '03',
      description: 'Contact leads through our CRM system and close deals faster with qualified prospects.',
      details: ['CRM dashboard access', 'Lead management tools', 'Follow-up automation']
    },
    {
      icon: DollarSign,
      title: 'Get Paid & Grow',
      number: '04',
      description: 'Complete projects with guaranteed insurance payments and scale your roofing business.',
      details: ['Guaranteed payments', 'No collection issues', 'Business growth']
    }
  ];

  export const guaranteeStats = [
    { value: '78%', label: 'Average Conversion Rate', icon: Star },
    { value: '$28K', label: 'Average Job Value', icon: DollarSign },
    { value: '24hr', label: 'Lead Freshness', icon: Clock },
    { value: '100%', label: 'Money Back Guarantee', icon: Shield }
  ];

  export const verificationProcess = [
    {
      step: '01',
      title: 'Insurance Verification',
      description: 'We verify active insurance policies and confirm claim approval status.'
    },
    {
      step: '02',
      title: 'Damage Assessment',
      description: 'Professional evaluation confirms legitimate storm damage requiring repairs.'
    },
    {
      step: '03',
      title: 'Homeowner Screening',
      description: 'We qualify homeowners for timeline, budget, and decision-making authority.'
    },
    {
      step: '04',
      title: 'Lead Delivery',
      description: 'Qualified leads are delivered to you within 24 hours with full documentation.'
    }
  ];

  export const reasons = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'We are committed to delivering high-quality leads to our contractors. We have a rigorous quality assurance process in place to ensure that our leads meet the highest standards.'
    },
    {
      icon: Award,
      title: 'Experience',
      description: 'Our team has years of experience in the roofing industry, giving us the knowledge and skills needed to deliver exceptional results for contractors.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We pride ourselves on staying up-to-date with the latest industry trends and technologies, bringing innovation and creativity to every lead we provide.'
    }
  ];

  export const packages = [
    {
      name: 'Starter',
      freeLeads: '5',
      pricePerLead: '$89',
      features: ['Basic CRM access', 'Email support', 'Lead tracking'],
      popular: false
    },
    {
      name: 'Professional',
      freeLeads: '10',
      pricePerLead: '$69',
      features: ['Full CRM suite', 'Priority support', 'Territory protection'],
      popular: true
    },
    {
      name: 'Enterprise',
      freeLeads: '20',
      pricePerLead: '$49',
      features: ['Dedicated manager', 'Custom territory', 'Phone support'],
      popular: false
    }
  ];

  export const stories = [
    {
      name: 'Mike Rodriguez',
      company: 'Elite Roofing Solutions',
      location: 'Houston, TX',
      rating: 5.0,
      testimonial: "These leads are the real deal. Every single one has been pre-qualified with insurance approval. I've closed 85% of the leads I've received and my revenue has tripled in just 6 months."
    },
    {
      name: 'Sarah Johnson',
      company: 'Apex Storm Restoration',
      location: 'Dallas, TX',
      rating: 4.9,
      testimonial: "Working with Roof Claim Pros on our lead generation was a fantastic experience. Their team was professional, responsive, and delivered qualified prospects that exceeded our expectations."
    },
    {
      name: 'David Chen',
      company: 'Storm Guard Roofing',
      location: 'Austin, TX',
      rating: 5.0,
      testimonial: "Best investment I've made for my business. The CRM system keeps me organized, and the leads keep coming. I've hired 3 new crews just to keep up with demand from these quality leads."
    },
    {
      name: 'Jennifer Martinez',
      company: 'Premier Roofing Co',
      location: 'San Antonio, TX',
      rating: 4.8,
      testimonial: "The quality of leads from Roof Claim Pros is unmatched. Homeowners are ready to sign contracts, not just getting quotes. My conversion rate has never been higher."
    },
    {
      name: 'Robert Wilson',
      company: 'Reliable Storm Solutions',
      location: 'Fort Worth, TX',
      rating: 5.0,
      testimonial: "I was skeptical at first, but these insurance-backed leads have transformed my business. Every lead comes with verified damage and approved claims. It's a game changer."
    }
  ];
import { BriefcaseBusiness, ChartNoAxesCombined, Headset } from "lucide-react";

export const contact = {
  email: "Syedabdullahmadani0408@gmail.com",
  phone: "+91 70137 03786",
  tel: "+917013703786",
  whatsapp: "https://wa.me/917013703786",
};
export const navigation = [
  { title: "Home", to: "/" },
  { title: "About", to: "/about" },
  { title: "Services", to: "/services" },
  { title: "Careers", to: "/careers" },
  { title: "Contact", to: "/contact" },
] as const;
export const philosophy =
  "If a company wants to put a man on the moon and doesn't know how, we'll help them figure it out. If sales are costing too much to run locally, we'll hire a team and make those sales for them. If customer support costs more at home than it would from India, we'll deliver it from here. Whatever the problem, we start from the same place — how do we make this work for our client.";
export const services = [
  {
    id: "business-advisory",
    number: "01",
    icon: BriefcaseBusiness,
    title: "Business Advisory & Strategic Guidance",
    description:
      "We help companies solve problems they don't have an in-house answer for — from business strategy and planning to Detailed Project Reports (DPR) and incentive-claim consulting.",
    items: [
      "Business strategy and planning",
      "Problem-solving and strategic guidance",
      "Detailed Project Report (DPR) consulting",
      "Incentive-claim consulting",
    ],
  },
  {
    id: "outsourced-sales",
    number: "02",
    icon: ChartNoAxesCombined,
    title: "Outsourced Sales",
    description:
      "When running an in-house sales team costs too much locally, we build and manage one from India on the client's behalf — handling outreach, pipeline, and day-to-day performance.",
    items: [
      "Outsourced sales-team capabilities",
      "Client-facing outreach",
      "Pipeline handling",
      "Day-to-day sales performance management",
    ],
  },
  {
    id: "offshore-support",
    number: "03",
    icon: Headset,
    title: "Offshore Customer Support & Back-Office Setup",
    description:
      "We set up and run back-office and customer support operations from Hyderabad on behalf of our clients, delivering the same service at a fraction of the local cost.",
    items: [
      "Back-office setup in Hyderabad",
      "Customer support operations",
      "Outsourced operational support",
    ],
  },
];
export const jobs = [
  {
    id: "sales-executive",
    title: "Sales Executive — Outbound Sales",
    location: "Work From Home",
    shift: "6:00 AM–3:00 PM IST",
    experience: "0–2 Years",
    employment: "Full-Time, Permanent",
    openings: "6–15",
    description:
      "An outbound, voice-based sales role supporting international customers. Strong spoken English and comfort with cold calling matter more than prior experience — freshers are welcome to apply.",
    subject: "Application – Sales Executive",
  },
];

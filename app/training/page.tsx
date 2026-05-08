"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronUp  , ChevronRight } from "lucide-react"

import ListComponent from "./ListComponent"

export default function TrainingPage() {
  const salesSkillsArray = [
    // Beginner Level
    {
      level: "Beginner Level: Building Strong Foundations",
      title: "The Power of Connection",
      video: "https://www.youtube.com/embed/yyJm5IRYGgE?si=p40eMbmMEL9a-5si",
      importance: "Genuine connections are the bedrock of successful sales.",
      actionSteps: [
        "Attend team-building events and get to know your colleagues.",
        "Practice active listening during conversations with clients and team members.",
      ],
    },
    {
      level: "",
      title: "Networking 101",
      video: "https://www.youtube.com/embed/TGbUpEJ1z-k?si=22L4QsXh0awsLbrX",
      importance:
        "Expanding your professional network opens doors to opportunities.",
      actionSteps: [
        "Attend industry events and engage with fellow professionals.",
        "Utilize LinkedIn to connect with potential clients and industry leaders.",
      ],
    },
    {
      level: "",
      title: "Celebrate Small Wins",
      video: "https://www.youtube.com/embed/TGbUpEJ1z-k?si=22L4QsXh0awsLbrX",
      importance: "Recognizing achievements boosts morale and motivation.",
      actionSteps: [
        "Share successes, no matter how small, during team meetings.",
        "Foster a positive team culture by acknowledging individual and team accomplishments.",
      ],
    },
    // inter midiate Level
    {
      level: "Intermediate Level: Elevating Performance",
      title: "Deep Dive into Product Knowledge",
      video: "https://www.youtube.com/embed/TGbUpEJ1z-k?si=22L4QsXh0awsLbrX",
      importance:
        "Knowing your product inside out builds confidence and credibility.",
      actionSteps: [
        "Participate in product training sessions and workshops.",
        "Continuously update your knowledge as products evolve.",
      ],
    },
    {
      level: "",
      title: "Master the Art of Presentation",
      video: "https://www.youtube.com/embed/TGbUpEJ1z-k?si=22L4QsXh0awsLbrX",
      importance:
        "A compelling presentation showcases the value of your product.",
      actionSteps: [
        "Practice delivering polished and engaging presentations.",
        "Seek feedback from colleagues and mentors to refine your presentation skills.",
      ],
    },
    {
      level: "",
      title: "Sharpen Negotiation Skills",
      video: "https://www.youtube.com/embed/TGbUpEJ1z-k?si=22L4QsXh0awsLbrX",
      importance:
        "Effective negotiation leads to mutually beneficial outcomes.",
      actionSteps: [
        "Study negotiation techniques and strategies.",
        "Role-play scenarios to hone your negotiation skills.",
      ],
    },
    {
      level: "",
      title: "Collaborate for Success",
      video: "https://www.youtube.com/embed/TGbUpEJ1z-k?si=22L4QsXh0awsLbrX",
      importance: "Team collaboration amplifies overall performance.",
      actionSteps: [
        "Actively participate in team projects and initiatives.",
        "Foster a collaborative environment by sharing insights and best practices.",
      ],
    },
    // advance Level
    {
      level: "Advanced Level: Mastery and Leadership",
      title: "Embrace Strategic Thinking",
      video: "https://www.youtube.com/embed/TGbUpEJ1z-k?si=22L4QsXh0awsLbrX",
      importance: "Strategic planning guides long-term success.",
      actionSteps: [
        "Analyze market trends and competitor strategies.",
        "Contribute strategic insights during team discussions.",
      ],
    },
    {
      level: "",
      title: "Executive-Level Communication",
      video: "https://www.youtube.com/embed/TGbUpEJ1z-k?si=22L4QsXh0awsLbrX",
      importance:
        "Effectively communicate with decision-makers for impactful sales.",
      actionSteps: [
        "Craft clear and concise messages tailored to executive audiences.",
        "Seek mentorship on executive communication skills.",
      ],
    },
    {
      level: "",
      title: "Mentorship and Leadership",
      video: "https://www.youtube.com/embed/TGbUpEJ1z-k?si=22L4QsXh0awsLbrX",
      importance:
        "Elevate others and contribute to a culture of continuous learning.",
      actionSteps: [
        "Offer mentorship to junior colleagues.",
        "Lead by example, fostering a culture of collaboration and growth.",
      ],
    },
    {
      level: "",
      title: "Master the Artistry of Closing Deals",
      video: "https://www.youtube.com/embed/TGbUpEJ1z-k?si=22L4QsXh0awsLbrX",
      importance: "Closing high-stakes deals requires finesse and expertise.",
      actionSteps: [
        "Study successful deal closures, learning from both successes and challenges.",
        "Continuously refine your approach, incorporating insights from experienced peers.",
      ],
    },
  ]
  const [active, setActive] = useState("")
  const [top, setTop] = useState(false)
  const handleScroll = () => {
    if (window.scrollY > 250) {
      setTop(true);
    } else {
      setTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <div className="container relative min-h-[100vh] z-0">
      <div className="flex min-w-11/12">
        <div className="relative flex w-full min-h-screen">
          <div className="w-full h-full pr-10 mb-10">
            <div>
              {salesSkillsArray.map((item, index) => {
                return (
                  <ListComponent
                    setActive={setActive}
                    key={index}
                    id={index + 1}
                    video={item.video}
                    level={item.level}
                    title={item.title}
                    importance={item.importance}
                    actionSteps={item.actionSteps}
                  />
                )
              })}
            </div>
          </div>
          {/* //============================left sidebar  */}
          <div className="w-[480px] h-[100vh] sticky top-[12%] right-0">
            <ul className="min-h-screen p-8 bg-white border rounded-md shadow-md">
              {salesSkillsArray.map((item, index) => (
                <div key={index}>
                  <li
                    className={
                      item.level !== ""
                        ? "mt-5 font-bold text-[16px] hover:text-primary hover:font-bold transition-all duration-500 ease-in-out first:mt-0"
                        : ""
                    }
                  >
                    <Link href={`#${item.title}`}>{item.level}</Link>
                  </li>
                  <li className={"my-2 group"}>
                    <a
                      href={`#${item.title}`}
                      className={`flex items-start text-sm group-hover:text-primary hover:font-bold hover:pl-2 transition-all duration-500 ease-in-out gap-x-2 ${
                        active === item.title
                          ? "text-primary font-bold pl-2 underline"
                          : ""
                      }`}
                    >
                      <ChevronRight
                        size={20}
                        className="hover:text-primary transition-all duration-500 ease-in-out mt-[3px]"
                      />
                      {item.title}
                    </a>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {top && (
        <button
          className="sticky bottom-5 w-9 h-9 flex border justify-center items-center ml-auto bg-white shadow-md rounded-full z-[999]"
          onClick={scrollToTop}
        >
          <ChevronUp   className="text-white transition-all duration-500 ease-in-out rounded-full hover:bg-white size-8 bg-primary hover:text-primary" />
        </button>
      )}
    </div>
  )
}

"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

interface Repo {
  bgColor: string;
  title: string;
  description: string;
  githubLink: string;
  link: string;
}

export default function Home() {
  const navRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current && footerRef.current) {
        const navRect = navRef.current.getBoundingClientRect();
        const footerRect = footerRef.current.getBoundingClientRect();

        if (navRect.bottom > footerRect.top) {
          setIsNavVisible(false);
        } else {
          setIsNavVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch("https://api.github.com/users/connorknoetze/repos", {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          },
        });

        if (response.status === 403) {
          console.error("Rate limit exceeded. Please wait until the limit resets.");
          return;
        }

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        setRepos(
          data.map((repo: any) => ({
            bgColor:"bg-black/40",
            title: repo.name,
            description: repo.description || "No description provided.",
            githubLink: repo.html_url,
            link: `/Projects/Displays/${repo.name}`,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch GitHub repos:", error);
      }
    };

    fetchRepos();
  }, []);

  return (
    <div className="grid grid-row min-h-screen font-[family-name:var(--font-geist-sans)] bg-gradient-to-bl from-tuna via-gondola to-diesel ">
      
      <div className="flex row-start w-full items-center justify-center" id="header">
        <header className="flex gap-20 items-center justify-center h-auto w-full bg-gradient-to-br from-blue-950 via-licorice to-cocoa_bean shadow-2xl p-20">
          <h1 className="flex h-full font-bold text-4xl justify-center items-center text-white">Projects</h1>
        </header>
      </div>

      <div className="row-start-2 w-full flex min-h-screen">
        {/* Vertical Navigation Menu */}
        <nav 
          ref={navRef}
          className={`flex flex-col gap-10 border-r-3 border-t-3 border-b-3 border-cocoa_bean min-w-[60px] items-left h-auto fixed top-1/2 left-0 -translate-y-1/2 z-20 bg-licorice shadow-lg rounded-r-xl pt-5 pb-5 pl-5 pr-1 justify-center transition-opacity duration-300 ${isNavVisible ? 'opacity-100' : 'opacity-0'}`}>
          {[
            { href: "/", icon: "/home.png", alt: "Home Icon", label: "| Home" },
            {
              href: "/Projects",
              icon: "/projects.png",
              alt: "Projects Icon",
              label: "| Projects",
            },
            {
              href: "https://github.com/connorknoetze",
              icon: "/github.png",
              alt: "Github Icon",
              label: "| Github",
              external: true,
            },
            { href: "/Contact", icon: "/contact.png", alt: "Contact Icon", label: "| Contact" },
          ].map(({ href, icon, alt, label, external }) => (
            <a
              key={label}
              href={href}
              className="group flex items-center gap-2 text-lg font-medium relative text-white"
              style={{ minWidth: 0 }}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <Image
                aria-hidden
                src={icon}
                alt={alt}
                width={35}
                height={35}
                className="transition-transform duration-500 group-hover:scale-110"
              />
              <span className="ml-2 opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[120px] transition-all duration-500 overflow-hidden whitespace-nowrap">
                {label}
              </span>
            </a>
          ))}
        </nav>

        {/* Main Content */}
        <main id="main" className="flex flex-col w-full h-full ml-20">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full h-full p-2.5 gap-5 transition-all duration-700">
            {repos.map(({ bgColor, title, description, githubLink, link }, index) => (
              <div
                key={index}
                className={`w-full min-w-[200px] min-h-[300px] flex flex-col ${bgColor} p-5 gap-5 hover:scale-105 hover:shadow-lg hover:bg-gray-600/20 transition-all transform-all duration-500 justify-center items-center rounded-4xl`}
              >
                <a href={link} className="text-center font-bold text-lg">
                  <div className="hover:scale-105 transform-all duration-350 text-blue-400 underline">{title}</div>
                </a>
                <div className="text-center text-white">{description}</div>
                <a href={githubLink} target="_blank" rel="noopener noreferrer" className="flex gap-1 hover:scale-[105%] transform-all duration-350 text-blue-400">
                  <img src="github.png" width={20} height={20}/>
                  Github link
                </a>
              </div>
            ))}
            </div>
        </main>
      </div>
      {/* Footer */}
      <div ref={footerRef} className="row-start-3 w-full" id="footer">
        <footer className="flex flex-row flex-wrap w-full shadow-2xl pt-10 pb-10 justify-center bg-gradient-to-bl from-cocoa_bean via-licorice to-blue-950">
          
          {/* PFP Section */}
          <div className="flex flex-[1] flex-row w-full h-full ml-[5vw] mr-[5vw] mb-10 items-center">
            <div className="flex flex-1 w-full h-full max-w-100 items-center justify-end pr-2">
              <a href="https://github.com/connorknoetze" target="_blank" rel="noopener noreferrer" className=""><img src={"pfp.png"} width={200} className="border-3 rounded-full hover:shadow-lg shadow-white transition-all duration-350 min-w-50"></img></a>
            </div>
            <div className="flex flex-[0.5] flex-col w-full h-full items-center justify-center">
              <div className="flex flex-col flex-[1] w-full h-full p-5 gap-3 justify-center">
                <h1 className="font-bold text-white" >Connor Knoetze</h1>
                <p className="text-white">Bachelor Of Science (BSc)</p>
                <p className="text-white">Computer Science</p>
              </div>
            </div>
          </div>

          {/* Pages */}
          <div className="flex flex-col flex-[1] items-center justify-center w-full h-fill min-w-50 max-w-200 p-5 m-2.5 ml-[5vw] mr-[5vw] bg-gray-600/15 hover:bg-gray-500/15 rounded-2xl transition-colors duration-350 shadow-xl hover:shadow-2xl">
            {/* Quicklinks Text Box */}
            <div className="flex flex-1 w-full h-full">
              <div className="flex flex-[0.2] w-full h-full"></div>
              <div className="flex flex-[1] w-full h-full items-center justify-center border-b-2 border-b-cocoa_bean">
                <h1 className="flex font-bold text-2xl text-white">
                  Pages
                </h1>
              </div>
              <div className="flex flex-[0.2] w-full h-full"></div>
            </div>
            
            {/* Pages Content */}
            <div className="flex flex-1 w-full h-full items-center justify-center pt-5">
              <a className="flex flex-1 items-center justify-center hover:bg-gradient-to-bl from-cocoa_bean via-licorice to-tuna text-gray-300 text-lg w-full h-full rounded-2xl gap-2" href="/">
                <img src="/home.png" alt="projects" className="max-w-5 max-h-5"></img>
              Home
              </a>
            </div>
            <div className="flex flex-1 w-full h-full items-center justify-center">
              <a className="flex flex-1 items-center justify-center hover:bg-gradient-to-bl from-cocoa_bean via-licorice to-tuna text-gray-300 text-lg w-full h-full rounded-2xl gap-2" href="/Projects">
                <img src="/projects.png" alt="projects" className="max-w-5 max-h-5"></img>
              Projects
              </a>
            </div>
            <div className="flex flex-1 w-full h-full items-center justify-center">
              <a className="flex flex-1 items-center justify-center hover:bg-gradient-to-bl from-cocoa_bean via-licorice to-tuna text-gray-300 text-lg w-full h-full rounded-2xl gap-2" href="https://github.com/connorknoetze">
                <img src="/github.png" alt="projects" className="max-w-5 max-h-5"></img>
              Github
              </a>
            </div>
            <div className="flex flex-1 w-full h-full items-center justify-center">
              <a className="flex flex-1 items-center justify-center hover:bg-gradient-to-bl from-cocoa_bean via-licorice to-tuna text-gray-300 text-lg w-full h-full rounded-2xl gap-2" href="/Contact">
                <img src="/contact.png" alt="projects" className="max-w-5 max-h-5"></img>
              Contact
              </a>
            </div>

          </div>

          {/* Quick Menu */}
          <div className="flex flex-col flex-[1] items-center justify-center w-full h-fill min-w-50 max-w-200 p-5 m-2.5 ml-[5vw] mr-[5vw] bg-gray-600/15 hover:bg-gray-500/15 rounded-2xl transition-colors duration-350 shadow-xl hover:shadow-2xl">
            <div className="flex flex-1 w-full h-full">
              <div className="flex flex-[0.2] w-full h-full"></div>
              <div className="flex flex-[1] w-full h-full items-center justify-center border-b-2 border-b-cocoa_bean">
                <h1 className="flex font-bold text-2xl text-white">
                  Quick Menu
                </h1>
              </div>
              <div className="flex flex-[0.2] w-full h-full"></div>
            </div>

            <div className="flex flex-1 w-full h-full items-center justify-center pt-5">
              <a className="flex flex-1 items-center justify-center hover:bg-gradient-to-bl from-cocoa_bean via-licorice to-tuna text-gray-300 text-lg w-full h-full rounded-2xl" href="/#main">Welcome</a>
            </div>
            <div className="flex flex-1 w-full h-full items-center justify-center">
              <a className="flex flex-1 items-center justify-center hover:bg-gradient-to-bl from-cocoa_bean via-licorice to-tuna text-gray-300 text-lg w-full h-full rounded-2xl" href="/#My Skills">My Skills</a>
            </div>
            <div className="flex flex-1 w-full h-full items-center justify-center">
              <a className="flex flex-1 items-center justify-center hover:bg-gradient-to-bl from-cocoa_bean via-licorice to-tuna text-gray-300 text-lg w-full h-full rounded-2xl" href="/#About">About me</a>
            </div>

          </div>

        </footer>
      </div>
    </div>
    
  );
}
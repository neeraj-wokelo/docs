import { useState, useEffect } from "react"

export const LogoGridv2 = () => {
  const [isDark, setIsDark] = useState(
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  )

  useEffect(() => {
    if (typeof document === "undefined") return
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  const base = "https://wkemails.blob.core.windows.net/fe-application/akta-pro/logo-carousel"

  const row1 = [
    { name: "KPMG", src: `${base}/kpmg-2.svg`, w: 102, h: 58 },
    { name: "Zams", src: `${base}/zams.svg`, w: 100, h: 40 },
    { name: "Adobe", src: `${base}/adobe-2.svg`, w: 120, h: 40 },
    { name: "Premji Invest", src: `${base}/premji-2.svg`, w: 140, h: 50 },
  ]

  const row2 = [
    { name: "Vestberry", src: `${base}/vestberry.svg`, w: 130, h: 40 },
    { name: "Chicago Booth", src: `${base}/chicagobooth.svg`, w: 160, h: 40 },
    { name: "LQD", src: `${base}/lqd-2.svg`, w: 100, h: 40 },
    { name: "JLL", src: `${base}/jll-2.svg`, w: 100, h: 40 },
  ]

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "48px",
    width: "100%",
  }

  return (
    <div
      className="logov2-wrap"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "30px",
        width: "100%",
      }}
    >
      <style>{`
        @media (min-width: 1024px) and (max-width: 1299px) {
          .logov2-wrap { zoom: 0.68; }
        }
        @media (min-width: 1300px) and (max-width: 1499px) {
          .logov2-wrap { zoom: 0.78; }
        }
        @media (min-width: 1500px) and (max-width: 1699px) {
          .logov2-wrap { zoom: 0.88; }
        }
      `}</style>
      <div style={rowStyle}>
        {row1.map((logo) => (
          <img
            key={logo.name}
            src={logo.src}
            alt={logo.name}
            loading="eager"
            style={{
              width: `${logo.w}px`,
              height: `${logo.h}px`,
              objectFit: "contain",
              flexShrink: 0,
              transition: "opacity 0.2s ease",
            }}
          />
        ))}
      </div>

      <div style={rowStyle}>
        {row2.map((logo) => (
          <img
            key={logo.name}
            src={logo.src}
            alt={logo.name}
            loading="eager"
            style={{
              width: `${logo.w}px`,
              height: `${logo.h}px`,
              objectFit: "contain",
              flexShrink: 0,
              transition: "opacity 0.2s ease",
            }}
          />
        ))}
      </div>
    </div>
  )
}

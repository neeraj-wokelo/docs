import { useState, useEffect } from "react"

export const MobileLogos = () => {
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

  const row1 = [
    { name: "KPMG", src: isDark ? "https://wkemails.blob.core.windows.net/fe-application/akta-pro/logo-carousel/kpmg-2.svg" : "/images/kpmg-black.svg", w: 80, h: 45 },
    { name: "Zams", src: isDark ? "https://wkemails.blob.core.windows.net/fe-application/akta-pro/logo-carousel/zams.svg" : "/images/zams.svg", w: 75, h: 30 },
  ]

  const row2 = [
    { name: "Adobe", src: isDark ? "https://wkemails.blob.core.windows.net/fe-application/akta-pro/logo-carousel/adobe-2.svg" : "/images/adobe-black.svg", w: 85, h: 30 },
    { name: "Premji Invest", src: isDark ? "https://wkemails.blob.core.windows.net/fe-application/akta-pro/logo-carousel/premji-2.svg" : "/images/premji.svg", w: 100, h: 35 },
  ]

  const row3 = [
    { name: "Vestberry", src: isDark ? "https://wkemails.blob.core.windows.net/fe-application/akta-pro/logo-carousel/vestberry.svg" : "/images/vestberry.svg", w: 90, h: 30 },
    { name: "LQD", src: isDark ? "https://wkemails.blob.core.windows.net/fe-application/akta-pro/logo-carousel/lqd-2.svg" : "/images/lqd-black.svg", w: 75, h: 30 },
  ]

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "32px",
    width: "100%",
  }

  const imgStyle = (w, h) => ({
    width: `${w}px`,
    height: `${h}px`,
    objectFit: "contain",
    flexShrink: 0,
    transition: "opacity 0.2s ease",
  })

  const renderRow = (logos) =>
    logos.map((logo) => (
      <img
        key={logo.name}
        src={logo.src}
        alt={logo.name}
        loading="eager"
        style={imgStyle(logo.w, logo.h)}
      />
    ))

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "28px",
      width: "100%",
    }}>
      <div style={rowStyle}>{renderRow(row1)}</div>
      <div style={rowStyle}>{renderRow(row2)}</div>
      <div style={rowStyle}>{renderRow(row3)}</div>
    </div>
  )
}

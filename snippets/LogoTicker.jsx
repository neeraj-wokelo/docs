export const LogoTicker = ({ children, className = "" }) => {
  return (
    <div
      className={className}
      style={{
        width: "100%",
        maxWidth: "1800px",
        margin: "0 auto",
        paddingTop: "35px",
        paddingBottom: "35px",
        paddingLeft: "40px",
        paddingRight: "40px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "28px",
      }}
    >
      {children}
    </div>
  )
}

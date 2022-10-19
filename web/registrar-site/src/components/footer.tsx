export const Footer = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "1rem",
      }}
    >
      <span
        style={{
          marginBottom: "1rem",
        }}
      >
        © 2022 PureFactos LLC.
      </span>
      <ul
        style={{
          listStyleType: "none",
          display: "flex",
          gap: "3rem",
          padding: "0",
          margin: "0",
          visibility: "hidden",
        }}
      >
        <li>Terms</li>
        <li>Privacy</li>
        <li>Security</li>
        <li>Contact</li>
      </ul>
    </div>
  );
};

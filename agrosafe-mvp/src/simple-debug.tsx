// Simple debug component to test if React is working
import React from "react";

console.log("simple-debug.tsx: Component loaded");

const SimpleDebug = () => {
  console.log("simple-debug.tsx: Component rendering");
  
  React.useEffect(() => {
    console.log("simple-debug.tsx: Component mounted");
    document.body.style.backgroundColor = "lightblue";
  }, []);
  
  return (
    <div style={{ padding: "20px", backgroundColor: "white", border: "2px solid red" }}>
      <h1>Debug Component</h1>
      <p>If you can see this, React is working correctly.</p>
      <p>Check the console for more debugging information.</p>
    </div>
  );
};

export default SimpleDebug;
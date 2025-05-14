import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const meta = document.createElement('meta');
meta.name = 'description';
meta.content = 'MEOWTH FASHION - A cat-themed clothing store with the latest trends and purr-fect styles for every occasion.';
document.head.appendChild(meta);

const title = document.createElement('title');
title.textContent = 'MEOWTH FASHION | Cat-themed Clothing Store';
document.head.appendChild(title);

const openGraph = [
  { property: 'og:title', content: 'MEOWTH FASHION | Cat-themed Clothing Store' },
  { property: 'og:description', content: 'Shop the latest trends and purr-fect styles for every occasion at MEOWTH FASHION.' },
  { property: 'og:type', content: 'website' },
  { property: 'og:url', content: window.location.href },
];

openGraph.forEach(({ property, content }) => {
  const meta = document.createElement('meta');
  meta.setAttribute('property', property);
  meta.content = content;
  document.head.appendChild(meta);
});

createRoot(document.getElementById("root")!).render(<App />);

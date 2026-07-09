import { useState, useEffect } from 'react';

export const ApiCodeSwitcher = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [activeLang, setActiveLang] = useState('cURL');
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const codeExamples = {
    news: {
      cURL: `curl -G "https://api.akta.pro/api/v1/news/?company=00000l1&unique_article=false" \\
  -H "x-api-key: YOUR_API_KEY"`,
      Python: `import requests

url = "https://api.akta.pro/api/v1/news/"
headers = {"x-api-key": "YOUR_API_KEY"}
params = {
    "company": "00000l1",
    "unique_article": "false"
}

response = requests.get(url, headers=headers, params=params)
data = response.json()

# data["status"] == "success"
# data["total"]  — total matching articles
for article in data["data"]:
    print(article["title"])
    print(article["published_date"], article["publisher"])
    print(article["primary_tag"], "|", article["sentiment"])
    print(article["ai_summary"])
    print(article["url"])
    print()`,
      JavaScript: `const params = new URLSearchParams({
  company: "00000l1",
  unique_article: "false"
});

const response = await fetch(
  \`https://api.akta.pro/api/v1/news/?\${params}\`,
  { headers: { "x-api-key": "YOUR_API_KEY" } }
);

const { status, data, total } = await response.json();

// status === "success", total = total matching articles
for (const article of data) {
  console.log(article.title);
  console.log(article.published_date, article.publisher);
  console.log(article.primary_tag, "|", article.sentiment);
  console.log(article.ai_summary);
  console.log(article.url);
}`
    },
    company: {
      cURL: `curl -G "https://api.akta.pro/api/v1/company/enrichment/?company=00000l1&sections=firmographic" \\
  -H "x-api-key: YOUR_API_KEY"`,
      Python: `import requests

url = "https://api.akta.pro/api/v1/company/enrichment/"
headers = {"x-api-key": "YOUR_API_KEY"}
params = {
    "company": "00000l1",
    "sections": "firmographic"
}

response = requests.get(url, headers=headers, params=params)
data = response.json()

print(data["data"])`,
      JavaScript: `const params = new URLSearchParams({
  company: "00000l1",
  sections: "firmographic"
});

const response = await fetch(
  \`https://api.akta.pro/api/v1/company/enrichment/?\${params}\`,
  { headers: { "x-api-key": "YOUR_API_KEY" } }
);

const { data } = await response.json();
console.log(data);`
    }
  };

  const tabs = [
    { id: 'news', label: 'News Signals', href: '/api-reference/news' },
    { id: 'company', label: 'Company Data', href: '/api-reference/company-enrichment' }
  ];

  const languages = ['cURL', 'Python', 'JavaScript'];

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab][activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @media screen and (max-width: 768px) {
          .api-code-switcher-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    <div style={{
      display: 'grid',
      gridTemplateColumns: '280px minmax(0, 1fr)',
      gap: '1.2rem',
      alignItems: 'start',
    }}
    className="api-code-switcher-grid"
    >
      {/* Left: API tabs */}
      <div style={{ display: 'grid', gap: '0.75rem' }}>
  {tabs.map((tab) => {
    const isActive = activeTab === tab.id;

    return (
    <div
  onClick={() => { if (!isActive) setActiveTab(tab.id); }}
  className={`
    mint-block mint-w-full mint-rounded-[14px] mint-p-4 mint-border mint-leading-[1.35]
    mint-transition-all mint-duration-150 mint-cursor-pointer mint-select-none
    ${isActive
      ? "dark:mint-text-white mint-text-black"
      : "mint-bg-[#F6F6F6] mint-border-[#D4D4D4] dark:mint-bg-transparent dark:mint-text-white dark:mint-border-[rgba(109,109,109,0.42)]"
    }
  `}
  style={
    isActive
      ? {
          borderColor: "rgba(32,212,207,0.55)",
          background: isDark
            ? "linear-gradient(180deg, rgba(32,212,207,0.08) 0%, rgba(32,212,207,0.13) 100%)"
            : "linear-gradient(180deg, rgba(230,245,245,0.9) 0%, rgba(210,235,235,0.95) 100%)",
          boxShadow: "0 0 0 1px rgba(32,212,207,0.14)",
          backdropFilter: "blur(10px)",
        }
      : undefined
  }
>
  {tab.label}
</div>

    );
  })}
</div>

      {/* Right: Code block */}
        <div style={{
          overflow: 'hidden',
          borderRadius: '20px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          background: isDark ? '#0B0C0E' : '#F5F5F5',
          backdropFilter: 'blur(12px)',
          minHeight: '450px',
          maxHeight: '450px',
        }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
          background: isDark ? 'rgba(33, 31, 29, 0.86)' : 'rgba(240, 240, 240, 0.9)',
          padding: '0.9rem 1rem 0',
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.15rem',
            fontSize: '0.94rem',
          }}>
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                style={{
                  display: 'inline-flex',
                  paddingBottom: '0.9rem',
                  color: activeLang === lang ? (isDark ? '#ffffff' : '#000000') : (isDark ? 'rgba(255, 255, 255, 0.54)' : 'rgba(0, 0, 0, 0.45)'),
                  borderBottom: activeLang === lang ? '2px solid #20d4cf' : '2px solid transparent',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeLang === lang ? '2px solid #20d4cf' : '2px solid transparent',
                  marginBottom: '-1px',
                  cursor: 'pointer',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                {lang}
              </button>
            ))}
          </div>

          <span
            onClick={handleCopy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '36px',
              padding: '0 0.95rem',
              borderRadius: '12px',
              border: copied ? '1px solid #41af97' : (isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'),
              background: copied ? 'rgba(65, 175, 151, 0.2)' : (isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'),
              color: copied ? '#41af97' : (isDark ? 'rgba(255, 255, 255, 0.76)' : 'rgba(0, 0, 0, 0.65)'),
              fontSize: '0.92rem',
              cursor: 'pointer',
              marginTop:'-15px',
              transition: 'all 0.15s ease',
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </span>
        </div>

        <pre style={{
          margin: 0,
          padding: '1.35rem 1.15rem 1.5rem',
          background: isDark ? '#0B0C0E' : 'transparent',
          overflowX: 'auto',
          overflowY: 'auto',
          minHeight: '450px',
          maxHeight: '450px',
        }}>
          <code style={{
            fontSize: '0.86rem',
            lineHeight: 1.82,
            color: isDark ? '#9dc2ff' : '#1a1a1a',
            whiteSpace: 'pre',
          }}>
            {codeExamples[activeTab][activeLang]}
          </code>
        </pre>
      </div>
    </div>
    </>
  );
};

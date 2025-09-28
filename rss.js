// Simple static RSS generator for GitHub Pages
// Loads config.json, fetches issue pages, generates RSS XML

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load config
    const response = await fetch('config.json');
    const config = await response.json();

    // Build RSS XML
    let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${config.feed.title}</title>
    <link>${config.feed.link}</link>
    <description>${config.feed.description}</description>
    <language>${config.feed.language}</language>
    <pubDate>${config.feed.pubDate}</pubDate>
    ${config.issues.map(issue => {
      // Fetch page and extract content (basic scraping)
      // In a real setup, you'd await fetch(issue.url) and parse DOM here
      // For now, use config-provided desc; extend with fetch if needed
      return `
    <item>
      <title>${issue.title}</title>
      <link>${issue.url}</link>
      <description>${issue.description}</description>
      <pubDate>${issue.pubDate}</pubDate>
      <guid>${issue.guid}</guid>
    </item>`;
    }).join('')}
  </channel>
</rss>`;

    // Display/download the RSS
    const pre = document.createElement('pre');
    pre.textContent = rss;
    document.body.appendChild(pre);

    // Auto-download as XML
    const blob = new Blob([rss], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'liminal-rss.xml';
    a.textContent = 'Download RSS Feed';
    document.body.appendChild(a);

    // For directories: Provide direct RSS URL (view source or /rss.xml)
    console.log('RSS ready! Use this page or save as /rss.xml for linking.');

  } catch (error) {
    document.body.innerHTML = `<p>Error: ${error.message}</p>`;
  }
});

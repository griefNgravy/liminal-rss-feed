// Simple static RSS generator for GitHub Pages
// Loads config.json, fetches issue pages, generates RSS XML

// Function to escape XML special characters
function escapeXML(str) {
  return str.replace(/&/g, '&amp;')
           .replace(/</g, '&lt;')
           .replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;')
           .replace(/'/g, '&apos;');
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load config
    const response = await fetch('config.json');
    const config = await response.json();

    // Define feed URL (update with your GitHub Pages URL)
    const feedUrl = 'https://griefngravy.github.io/liminal-rss-feed/rss.xml';

    // Build RSS XML
    let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXML(config.feed.title)}</title>
    <link>${escapeXML(config.feed.link)}</link>
    <description>${escapeXML(config.feed.description)}</description>
    <language>${config.feed.language}</language>
    <pubDate>${config.feed.pubDate}</pubDate>
    <atom:link href="${escapeXML(feedUrl)}" rel="self" type="application/rss+xml" />
    ${config.issues.map(issue => {
      return `
    <item>
      <title>${escapeXML(issue.title)}</title>
      <link>${escapeXML(issue.url)}</link>
      <description>${escapeXML(issue.description)}</description>
      <pubDate>${issue.pubDate}</pubDate>
      <guid isPermaLink="false">${escapeXML(issue.guid)}</guid>
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

    console.log('RSS ready! Use this page or save as /rss.xml for linking.');

  } catch (error) {
    document.body.innerHTML = `<p>Error: ${error.message}</p>`;
  }
});

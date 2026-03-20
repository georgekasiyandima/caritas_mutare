/**
 * Seed the "Caritas Mutare Day of the Poor" news article.
 * Run from server directory: node scripts/seed-day-of-poor.js
 */
const { dbRun } = require('../database/database');

const content_en = `Caritas Mutare celebrated the Day of the Poor with joy and solidarity. In line with Pope Francis' message, we reflected on serving the vulnerable as serving Christ. The day saw generous donations pouring in that included 5000 litre tank from Electro Sales, individuals and parishes across the diocese contributed clothing, food, and essentials. Communities came together to share meals and uplift the marginalized. "The poor are the privileged of God's kingdom," echoed Pope Francis' words, guiding our actions. Caritas Mutare's soup kitchen served the homeless and pre-school children entertained everyone present with poems and speeches. The celebration reinforced Caritas' mission: serving with compassion, advocating for dignity and building on the Day of The Poor celebrations.

The event saw participation from key partners:
• His Lordship Bishop Paul Horan (O'CARM)
• Peter Macghee – Director, Trocaire Zimbabwe Country Office representative
• Caritas National Office representatives
• CAFOD and CRS delegates
• Caritas Mutare board members
• Sister Organizations (Youth Alive Zimbabwe, Diocese of Mutare Community Care Program, SOCCOM, Education Commission, CCJP, Caritas Masvingo, Caritas Chinhoyi and Caritas Harare).`;

const excerpt_en = "Caritas Mutare celebrated the Day of the Poor with joy and solidarity. In line with Pope Francis' message, we reflected on serving the vulnerable as serving Christ.";

const gallery = JSON.stringify([
  {
    src: '/images/news/day-of-poor-bishop-horan.png',
    caption: "His Lordship, Bishop Paul Horan - celebrating Mass during Caritas Day of The Poor celebrations",
  },
  {
    src: '/images/news/day-of-poor-peter-macghee.png',
    caption: 'Mr Peter MacGhee - Trocaire Zimbabwe Country Representative (Guest of Honor) giving speech during the Caritas Day of the Poor Celebrations.',
  },
]);

async function seed() {
  try {
    const published_at = new Date().toISOString();
    await dbRun(
      `INSERT INTO news (title_en, title_sh, content_en, content_sh, excerpt_en, excerpt_sh, featured_image, gallery, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Caritas Mutare Day of the Poor',
        'Caritas Mutare Day of the Poor',
        content_en,
        '',
        excerpt_en,
        '',
        '/images/news/day-of-poor-bishop-horan.png',
        gallery,
        'published',
        published_at,
      ]
    );
    console.log('Day of the Poor article seeded successfully.');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
  process.exit(0);
}

seed();

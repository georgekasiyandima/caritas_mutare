/**
 * Canonical contact / brand information for Caritas Mutare.
 *
 * Every page on the public site that shows a phone number, email, address
 * or opening hours should import from here — previously the same details
 * lived in 4+ places and had drifted apart (Mai Maria Village vs. "Cnr
 * Jason Moyo & Herbert Chitepo", admin@ vs. egumbeze@).  Changing a number
 * should now only mean editing this file.
 */

export const orgContact = {
  name: 'Caritas Zimbabwe · Diocese of Mutare',
  shortName: 'Caritas Mutare',
  email: {
    primary: 'admin@caritasmutare.org',
    coordinator: 'egumbeze@caritasmutare.org',
  },
  phones: {
    main: '+263 77 467 1893',
    office: '+263 20 60504',
    fax: '+263 20 65077',
  },
  address: {
    /** Single address line suitable for a label or chip. */
    short: 'Mai Maria Village, Dangamvura, Mutare',
    /** Full postal address, with linebreaks for card display. */
    lines: [
      'Mai Maria Village',
      'Stand No. 19449, Dangamvura Township',
      'Triangle of Raheen, Mutare District',
      'Zimbabwe',
    ],
  },
  hours: [
    { days: 'Mon – Thu', time: '08:00 – 16:45' },
    { days: 'Friday', time: '08:00 – 13:00' },
  ],
  social: {
    facebook: 'https://www.facebook.com/share/1DoS9a5mzU/',
    linkedin: 'https://www.linkedin.com/in/caritas-zimbabwe-diocese-of-mutare-460272300',
  },
  /** OpenStreetMap / Google Maps link for Mai Maria Village, Dangamvura. */
  maps: {
    /** Approximate location — Dangamvura, Mutare. Replace with the exact
     * Mai Maria Village coordinates when we have them from the team. */
    embedSrc:
      'https://www.openstreetmap.org/export/embed.html?bbox=32.66%2C-18.99%2C32.70%2C-18.96&layer=mapnik&marker=-18.978%2C32.68',
    directionsUrl:
      'https://www.google.com/maps/search/?api=1&query=Mai+Maria+Village+Dangamvura+Mutare+Zimbabwe',
  },
} as const;

export type OrgContact = typeof orgContact;

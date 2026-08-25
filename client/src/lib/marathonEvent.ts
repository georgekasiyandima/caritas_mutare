/**
 * Single source for the Caritas Mutare 21km Marathon public page.
 *
 * Date, route and registration channel stay "to be announced" until Angela
 * confirms. Full race set lives in client/public/images/events/marathon/
 * (from the shared Caritas Charity Run Drive folder). The gallery lists a
 * curated subset so the page stays light.
 */

export interface MarathonImage {
  src: string;
  alt: string;
  objectPosition?: string;
}

const marathonSrc = (file: string) => `/images/events/marathon/${file}`;

export const marathonEvent = {
  name: 'Caritas Mutare 21km Marathon',
  shortName: '21km Marathon',
  year: 2026,
  distanceKm: 21,
  entryFeeUsd: 20,
  dateLabel: 'Date to be announced',
  routeLabel: 'Route to be announced',
  locationLabel: 'Mutare',
  path: '/events/marathon',
  cause: {
    title: 'Soup Kitchen',
    path: '/programs/soup-kitchen',
  },
  hero: {
    src: marathonSrc('DSC_2850.jpg'),
    alt: 'Runners gathered at the Caritas Mutare Charity Run start line',
    objectPosition: 'center 42%',
    caption: 'Caritas Charity Run — Mutare',
  } satisfies MarathonImage & { caption: string },
  raceGallery: [
    {
      src: marathonSrc('DSC_2896.jpg'),
      alt: 'Runners coming through the START banner to support the Soup Kitchen',
      objectPosition: 'center 40%',
    },
    {
      src: marathonSrc('DSC_2868.jpg'),
      alt: 'A pack of Charity Run participants on the road in Mutare',
      objectPosition: 'center 40%',
    },
    {
      src: marathonSrc('DSC_2848.jpg'),
      alt: 'Runners in Caritas event shirts on a Mutare street',
      objectPosition: 'center 40%',
    },
    {
      src: marathonSrc('DSC_2887.jpg'),
      alt: 'Participants smiling during the Charity Run',
      objectPosition: 'center 35%',
    },
    {
      src: marathonSrc('DSC_2874.jpg'),
      alt: 'The field under the banner: Run to support the soup kitchen',
      objectPosition: 'center 40%',
    },
    {
      src: marathonSrc('DSC_2841.jpg'),
      alt: 'Start line banner for the Caritas Charity Run',
      objectPosition: 'center 45%',
    },
    {
      src: marathonSrc('DSC_2906.jpg'),
      alt: 'Community members walking the Charity Run together',
      objectPosition: 'center 30%',
    },
    {
      src: marathonSrc('DSC_2911.jpg'),
      alt: 'A young runner on the Charity Run course',
      objectPosition: 'center 30%',
    },
  ] satisfies MarathonImage[],
  kitchenGallery: [
    {
      src: '/images/programs/soup-kitchen/soup-kitchen-gallery-07.png',
      alt: 'Volunteers cooking meals over open fires at the Soup Kitchen',
      objectPosition: 'center 40%',
    },
    {
      src: '/images/programs/soup-kitchen/soup-kitchen-gallery-08.png',
      alt: 'A volunteer serving a hot meal at the Soup Kitchen',
      objectPosition: 'center 40%',
    },
    {
      src: '/images/programs/soup-kitchen/soup-kitchen-gallery-09.png',
      alt: 'Community members receiving meals at the Soup Kitchen',
      objectPosition: 'center 40%',
    },
    {
      src: '/images/programs/soup-kitchen/soup-kitchen-gallery-11.png',
      alt: 'A Carmelite nun helping prepare Soup Kitchen meals',
      objectPosition: 'center 38%',
    },
  ] satisfies MarathonImage[],
};

export type MarathonEvent = typeof marathonEvent;

export const siteConfig = {
  name: "AlMuallim Travels and Tours",
  shortName: "AlMuallim Travels",
  url: "https://almuallimtravels.com",
  email: "almuallimtravels@gmail.com",
  phoneNumbers: ["+92 321-3110100", "+92 311-2774836", "+92 342-8011000"],
  address: "48-B, RJ Mall, Main Rashid Minhas Road, Karachi, Pakistan",
  googleRating: {
    score: 5.0,
    totalReviews: 535,
    label: "Google Reviews",
    url: "https://www.google.com/maps/place/AlMuallim+Travels/@24.9025967,67.1146403,17z/data=!3m1!5s0x3eb339217cd74d41:0x5072457459ee92cb!4m8!3m7!1s0x3eb33d416aff08b1:0x8672062ac7450800!8m2!3d24.9025967!4d67.1146403!9m1!1b1!16s%2Fg%2F11wwrsd_qb",
  },
  social: {
    facebook: "https://www.facebook.com/Almuallimtravels/",
    youtube: "https://youtube.com/@Almuallimtravels",
    whatsapp: "https://wa.me/message/UCPXYQYNF77ZI1",
    whatsappChannel: "https://whatsapp.com/channel/0029VaCdRDN11ulKCiEexW0g",
    linkedin: "https://pk.linkedin.com/company/almuallim-travels?trk=public_profile_topcard-current-company",
  },
  maps: {
    search:
      "https://www.google.com/maps/search/?api=1&query=48-B,+RJ+Mall,+Main+Rashid+Minhas+Road,+Karachi,+Pakistan",
    embed:
      "https://www.google.com/maps?q=48-B%2C%20RJ%20Mall%2C%20Main%20Rashid%20Minhas%20Road%2C%20Karachi%2C%20Pakistan&z=15&output=embed",
  },
  assets: {
    branding: {
      orgLogo: "/assets/branding/org-logo.png",
      markLogo: "/assets/branding/logo-dark-1.png",
      depchipLogo: "/assets/branding/dep-chip-logo-1.png",
      favicon: "/assets/branding/favicon-32x32.png",
    },
    media: {
      umrahHero: "/assets/media/videos/umrah/hero-journey.mp4",
      pakistanTourVideos: [
        "/assets/media/videos/pakistan/about-1.mp4",
        "/assets/media/videos/pakistan/about-2.mp4",
        "/assets/media/videos/pakistan/about-3.mp4",
      ],
      hajjTrainingPosters: [
        "/assets/media/posters/hajj/hajj-training-1.jpeg",
        "/assets/media/posters/hajj/hajj-training-2.jpeg",
      ],
      hajjPackagePosters: [
        "/assets/media/posters/hajj/hajj-package-1.jpeg",
        "/assets/media/posters/hajj/hajj-package-2.jpeg",
      ],
      makkahImages: [
        "/assets/media/images/makkah/makkah-1.jpg",
        "/assets/media/images/makkah/makkah-2.jpg",
        "/assets/media/images/makkah/makkah-3.jpg",
        "/assets/media/images/makkah/makkah-4.jpg"
      ],
      madinahImages: [
        "/assets/media/images/madinah/madinah-1.jpeg",
        "/assets/media/images/madinah/madinah-2.jpg",
        "/assets/media/images/madinah/madinah-3.webp",
        "/assets/media/images/madinah/madinah-4.jpg"
      ]
    },
  },
} as const;

export const MainNav = [
  {
    icon: "pe-7s-graph",
    label: "Tableau de bord",
    to: "/"
  },
  {
    icon: "pe-7s-browser",
    label: "Restaurant en ligne",
    content: [
      {
        label: "Gestion des plats",
        to: "/plates",
      },
      {
        label: "Gestion des boissons",
        to: "/drinks",
      },
      {
        label: "Gestion des menus",
        to: "/menus",
      }
    ],
  },
  {
    icon: "pe-7s-help1",
    label: "Aide",
    to: "#"
  }
];

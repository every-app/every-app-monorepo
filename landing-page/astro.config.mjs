import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
// import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [
    // TODO Investigate this
    tailwind({
      applyBaseStyles: false,
    }),
    starlight({
      title: "Every App",
      description: "Documentation for EveryApp - Make every app open source",
      logo: {
        src: "./public/transparent-logo.png",
      },
      sidebar: [
        {
          label: "Getting Started",
          items: [
            {
              label: "Introduction",
              slug: "guides/getting-started/introduction",
            },
          ],
        },
      ],
      customCss: ["./src/styles/custom.css"],
      components: {
        Head: "./src/components/Head.astro",
        Header: "./src/components/Header.astro",
      },
      social: {
        github: "https://github.com/yourusername/everyapp",
      },
    }),
  ],
});

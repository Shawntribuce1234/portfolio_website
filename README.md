# Shawn Tribuce — Portfolio

A complete, dependency-free static website inspired by the supplied screen recording and HTML. Includes Home, About, Coursework, and Contact pages.

## Run

Open `index.html` directly for a quick preview. For reliable theme persistence across pages, use the local server with Node.js 18 or later:

```sh
npm start
```

Open http://127.0.0.1:4173. No package installation or build step is required. Stop with Ctrl+C. Use `PORT=8080 npm start` to choose another port.

## Files

- `index.html`: home page and personal introduction
- `about.html`, `coursework.html`, `contact.html`: content pages
- `styles.css`: typography, colors, layout, and mobile breakpoints
- `app.js`: particle animation and theme controls
- `theme-init.js`: early theme restoration
- `favicon.svg`: original network icon
- `server.mjs`: optional local preview server

## Personalization

The About page uses Shawn’s supplied biography and filing-room photo, including his studies, early records-management job, Amazon internship, current data analyst work, and technical experience. No courses, achievements, or contact details have been invented. Coursework has an explicit empty state. Contact includes the supplied phone, confirmed email, and LinkedIn profile. The visitor map is decorative until analytics are connected; no visitor counts or locations are invented.

## Design and behavior

The supplied recording is approximately five seconds long, at 2808 × 1544 pixels. Sampled frames show the desktop home page: black background, light serif text, centered bold name and italic subtitle, upper-right navigation with an underline on Home, a sun icon, and blue connected particles attracted toward the pointer. It does not show other pages, light mode, or mobile views; these use a consistent extension of the observed style.

The supplied HTML confirms a 120-particle network, 180-pixel connection threshold, 200-pixel pointer attraction radius, and persistent light/dark toggle. This project reproduces those interactions with adaptive density on mobile, high-DPI rendering, frame-rate-independent motion, pausing in hidden tabs, and respect for reduced-motion preferences. It omits the other person's identity, quote, analytics endpoint, and browser-extension markup.

Light mode is saved in localStorage under `shawn-theme`. Storage-restricted browsers still support toggling for the current page. Navigation uses relative links for easy static hosting, with no router or external assets required.

## Checks

`npm run check` verifies JavaScript syntax. See `VERIFICATION.md` for the performed checks and environment limits.

## Hosting

Upload the four HTML pages, `styles.css`, `app.js`, `theme-init.js`, `favicon.svg`, and `filing-room.png` together to any static host, retaining the filenames. The project is supplied locally and has not been published.

## Map attribution

The contact-page map uses Natural Earth 1:110m country geometry (public domain), embedded directly in the HTML. Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson

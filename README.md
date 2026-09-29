# M2N Hotels — React Native Mobile App

An Expo + React Native starter app inspired by the visual direction of the M2N Group of Hotels website.

## Included
- Separate React Native screens/pages
- Separate reusable components
- Home / Hotels / Hotel Detail / Rooms / Room Detail
- Gallery
- About
- Contact
- Booking request form
- Bottom-tab navigation
- Dark architectural / editorial hotel visual system
- Centralized content in `src/data/siteData.js`
- Centralized theme in `src/theme/`

## Run

```bash
npm install
npx expo start
```

Then press:
- `a` for Android
- `i` for iOS
- `w` for web

## Important content note

The supplied website is `https://m2nhotels.com/`. Its public page could be opened, but the automated page response did not expose the full page text, navigation structure, contact details or image URLs. To avoid inventing official hotel information, this project keeps editable placeholder contact/booking data in `src/data/siteData.js`.

Replace the image URLs and exact official copy there once you provide/export the website content. The UI components do not need to be rewritten.

## Main structure

```
src/
  components/
    booking/
    common/
    gallery/
    home/
    hotels/
    rooms/
  data/
    siteData.js
  screens/
    AboutScreen.js
    BookingScreen.js
    ContactScreen.js
    GalleryScreen.js
    HotelDetailScreen.js
    HotelsScreen.js
    HomeScreen.js
    RoomDetailScreen.js
    RoomsScreen.js
  theme/
    colors.js
    spacing.js
App.js
```

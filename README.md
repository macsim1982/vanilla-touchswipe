<h1 align="center">Welcome to vanilla-touchswipe 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/macsim1982/vanilla-touchswipe#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/macsim1982/vanilla-touchswipe/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/macsim1982/vanilla-touchswipe/blob/master/LICENSE" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/github/license/macsim1982/vanilla-touchswipe" />
  </a>
</p>

> A simple touchEvent working with mouseevent on desktop and touchevent on touchable devices

### 🏠 [Homepage](https://github.com/macsim1982/vanilla-touchswipe#readme)

## Usage

```javascript
import onTouchSwipe from 'vanilla-touchswipe';

const $wrapper = document.querySelector('.swiper-element');

const touchSwipeEvents = onTouchSwipe($wrapper, {
    min: 60,            // if horizontal swipe trigger move left only if deltaX > 60
    multiplicator: 0.5, // if deltaX = 120 triger horizontal swipe only if deltaY = 0.5 * deltaX
    callbacks: {
        left: (e) => console.log('swipe left', e),
        right: (e) => console.log('swipe right', e),
        start: (e) => console.log('swipe start', e),
        move: (e) => console.log('swipe move', e),
        end: (e) => console.log('swipe end', e),
        cancel: (e) => console.log('swipe cancel', e)
    }
});

// unbind events
touchSwipeEvents.unbind();

```


## Author

👤 **Maxime Lerouge**

* Github: [@macsim1982](https://github.com/macsim1982)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2024 [Maxime Lerouge](https://github.com/macsim1982).<br />
This project is [MIT](https://github.com/macsim1982/vanilla-touchswipe/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_

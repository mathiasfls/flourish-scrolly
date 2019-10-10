# flourish-scrolly
An easy way to add Flourish scrollytelling into any web page without coding

## How to use
* Add one or more Flourish stories in your page using the standard embed codes from https://flourish.studio, e.g.:

```
<div class="flourish-embed" data-src="story/92334"></div><script src="https://public.flourish.studio/resources/embed.js"></script>
```

* Include the library at the bottom of your page, either by hosting it locally or linking to the CDN like this:

```
<script src="https://cdn.flourish.rocks/flourish-scrolly-v1.0.0.min.js"></script>
```

* To trigger a slide change when a piece of text is scrolled to the middle of the screen, just add a link to  that text in the form `#story/story_id/slide-1` (`story_id` is visible in the embed code; `slide-1` is the first slide).

* The page will be automtically reformatted so that stories with any associated links “stick” to the vertical center of the window at the appropriate times during scroll.

## Notes

* In scrolly mode, embedded Flourish stories always have a fixed height (as opposed to the height being based on the contents of the story). If not specified, `75vh` is used (i.e. the story fills 75% of the window height). You can override this for any story by specifying a height in the embed code in the usual way, e.g. `data-height="80vh"`.

* The special links that trigger the slide changes on scroll can also be clicked to trigger the same slide.
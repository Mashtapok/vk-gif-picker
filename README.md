# Gif picker

A mini chat app with an input field where you can pick and send GIFs using the `/gif` command.

![image](https://i.imgur.com/3LW80PU.png)

---

## Demo

[Live app](https://mashtapok.github.io/vk-gif-picker/)

---

## Stack

* React
* TypeScript
* react-transition-group

## Features

* Opens the picker when you type `/gif` and treats the text after a space as the search query
* Shows trending GIFs when `/gif` is followed by a space but no search query
* Highlights the `/gif` command with a gradient
* Masonry grid layout for GIFs
* Infinite scroll with lazy loading
* Sends the selected GIF to the message list
* Sends text messages on Enter
* Groups messages by time
* Select and delete messages
* Keyboard navigation and accessibility
* Light and dark themes with automatic browser theme detection

---

### Command highlighting

I considered two approaches for highlighting `/gif`:

1. A native `<textarea>` with hidden text and an overlay that renders parsed content with highlighting when the command is entered.
2. A custom input built with the `contentEditable` attribute.

I went with the second option because it felt more challenging and interesting to implement.

### Accessibility

* Keyboard navigation with `TAB` (arrow-key navigation in a masonry grid is quite hard; I did not have time to solve it).
* Sends a message on `Enter` when a GIF is focused.
* Closes the picker on `Escape`.
* Uses `alt`, `aria-label`, and other ARIA attributes.

### Optimizations

* Debounced search input
* Dynamic pagination (25 GIFs per page) with debounced scroll
* Requests a focused set of image renditions from the Giphy API to reduce response size

### Original Figma design

[link](https://www.figma.com/file/tiqe4OR4MQXNZKeB9GmxL3/GIF-picker)

### Running with Docker

1. Remove the `homepage` field from `package.json` first (it is used for gh-pages).
2. Run: `docker build -t vk-test .`
3. Then: `docker run -dp <your_port>:8080 vk-test`
4. Open the app at `http://localhost:<your_port>`

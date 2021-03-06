const resourceCache = {};
const readyCallbacks = [];

/* This is the publicly accessible image loading function. It accepts
     * an array of strings pointing to image files or a string for a single
     * image. It will then call our private image loading function accordingly.
     */
function load(urlOrArr) {
  if (Array.isArray(urlOrArr)) {
    urlOrArr.forEach(_load);
  } else {
    _load(urlOrArr);
  }
}

/* This is our private image loader function, it is
     * called by the public image loader function.
     */
function _load(url) {
  if (resourceCache[url]) {
    /* If this URL has been previously loaded it will exist within
                 * our resourceCache array. Just return that image rather
                 * re-loading the image.
                 */
    return resourceCache[url];
  } else {
    /* This URL has not been previously loaded and is not present
                 * within our cache; we'll need to load this image.
                 */
    const img = new Image();
    img.onload = function() {
      /* Once our image has properly loaded, add it to our cache
                       * so that we can simply return this image if the developer
                       * attempts to load this file in the future.
                       */
      resourceCache[url] = img;

      /* Once the image is actually loaded and properly cached,
                       * call all of the onReady() callbacks we have defined.
                       */
      if (isReady()) {
        readyCallbacks.forEach(f => f());
      }
    };

    /* Set the initial cache value to false, this will change when
                 * the image's onload event handler is called. Finally, point
                 * the image's src attribute to the passed in URL.
                 */
    resourceCache[url] = false;
    img.src = url;
  }
}

/* This is used by developers to grab references to images they know
     * have been previously loaded. If an image is cached, this functions
     * the same as calling load() on that URL.
     */
function get(url) {
  return resourceCache[url];
}

/* This function determines if all of the images that have been requested
     * for loading have in fact been properly loaded.
     */
function isReady() {
  let ready = true;
  for (const k in resourceCache) {
    if (resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
      ready = false;
    }
  }
  return ready;
}

/* This function will add a function to the callback stack that is called
     * when all requested images are properly loaded.
     */
function onReady(func) {
  readyCallbacks.push(func);
}

const Resources = {
  load,
  get,
  onReady,
  isReady,
};
export default Resources;

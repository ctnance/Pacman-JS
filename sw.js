self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("static").then((cache) => {
      return cache.addAll([
        "./",
        "./styles/styles.css",
        "./images/pacman-logo-192.png",
        "./sfx/eat_ghost.mp3",
        "./sfx/extra_life.mp3",
        "./sfx/ghost_retreat.mp3",
        "./sfx/ghost_siren.mp3",
        "./sfx/level_start.mp3",
        "./sfx/pacman_death.mp3",
        "./sfx/pacman_munch.mp3",
        "./sfx/power_pellet.mp3",
        "./sfx/victory.mp3",
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // return response if cached, otherwise, check the network
      return response || fetch(e.request);
    })
  );
});

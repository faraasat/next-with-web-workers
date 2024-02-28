// services/posts.ts

import { faker } from "@faker-js/faker";

import { IFetchPosts } from "@/types";

const posts: Array<IFetchPosts> = [];

(function () {
  if (posts && posts.length > 0) {
    self.postMessage(posts);
  } else {
    for (let i = 0; i < 500; i++) {
      posts.push({
        id: faker.string.uuid(),
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        image: faker.image.urlPicsumPhotos({ width: 200, height: 200 }),
        email: faker.internet.email(),
        author: faker.person.fullName(),
        date: faker.date.anytime(),
        commentCount: faker.number.int({ min: 0, max: 1000 }),
        avatar: faker.image.avatar(),
      });
    }

    // posting a message to main thread when posts are generated
    self.postMessage(posts);
  }
})();

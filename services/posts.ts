import { faker } from "@faker-js/faker";

import { IFetchPosts } from "@/types";

export const fetchPosts = ((): (() => Promise<Array<IFetchPosts>>) => {
  const posts: Array<IFetchPosts> = [];

  return () => {
    if (posts && posts.length > 0) {
      return Promise.resolve(posts);
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

      return Promise.resolve(posts);
    }
  };
})();

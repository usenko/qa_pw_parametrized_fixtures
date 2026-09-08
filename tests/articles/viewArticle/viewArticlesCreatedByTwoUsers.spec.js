import { test } from '../../_fixtures/fixtures';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';

test.use({ contextsNumber: 3, usersNumber: 3 });

test.beforeEach(
  async ({ pages, users, articleWithoutTags, articleWithOneTag }) => {
    await signUpUser(pages[0], users[0], 1);
    await signUpUser(pages[1], users[1], 2);
    await signUpUser(pages[2], users[2], 3);
    await createArticle(pages[0], articleWithoutTags, 1);
    await createArticle(pages[1], articleWithOneTag, 2);
  },
);

test(`View articles from two different users in 'Your feeds'`, async ({
  articleWithoutTags,
  pages,
  users,
}) => {
  const viewArticlePage = new ViewArticlePage(pages[2], 3);

  await viewArticlePage.open(articleWithoutTags.url);

  await viewArticlePage.assertArticleTitleIsVisible(articleWithoutTags.title);
  await viewArticlePage.assertArticleTextIsVisible(articleWithoutTags.text);
  await viewArticlePage.assertArticleAuthorNameIsVisible(users[0].username);
});

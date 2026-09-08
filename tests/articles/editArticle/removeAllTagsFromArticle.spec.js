import { test } from '../../_fixtures/fixtures';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';

const testParameters = [
  { tagsNumber: 1, testNameEnding: 'one tag' },
  { tagsNumber: 2, testNameEnding: 'two tags' },
  { tagsNumber: 5, testNameEnding: 'five tag' },
];

testParameters.forEach(({ tagsNumber, testNameEnding }) => {
  test.describe('Remove all tags from previously created article', () => {
    let slug;
    let articleUrl;
    let article;
    test.beforeEach(async ({ page, user, logger }) => {
      article = generateNewArticleData(logger, tagsNumber);
      await signUpUser(page, user);
      await createArticle(page, article, tagsNumber);
      articleUrl = article.url;
      let urlObj = new URL(articleUrl);
      slug = urlObj.pathname.trim().split('/').at(-1);
    });

    test(`
        Remove all tags from article with ${testNameEnding}`, async ({
      viewArticlePage,
      createArticlePage,
    }) => {
      await createArticlePage.open(slug);
      await createArticlePage.removeAllTags();
      await createArticlePage.clickPublishArticleButton();

      await viewArticlePage.assertArticlePageOpened(slug);
      await viewArticlePage.assertArticleTitleIsVisible(article.title);
      await viewArticlePage.assertArticleTextIsVisible(article.text);
      await viewArticlePage.assertArticleTagsAreNotVisible(article.tags);
    });
  });
});

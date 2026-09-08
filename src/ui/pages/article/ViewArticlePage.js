import { expect, testStep } from '../../../common/pwHelpers/pw';

export class ViewArticlePage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.articleTitleHeader = page.getByRole('heading');
  }

  authorLinkInArticleHeader(username) {
    return this.page.getByRole('link', { username }).first();
  }

  tagListItem(tagName) {
    return this.page.getByRole('listitem').filter({ hasText: tagName });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  url() {
    return this.page.url();
  }

  async open(url) {
    await this.step(`Open 'View Article' page`, async () => {
      await this.page.goto(url);
    });
  }

  async clickFollowButton(username) {
    await this.step(`Click the 'Follow ${username}' button`, async () => {
      const responsePromise = this.page.waitForResponse(
        response => {
          const lowerCaseUrl = response.url().toLowerCase();
          const targetPattern = `profiles/${username.toLowerCase()}/follow`;

          return (
            lowerCaseUrl.includes(targetPattern) &&
            response.request().method() === 'POST' &&
            response.status() === 200
          );
        },
        { timeout: 1000 },
      );
      await this.getFollowButton(username).click();
      await responsePromise;
      await expect(this.getUnfollowButton(username)).toBeVisible();
    });
  }

  async assertArticleTitleIsVisible(title) {
    await this.step(`Assert the article has correct title`, async () => {
      await expect(this.articleTitleHeader).toContainText(title);
    });
  }

  async assertArticleAuthorNameIsVisible(username) {
    await this.step(
      `Assert the article has correct author username`,
      async () => {
        await expect(this.authorLinkInArticleHeader(username)).toBeVisible();
      },
    );
  }

  async assertArticleTextIsVisible(text) {
    await this.step(`Assert the article has correct text`, async () => {
      await expect(this.page.getByText(text)).toBeVisible();
    });
  }

  async assertArticleTagsAreVisible(tags) {
    await this.step(`Assert the article has correct tags`, async () => {
      for (let i = 0; i < tags.length; i++) {
        await expect(this.tagListItem(tags[i])).toBeVisible();
      }
    });
  }

  async assertArticleTagsAreNotVisible(tags) {
    await this.step(`Assert the article has no tags`, async () => {
      for (let i = 0; i < tags.length; i++) {
        await expect(this.tagListItem(tags[i])).toBeHidden();
      }
    });
  }

  async assertArticlePageOpened(urlPart) {
    await this.step(
      `Assert that Article page with path '${urlPart}' is opened`,
      async () => {
        await expect(this.page).toHaveURL(new RegExp(`/article/${urlPart}`));
      },
    );
  }
}
